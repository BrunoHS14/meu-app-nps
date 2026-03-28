'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RespondClient({
  token, question, orgName, surveyType, color
}: {
  token: string
  question: string
  orgName: string
  surveyType: 'nps' | 'csat' | 'open'
  color: string
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<number | null>(null)
  const [openText, setOpenText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(score?: number, text?: string) {
    setSubmitting(true)
    await fetch('/api/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, score: score ?? null, open_answer: text ?? null }),
    })
    const qs = score !== undefined ? `?score=${score}` : ''
    router.push(`/survey/${token}/thanks${qs}`)
  }

  const accentColor = color || '#111827'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-lg shadow-sm">

        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-50">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: accentColor }}
          >
            {orgName?.charAt(0)?.toUpperCase() || 'E'}
          </div>
          <span className="text-sm text-gray-500 font-medium">{orgName}</span>
        </div>

        <h1 className="text-base font-semibold text-gray-900 mb-6 leading-snug">{question}</h1>

        {surveyType === 'nps' && (
          <div>
            <div className="flex justify-center gap-1.5 flex-wrap mb-3">
              {Array.from({ length: 11 }, (_, i) => (
                <button key={i}
                  onClick={() => { if (!submitting) { setSelected(i); submit(i) } }}
                  disabled={submitting}
                  className={`w-11 h-11 rounded-xl border text-sm font-semibold transition
                    ${selected === i ? 'text-white border-transparent scale-110' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:scale-105'}`}
                  style={selected === i ? { background: accentColor, borderColor: accentColor } : {}}
                >{i}</button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-300 px-1">
              <span>Muito improvável</span><span>Muito provável</span>
            </div>
          </div>
        )}

        {surveyType === 'csat' && (
          <div>
            <div className="flex justify-center gap-4 mb-3">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i}
                  onClick={() => { if (!submitting) { setSelected(i); submit(i) } }}
                  disabled={submitting}
                  className={`text-4xl transition-all hover:scale-125 ${selected !== null && selected >= i ? 'scale-110' : 'opacity-25 grayscale'}`}
                >⭐</button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-300 px-2">
              <span>Péssimo</span><span>Excelente</span>
            </div>
          </div>
        )}

        {surveyType === 'open' && (
          <div>
            <textarea value={openText} onChange={e => setOpenText(e.target.value)}
              disabled={submitting} placeholder="Escreva sua resposta aqui…" rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 mb-4"
            />
            <button onClick={() => openText.trim() && submit(undefined, openText)}
              disabled={submitting || !openText.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
              style={{ background: accentColor }}
            >{submitting ? 'Enviando…' : 'Enviar resposta'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
