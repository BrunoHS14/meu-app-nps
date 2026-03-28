import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceSupabase } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook signature inválida' }, { status: 400 })
  }

  const supabase = createServiceSupabase()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const orgId = session.metadata?.org_id
      const plan = session.metadata?.plan || 'starter'
      if (!orgId) break

      await supabase.from('organizations').update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan,
        subscription_status: 'active',
        emails_limit: plan === 'pro' ? -1 : 500,
      }).eq('id', orgId)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('stripe_subscription_id', sub.id)
        .single()
      if (org) {
        await supabase.from('organizations').update({
          subscription_status: sub.status,
        }).eq('id', org.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('stripe_subscription_id', sub.id)
        .single()
      if (org) {
        await supabase.from('organizations').update({
          plan: 'trial',
          subscription_status: 'canceled',
          emails_limit: 50,
        }).eq('id', org.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
