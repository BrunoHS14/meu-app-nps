import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { token, score } = await req.json()
  if (!token || score === undefined) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const supabase = createServiceSupabase()

  const { data: send } = await supabase
    .from('survey_sends').select('id, score').eq('token', token).single()

  if (!send) return NextResponse.json({ error: 'Token não encontrado' }, { status: 404 })
  if (send.score !== null) return NextResponse.json({ message: 'Já respondido' })

  await supabase.from('survey_sends').update({
    score,
    responded_at: new Date().toISOString(),
  }).eq('token', token)

  return NextResponse.json({ ok: true })
}
