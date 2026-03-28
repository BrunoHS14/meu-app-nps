import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import RespondClient from './RespondClient'

export default async function SurveyPage({
  params, searchParams
}: {
  params: { token: string }
  searchParams: { score?: string; unsubscribe?: string }
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: send } = await supabase
    .from('survey_sends')
    .select('*, surveys(*), organizations(*)')
    .eq('token', params.token)
    .single()

  if (!send) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Link inválido ou expirado.
    </div>
  )

  // === NOVIDADE: CÓDIGO DA LGPD (UNSUBSCRIBE) ===
  if (searchParams.unsubscribe === '1') {
    // Salva o e-mail na lista de bloqueio do banco
    await supabase.from('unsubscribes').insert({
      org_id: send.org_id,
      email: send.recipient_email
    })

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            👋
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Inscrição Cancelada</h1>
          <p className="text-gray-500 text-sm">
            O e-mail <strong>{send.recipient_email}</strong> foi removido com sucesso. Você não receberá mais pesquisas de {send.organizations?.name}.
          </p>
        </div>
      </div>
    )
  }
  // ===============================================

  if (searchParams.score !== undefined && send.score === null) {
    const score = parseInt(searchParams.score)
    if (score >= 0 && score <= 10) {
      await supabase.from('survey_sends').update({
        score,
        responded_at: new Date().toISOString(),
      }).eq('token', params.token)
      
      redirect(`/survey/${params.token}/thanks?score=${score}`)
    }
  }

  if (send.score !== null) {
    redirect(`/survey/${params.token}/thanks?score=${send.score}`)
  }

  return (
    <RespondClient
      token={params.token}
      question={send.surveys?.question}
      orgName={send.organizations?.name}
    />
  )
}