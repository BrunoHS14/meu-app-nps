'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

type Tab = 'overview' | 'send' | 'responses'

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('overview')
  const [org, setOrg] = useState<any>(null)
  const [sends, setSends] = useState<any[]>([])
  const [surveys, setSurveys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Send form state
  const [emailsInput, setEmailsInput] = useState('')
  const [emailList, setEmailList] = useState<string[]>([])
  const [selectedSurvey, setSelectedSurvey] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState('')

  // Filters
  const [filterSegment, setFilterSegment] = useState('')
  const [filterDays, setFilterDays] = useState('')

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: orgData } = await supabase
      .from('organizations').select('*').eq('owner_id', user.id).single()
    if (!orgData) { router.push('/login'); return }
    setOrg(orgData)

    const { data: surveyData } = await supabase
      .from('surveys').select('*').eq('org_id', orgData.id).order('created_at', { ascending: false })
    setSurveys(surveyData || [])

    const { data: sendData } = await supabase
      .from('survey_sends').select('*').eq('org_id', orgData.id).order('sent_at', { ascending: false })
    setSends(sendData || [])

    if ((surveyData || []).length === 0) {
      // Criar pesquisa padrão
      const { data: newSurvey } = await supabase.from('surveys').insert({
        org_id: orgData.id,
        name: 'Pesquisa principal',
        question: 'Em uma escala de 0 a 10, o quanto você recomendaria ' + orgData.name + ' para um amigo?',
      }).select().single()
      if (newSurvey) { setSurveys([newSurvey]); setSelectedSurvey(newSurvey.id) }
    } else {
      setSelectedSurvey((surveyData || [])[0]?.id || '')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Metrics
  const answered = sends.filter(s => s.score !== null)
  const promoters = answered.filter(s => s.score >= 9)
  const neutrals = answered.filter(s => s.score >= 7 && s.score <= 8)
  const detractors = answered.filter(s => s.score <= 6)
  const nps = answered.length
    ? Math.round((promoters.length / answered.length - detractors.length / answered.length) * 100)
    : 0
  const responseRate = sends.length ? Math.round((answered.length / sends.length) * 100) : 0

  // Chart data - distribution
  const distData = Array.from({ length: 11 }, (_, i) => ({
    score: String(i),
    count: answered.filter(s => s.score === i).length,
    color: i >= 9 ? '#16a34a' : i >= 7 ? '#d97706' : '#dc2626',
  }))

  // Trend by month
  const trendMap: Record<string, number[]> = {}
  answered.forEach(s => {
    const m = s.responded_at?.slice(0, 7) || s.sent_at?.slice(0, 7)
    if (!trendMap[m]) trendMap[m] = []
    trendMap[m].push(s.score)
  })
  const trendData = Object.entries(trendMap).sort().map(([month, scores]) => {
    const p = scores.filter(s => s >= 9).length
    const d = scores.filter(s => s <= 6).length
    return { month, nps: Math.round((p / scores.length - d / scores.length) * 100) }
  })

  // Filtered responses
  let filteredSends = sends.filter(s => s.score !== null)
  if (filterSegment === 'promoter') filteredSends = filteredSends.filter(s => s.score >= 9)
  if (filterSegment === 'neutral') filteredSends = filteredSends.filter(s => s.score >= 7 && s.score <= 8)
  if (filterSegment === 'detractor') filteredSends = filteredSends.filter(s => s.score <= 6)
  if (filterDays) {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - parseInt(filterDays))
    filteredSends = filteredSends.filter(s => new Date(s.sent_at) >= cutoff)
  }

  // Send emails
  async function handleSend() {
    if (!emailList.length || !selectedSurvey) return
    setSending(true); setSendResult('')
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyId: selectedSurvey, emails: emailList, orgId: org.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult(`✓ ${data.sent} e-mail(s) enviados com sucesso!`)
        setEmailList([])
        setEmailsInput('')
        load()
      } else {
        setSendResult('Erro: ' + (data.error || 'Falha ao enviar'))
      }
    } catch {
      setSendResult('Erro de conexão. Tente novamente.')
    }
    setSending(false)
  }

  function addEmails() {
    const parsed = emailsInput.split(/[\n,;]+/).map(e => e.trim()).filter(e => e.includes('@'))
    setEmailList(prev => Array.from(new Set([...prev, ...parsed])))
    setEmailsInput('')
  }

  function exportCSV() {
    const header = 'E-mail,Nota,Segmento,Data\n'
    const rows = filteredSends.map(s => {
      const seg = s.score >= 9 ? 'Promotor' : s.score >= 7 ? 'Neutro' : 'Detrator'
      return `${s.recipient_email},${s.score},${seg},${s.sent_at?.slice(0,10)}`
    }).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'nps-respostas.csv'; a.click()
  }

  async function signOut() {
    await supabase.auth.signOut(); router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-6">
        <span className="font-semibold text-sm">NPS Pro</span>
        <span className="text-xs text-gray-400">|</span>
        <span className="text-sm font-medium text-gray-700">{org?.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${org?.plan === 'trial' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
          {org?.plan === 'trial' ? 'Trial' : org?.plan === 'pro' ? 'Pro' : 'Starter'}
        </span>
        {org?.plan === 'trial' && (
          <a href="/dashboard/upgrade" className="ml-auto text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700">
            Fazer upgrade →
          </a>
        )}
        <a href="/dashboard/pesquisas" className="text-sm text-gray-500 hover:text-gray-900">Pesquisas</a>
        <button onClick={signOut} className={`text-xs text-gray-400 hover:text-gray-600 ${org?.plan !== 'trial' ? 'ml-auto' : ''}`}>
          Sair
        </button>
      </nav>

      {/* TABS */}
      <div className="bg-white border-b border-gray-100 px-6 flex gap-0">
        {([['overview','Dashboard'],['send','Enviar'],['responses','Respostas']] as [Tab,string][]).map(([key, label]) => (
          <button
            key={key} onClick={() => setTab(key)}
            className={`text-sm px-4 py-3 border-b-2 transition ${tab === key ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'NPS Score', value: (nps >= 0 ? '+' : '') + nps, color: 'text-blue-700', sub: 'promotores − detratores' },
                { label: 'Taxa de resposta', value: responseRate + '%', color: 'text-gray-900', sub: answered.length + ' responderam' },
                { label: 'Promotores', value: answered.length ? Math.round(promoters.length/answered.length*100)+'%' : '—', color: 'text-green-700', sub: 'notas 9–10' },
                { label: 'Detratores', value: answered.length ? Math.round(detractors.length/answered.length*100)+'%' : '—', color: 'text-red-600', sub: 'notas 0–6' },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                  <div className={`text-3xl font-semibold ${m.color}`}>{m.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="text-sm font-medium text-gray-500 mb-4">Distribuição de notas</div>
                {answered.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-sm text-gray-400">Sem respostas ainda</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={distData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <XAxis dataKey="score" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4,4,0,0]}>
                        {distData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="text-sm font-medium text-gray-500 mb-4">NPS ao longo do tempo</div>
                {trendData.length < 2 ? (
                  <div className="h-48 flex items-center justify-center text-sm text-gray-400">Dados insuficientes para tendência</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="nps" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Segmentation bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-sm font-medium text-gray-500 mb-4">Segmentação NPS</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Detratores', sub: '0–6', pct: answered.length ? Math.round(detractors.length/answered.length*100) : 0, n: detractors.length, color: 'text-red-600' },
                  { label: 'Neutros', sub: '7–8', pct: answered.length ? Math.round(neutrals.length/answered.length*100) : 0, n: neutrals.length, color: 'text-amber-600' },
                  { label: 'Promotores', sub: '9–10', pct: answered.length ? Math.round(promoters.length/answered.length*100) : 0, n: promoters.length, color: 'text-green-700' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-xs text-gray-400 mb-1">{s.label} <span className="text-gray-300">({s.sub})</span></div>
                    <div className={`text-3xl font-semibold ${s.color}`}>{s.pct}%</div>
                    <div className="text-xs text-gray-400">{s.n} pessoas</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEND */}
        {tab === 'send' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-medium mb-4">Destinatários</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {emailList.map(email => (
                    <span key={email} className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                      {email}
                      <button onClick={() => setEmailList(l => l.filter(e => e !== email))} className="text-gray-400 hover:text-gray-700 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
                <textarea
                  value={emailsInput} onChange={e => setEmailsInput(e.target.value)}
                  placeholder="cole e-mails separados por vírgula ou quebra de linha..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button onClick={addEmails} className="mt-2 text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                  Adicionar
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-medium mb-3">Pesquisa</h3>
                <select
                  value={selectedSurvey} onChange={e => setSelectedSurvey(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {surveys.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {sendResult && (
                <div className={`text-sm px-4 py-3 rounded-lg ${sendResult.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {sendResult}
                </div>
              )}

              <div className="text-xs text-gray-400">
                Limite do plano: {org?.emails_sent_this_month || 0} / {org?.emails_limit === -1 ? '∞' : org?.emails_limit} e-mails este mês
              </div>

              <button
                onClick={handleSend} disabled={!emailList.length || sending}
                className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-40 transition"
              >
                {sending ? 'Enviando...' : `Enviar para ${emailList.length} destinatário(s) →`}
              </button>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-medium mb-4 text-gray-500">Pré-visualização do e-mail</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm leading-relaxed space-y-3">
                <div className="font-medium text-gray-800">
                  Assunto: {surveys.find(s => s.id === selectedSurvey)?.name || 'Pesquisa de satisfação'}
                </div>
                <div className="text-gray-600">
                  {surveys.find(s => s.id === selectedSurvey)?.question || 'Qual a sua nota?'}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: 11 }, (_, i) => (
                    <span key={i} className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium border ${i >= 9 ? 'bg-green-100 border-green-200 text-green-800' : i >= 7 ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                      {i}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400">0 = Muito improvável · 10 = Muito provável</div>
                <div className="text-xs text-gray-400">
                  {surveys.find(s => s.id === selectedSurvey)?.thank_you_message}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESPONSES */}
        {tab === 'responses' && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
              <h3 className="text-sm font-medium">Respostas recebidas</h3>
              <div className="flex gap-2 flex-wrap">
                <select value={filterSegment} onChange={e => setFilterSegment(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5">
                  <option value="">Todos os segmentos</option>
                  <option value="promoter">Promotores</option>
                  <option value="neutral">Neutros</option>
                  <option value="detractor">Detratores</option>
                </select>
                <select value={filterDays} onChange={e => setFilterDays(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5">
                  <option value="">Todos os períodos</option>
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                </select>
                <button onClick={exportCSV} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                  Exportar CSV
                </button>
              </div>
            </div>
            {filteredSends.length === 0 ? (
              <div className="text-center py-16 text-sm text-gray-400">
                Nenhuma resposta encontrada. Envie pesquisas para começar!
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['E-mail','Nota','Segmento','Data'].map(h => (
                      <th key={h} className="text-left text-xs text-gray-400 font-medium pb-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSends.map(s => {
                    const seg = s.score >= 9 ? { label: 'Promotor', cls: 'bg-green-50 text-green-700' }
                      : s.score >= 7 ? { label: 'Neutro', cls: 'bg-amber-50 text-amber-700' }
                      : { label: 'Detrator', cls: 'bg-red-50 text-red-700' }
                    return (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 text-gray-700">{s.recipient_email}</td>
                        <td className="py-3">
                          <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-medium ${seg.cls}`}>
                            {s.score}
                          </span>
                        </td>
                        <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${seg.cls}`}>{seg.label}</span></td>
                        <td className="py-3 text-xs text-gray-400">{s.sent_at?.slice(0,10)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
