import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { surveyId, emails, orgId } = await req.json()
    if (!surveyId || !emails?.length || !orgId) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const supabase = createServiceSupabase()

    // Verificar organização e limites
    const { data: org } = await supabase
      .from('organizations').select('*').eq('id', orgId).single()
    if (!org) return NextResponse.json({ error: 'Organização não encontrada' }, { status: 404 })

    if (org.emails_limit !== -1 && (org.emails_sent_this_month + emails.length) > org.emails_limit) {
      return NextResponse.json({ error: 'Limite de e-mails do plano atingido. Faça upgrade para continuar.' }, { status: 403 })
    }

    // Buscar pesquisa
    const { data: survey } = await supabase
      .from('surveys').select('*').eq('id', surveyId).single()
    if (!survey) return NextResponse.json({ error: 'Pesquisa não encontrada' }, { status: 404 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    let sent = 0

    for (const email of emails) {
      // Criar registro de envio com token único
      const { data: sendRecord } = await supabase
        .from('survey_sends').insert({
          survey_id: surveyId,
          org_id: orgId,
          recipient_email: email,
        }).select().single()

      if (!sendRecord) continue

      const surveyUrl = `${appUrl}/survey/${sendRecord.token}`

      // Gerar botões de nota
      const scoreButtons = Array.from({ length: 11 }, (_, i) => {
        const color = i >= 9 ? '#16a34a' : i >= 7 ? '#d97706' : '#6b7280'
        return `<a href="${surveyUrl}?score=${i}" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;background:#f9f9f9;border:1px solid #e5e7eb;border-radius:8px;color:${color};font-weight:600;font-size:14px;text-decoration:none;margin:2px;">${i}</a>`
      }).join('')

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'pesquisa@nospro.com.br',
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
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;" />
              <p style="font-size:11px;color:#d1d5db;margin:0;">
                Você está recebendo este e-mail porque tem uma relação com ${org.name}.
                Para não receber mais, <a href="${surveyUrl}?unsubscribe=1" style="color:#9ca3af;">clique aqui</a>.
              </p>
            </div>
          </body>
          </html>
        `,
      })
      sent++
    }

    // Atualizar contador
    await supabase.from('organizations').update({
      emails_sent_this_month: (org.emails_sent_this_month || 0) + sent
    }).eq('id', orgId)

    return NextResponse.json({ sent })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
