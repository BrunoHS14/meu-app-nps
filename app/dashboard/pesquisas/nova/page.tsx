'use client'
import { Suspense } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

// ─── Tipos ───────────────────────────────────────────────────────────────────
type SurveyType = 'nps' | 'csat' | 'open'

const TYPES = [
  {
    id: 'nps' as SurveyType,
    label: 'NPS',
    desc: 'Nota de 0 a 10 — mede lealdade',
    icon: '📊',
    color: 'border-blue-400 bg-blue-50',
    tag: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'csat' as SurveyType,
    label: 'CSAT',
    desc: 'Estrelas de 1 a 5 — mede satisfação',
    icon: '⭐',
    color: 'border-amber-400 bg-amber-50',
    tag: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'open' as SurveyType,
    label: 'Pergunta aberta',
    desc: 'O cliente escreve livremente',
    icon: '✍️',
    color: 'border-purple-400 bg-purple-50',
    tag: 'bg-purple-50 text-purple-700',
  },
]

const PALETTE = [
  '#111827', '#1d4ed8', '#0f766e', '#7c3aed',
  '#be185d', '#b45309', '#15803d', '#dc2626',
]

// ─── Preview component ────────────────────────────────────────────────────────
function SurveyPreview({ type, question, color, thankYou, logoUrl, name }: {
  type: SurveyType; question: string; color: string
  thankYou: string; logoUrl: string; name: string
}) {
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [openText, setOpenText] = useState('')

  function handleSelect(v: number) { setSelected(v); setTimeout(() => setSubmitted(true), 300) }

  if (submitted) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
      <div className="text-4xl mb-3">🎉</div>
      <p className="font-semibold text-gray-800 mb-1">Obrigado!</p>
      <p className="text-sm text-gray-400">{thankYou || 'Seu feedback foi registrado.'}</p>
      <button onClick={() => { setSubmitted(false); setSelected(null); setOpenText('') }}
        className="mt-4 text-xs text-gray-300 hover:text-gray-500 underline">
        Reiniciar preview
      </button>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
        {logoUrl ? (
          <img src={logoUrl} alt="logo" className="w-8 h-8 rounded-lg object-contain" />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>
            {name?.charAt(0)?.toUpperCase() || 'E'}
          </div>
        )}
        <span className="text-xs font-medium text-gray-500">{name || 'Sua empresa'}</span>
      </div>

      <p className="text-sm font-medium text-gray-800 mb-5 leading-relaxed">
        {question || 'Sua pergunta aparecerá aqui…'}
      </p>

      {/* NPS */}
      {type === 'nps' && (
        <div>
          <div className="flex gap-1 flex-wrap justify-center mb-2">
            {Array.from({ length: 11 }, (_, i) => (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold border transition
                  ${selected === i
                    ? 'text-white border-transparent'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}
                style={selected === i ? { background: color, borderColor: color } : {}}
              >{i}</button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1 px-1">
            <span>Muito improvável</span><span>Muito provável</span>
          </div>
        </div>
      )}

      {/* CSAT */}
      {type === 'csat' && (
        <div>
          <div className="flex justify-center gap-3 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} onClick={() => handleSelect(i)}
                className={`text-3xl transition-transform hover:scale-110 ${selected !== null && selected >= i ? 'grayscale-0' : 'grayscale opacity-30'}`}
                style={{ filter: selected !== null && selected >= i ? 'none' : undefined }}
              >⭐</button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-300 px-2">
            <span>Péssimo</span><span>Excelente</span>
          </div>
        </div>
      )}

      {/* Open */}
      {type === 'open' && (
        <div>
          <textarea
            value={openText}
            onChange={e => setOpenText(e.target.value)}
            placeholder="Digite sua resposta aqui…"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            onClick={() => openText.trim() && setSubmitted(true)}
            className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: color }}
          >
            Enviar resposta
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
function NovaPesquisaPage() {
  const router = useRouter()
  const params = useSearchParams()
  const editId = params.get('edit')
  const supabase = createClient()

  const [org, setOrg] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state
  const [type, setType] = useState<SurveyType>('nps')
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')
  const [thankYou, setThankYou] = useState('Obrigado pelo seu feedback! Sua opinião é muito importante para nós.')
  const [color, setColor] = useState('#111827')
  const [logoUrl, setLogoUrl] = useState('')
  const [customColor, setCustomColor] = useState('')

  const DEFAULT_QUESTIONS: Record<SurveyType, string> = {
    nps: 'Em uma escala de 0 a 10, o quanto você recomendaria nossa empresa para um amigo ou colega?',
    csat: 'Como você avalia sua experiência com a nossa empresa?',
    open: 'Tem alguma sugestão ou comentário que gostaria de compartilhar conosco?',
  }

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: orgData } = await supabase
      .from('organizations').select('*').eq('owner_id', user.id).single()
    if (!orgData) { router.push('/login'); return }
    setOrg(orgData)

    if (editId) {
      const { data: sv } = await supabase.from('surveys').select('*').eq('id', editId).single()
      if (sv) {
        setType(sv.type || 'nps')
        setName(sv.name || '')
        setQuestion(sv.question || '')
        setThankYou(sv.thank_you_message || '')
        setColor(sv.color || '#111827')
        setLogoUrl(sv.logo_url || '')
      }
    }

    setLoading(false)
  }, [editId])

  useEffect(() => { load() }, [load])

  // Ao trocar tipo, sugerir pergunta padrão se estiver vazia
  function handleTypeChange(t: SurveyType) {
    setType(t)
    if (!question || Object.values(DEFAULT_QUESTIONS).includes(question)) {
      setQuestion(DEFAULT_QUESTIONS[t])
    }
  }

  useEffect(() => {
    if (!question && !editId) setQuestion(DEFAULT_QUESTIONS['nps'])
  }, [])

  async function save() {
    if (!name.trim()) { alert('Dê um nome para a pesquisa.'); return }
    if (!question.trim()) { alert('Escreva a pergunta.'); return }
    setSaving(true)

    const payload = {
      org_id: org.id,
      type,
      name: name.trim(),
      question: question.trim(),
      thank_you_message: thankYou.trim(),
      color,
      logo_url: logoUrl.trim() || null,
      active: true,
    }

    if (editId) {
      await supabase.from('surveys').update(payload).eq('id', editId)
    } else {
      await supabase.from('surveys').insert(payload)
    }

    setSaved(true)
    setTimeout(() => router.push('/dashboard/pesquisas'), 800)
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
        <Link href="/dashboard/pesquisas" className="text-sm text-gray-400 hover:text-gray-700">
          ← Minhas Pesquisas
        </Link>
        <span className="text-gray-200">|</span>
        <span className="text-sm font-medium text-gray-700">
          {editId ? 'Editar pesquisa' : 'Nova pesquisa'}
        </span>
        <button
          onClick={save}
          disabled={saving || saved}
          className="ml-auto text-sm bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          {saved ? '✓ Salvo!' : saving ? 'Salvando…' : editId ? 'Salvar alterações' : 'Criar pesquisa'}
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── FORMULÁRIO ── */}
        <div className="space-y-6">

          {/* Tipo */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">1. Tipo de pesquisa</h2>
            <div className="space-y-3">
              {TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTypeChange(t.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${type === t.id ? t.color + ' border-opacity-100' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{t.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                  </div>
                  {type === t.id && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${t.tag}`}>
                      Selecionado
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700">2. Conteúdo</h2>

            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Nome da pesquisa <span className="text-red-400">*</span></label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Ex: Pesquisa pós-venda, Satisfação Q1 2026..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-300 mt-1">Só você vê esse nome. Serve para organizar suas pesquisas.</p>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Pergunta principal <span className="text-red-400">*</span></label>
              <textarea
                value={question} onChange={e => setQuestion(e.target.value)}
                rows={3}
                placeholder="O que você quer perguntar ao seu cliente?"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-300 mt-1">Essa é a frase que o cliente vai ler. Seja direto e simples.</p>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Mensagem após resposta</label>
              <textarea
                value={thankYou} onChange={e => setThankYou(e.target.value)}
                rows={2}
                placeholder="Obrigado! Sua opinião é muito importante..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Aparência */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700">3. Aparência</h2>

            <div>
              <label className="text-xs text-gray-400 block mb-2">Cor principal</label>
              <div className="flex gap-2 flex-wrap items-center">
                {PALETTE.map(c => (
                  <button
                    key={c} onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                    style={{ background: c }}
                  />
                ))}
                {/* Custom color */}
                <label className="relative w-8 h-8 rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:scale-110 transition-transform" title="Cor personalizada">
                  <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">+</span>
                  <input type="color" value={customColor || color}
                    onChange={e => { setColor(e.target.value); setCustomColor(e.target.value) }}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1.5">URL do logo <span className="text-gray-300">(opcional)</span></label>
              <input
                type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://suaempresa.com/logo.png"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-300 mt-1">Cole o link direto de uma imagem PNG ou JPG. Sem upload necessário.</p>
            </div>
          </div>

        </div>

        {/* ── PREVIEW ── */}
        <div className="lg:sticky lg:top-8 h-fit space-y-3">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Pré-visualização em tempo real</p>
          <SurveyPreview
            type={type}
            question={question}
            color={color}
            thankYou={thankYou}
            logoUrl={logoUrl}
            name={org?.name || ''}
          />
          <p className="text-xs text-gray-300 text-center">
            É exatamente assim que o seu cliente vai ver a pesquisa.
          </p>
        </div>

      </div>
    </div>
  )
}
export default function NovaPesquisaPageWrapper() {
  return <Suspense><NovaPesquisaPage /></Suspense>
}
