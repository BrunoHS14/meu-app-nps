import { createServiceSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import RespondClient from './RespondClient'

export default async function SurveyPage({
  params, searchParams
}: {
  params: { token: string }
  searchParams: { score?: string; unsubscribe?: string }
}) {
  const supabase = createServiceSupabase()

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

  // Auto-submit if score in URL (clicked from email)
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

  if (send.score !== null) redirect(`/survey/${params.token}/thanks?score=${send.score}`)

  return (
    <RespondClient
      token={params.token}
      question={send.surveys?.question || ''}
      orgName={send.organizations?.name || ''}
      surveyType={send.surveys?.type || 'nps'}
      color={send.surveys?.color || '#111827'}
    />
  )
}
