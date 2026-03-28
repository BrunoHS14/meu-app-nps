import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { surveyId, emails, orgId } = await req.json()
    
    if (!surveyId || !emails?.length || !orgId) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // 1. Conexão com o banco
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 2. Verificar organização
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single()

    if (orgError || !org) {
      console.error("Erro do Supabase ao buscar Org:", orgError)
      return NextResponse.json({ error: 'Organização não encontrada no banco' }, { status: 404 })
    }

    // 3. Verificar pesquisa
    const { data: survey } = await supabase
      .from('surveys').select('*').eq('id', surveyId).single()
      
    if (!survey) return NextResponse.json({ error: 'Pesquisa não encontrada' }, { status: 404 })

    // 4. VERIFICAÇÃO DO CARTEIRO (RESEND)
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: 'Falta a chave RESEND_API_KEY no seu arquivo .env' }, { status: 500 })
    }
    const resend = new Resend(resendKey)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    let sent = 0

    for (const email of emails) {
      // === NOVIDADE 1: A TRAVA DA LGPD ===
      const { data: isUnsubscribed } = await supabase
        .from('unsubscribes')
        .select('id')
        .eq('org_id', orgId)
        .eq('email', email)
        .single()

      if (isUnsubscribed) {
        console.log(`Envio bloqueado LGPD: ${email} pediu para sair da lista.`)
        continue // Pula este cliente e vai para o próximo da lista!
      }
      // =====================================

      // Criar registro de envio
      const { data: sendRecord } = await supabase
        .from('survey_sends').insert({
          survey_id: surveyId,
          org_id: orgId,
          recipient_email: email,
        }).select().single()

      if (!sendRecord) continue

      const surveyUrl = `${appUrl}/survey/${sendRecord.token}`

      // Gerar botões de nota do e-mail
      const scoreButtons = Array.from({ length: 11 }, (_, i) => {
        const color = i >= 9 ? '#16a34a' : i >= 7 ? '#d97706' : '#6b7280'
        return `<a href="${surveyUrl}?score=${i}" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;background:#f9f9f9;border:1px solid #e5e7eb;border-radius:8px;color:${color};font-weight:600;font-size:14px;text-decoration:none;margin:2px;">${i}</a>`
      }).join('')

      // O envio do e-mail
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', 
        to: email,
        subject: `Como você avalia ${org.name}?`,
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
          <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 20px;">
            <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
              <h2 style="font-size:20px;font-weight:600;color:#111827;margin:0 0 8px;">
                Sua opinião vale muito para nós 💙
              </h2>
              <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
                ${survey.question}
              </p>
              <p style="font-size:12px;color:#9ca3af;margin:0 0 12px;">Clique no número abaixo:</p>
              <div style="margin:0 0 8px;">${scoreButtons}</div>
              <p style="font-size:11px;color:#9ca3af;margin:16px 0 0;">
                0 = Muito improvável &nbsp;·&nbsp; 10 = Muito provável
              </p>
              <!-- NOVIDADE 2: O LINK DA LGPD NO RODAPÉ DO E-MAIL -->
              <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 11px; color: #9ca3af; margin: 0;">
                  Para não receber mais pesquisas, <a href="${surveyUrl}?unsubscribe=1" style="color: #6b7280; text-decoration: underline;">clique aqui</a>.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
      sent++
    }

    // Atualizar contador de envios
    await supabase.from('organizations').update({
      emails_sent_this_month: (org.emails_sent_this_month || 0) + sent
    }).eq('id', orgId)

    return NextResponse.json({ sent })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}