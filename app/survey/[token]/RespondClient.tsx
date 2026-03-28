'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RespondClient({
  token, question, orgName
}: {
  token: string; question: string; orgName: string
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(score: number) {
    setSelected(score)
    setSubmitting(true)
    await fetch('/api/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, score }),
    })
    router.push(`/survey/${token}/thanks?score=${score}`)
  }

  const color = (i: number) => {
    if (selected === i) return i >= 9 ? 'bg-green-600 text-white border-green-600' : i >= 7 ? 'bg-amber-500 text-white border-amber-500' : 'bg-red-500 text-white border-red-500'
    return 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-lg text-center shadow-sm">
        <p className="text-xs text-gray-400 mb-2">{orgName}</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-6 leading-snug">{question}</h1>

        <div className="flex justify-center gap-1.5 flex-wrap mb-4">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => !submitting && submit(i)}
              disabled={submitting}
              className={`w-11 h-11 rounded-xl border text-sm font-semibold transition ${color(i)}`}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>Muito improvável</span>
          <span>Muito provável</span>
        </div>
      </div>
    </div>
  )
}
