'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const TYPE_LABEL: Record<string, string> = {
  nps: 'NPS (0–10)',
  csat: 'CSAT (0–5)',
  open: 'Pergunta aberta',
}

const TYPE_COLOR: Record<string, string> = {
  nps: 'bg-blue-50 text-blue-700',
  csat: 'bg-amber-50 text-amber-700',
  open: 'bg-purple-50 text-purple-700',
}

export default function PesquisasPage() {
  const router = useRouter()
  const supabase = createClient()
  const [surveys, setSurveys] = useState<any[]>([])
  const [org, setOrg] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: orgData } = await supabase
      .from('organizations').select('*').eq('owner_id', user.id).single()
    if (!orgData) { router.push('/login'); return }
    setOrg(orgData)

    const { data } = await supabase
      .from('surveys')
      .select('*, survey_sends(count)')
      .eq('org_id', orgData.id)
      .order('created_at', { ascending: false })

    setSurveys(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('surveys').update({ active: !current }).eq('id', id)
    setSurveys(s => s.map(sv => sv.id === id ? { ...sv, active: !current } : sv))
  }

  async function deleteSurvey(id: string) {
    if (!confirm('Tem certeza? Isso apagará a pesquisa e todas as respostas associadas.')) return
    setDeleting(id)
    await supabase.from('surveys').delete().eq('id', id)
    setSurveys(s => s.filter(sv => sv.id !== id))
    setDeleting(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-700">← Dashboard</Link>
        <span className="text-gray-200">|</span>
        <span className="text-sm font-medium text-gray-700">Minhas Pesquisas</span>
        {org && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${org.plan === 'trial' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
            {org.plan === 'trial' ? 'Trial' : org.plan === 'pro' ? 'Pro' : 'Starter'}
          </span>
        )}
        <Link
          href="/dashboard/pesquisas/nova"
          className="ml-auto text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          + Nova pesquisa
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {surveys.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma pesquisa ainda</h2>
            <p className="text-sm text-gray-400 mb-6">
              Crie sua primeira pesquisa e comece a coletar o feedback dos seus clientes.
            </p>
            <Link
              href="/dashboard/pesquisas/nova"
              className="inline-block bg-gray-900 text-white text-sm px-6 py-3 rounded-xl hover:bg-gray-700 transition"
            >
              Criar primeira pesquisa →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {surveys.map(sv => {
              const totalSends = sv.survey_sends?.[0]?.count ?? 0
              return (
                <div
                  key={sv.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4"
                >
                  {/* Color dot */}
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: sv.color || '#111827' }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm truncate">{sv.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLOR[sv.type] || 'bg-gray-100 text-gray-600'}`}>
                        {TYPE_LABEL[sv.type] || sv.type}
                      </span>
                      {!sv.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                          Pausada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{sv.question}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{totalSends} envios · criada em {sv.created_at?.slice(0, 10)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(sv.id, sv.active)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition ${sv.active ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                    >
                      {sv.active ? 'Pausar' : 'Ativar'}
                    </button>
                    <Link
                      href={`/dashboard/pesquisas/nova?edit=${sv.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteSurvey(sv.id)}
                      disabled={deleting === sv.id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition disabled:opacity-40"
                    >
                      {deleting === sv.id ? '...' : 'Apagar'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
