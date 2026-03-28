import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import RespondClient from './RespondClient'

export default async function SurveyPage({
  params, searchParams
}: {
  params: { token: string }
  searchParams: { score?: string; unsubscribe?: string }
}) {
  // 1. Usando a conexão segura e padrão
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 2. Busca a pesquisa no banco
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

  // 3. Salva a nota no banco (se veio do clique do e-mail)
  if (searchParams.score !== undefined && send.score === null) {
    const score = parseInt(searchParams.score)
    if (score >= 0 && score <= 10) {
      await supabase.from('survey_sends').update({
        score,
        responded_at: new Date().toISOString(),
      }).eq('token', params.token)
      
      // Joga para a sua tela de Thanks bonitona!
      redirect(`/survey/${params.token}/thanks?score=${score}`)
    }
  }

  // Se a pessoa clicar no link de novo depois de já ter votado
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