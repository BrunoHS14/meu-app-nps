'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function checkout(plan: string) {
    setLoading(plan)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else { alert('Erro ao redirecionar para pagamento.'); setLoading(null) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Voltar ao dashboard</a>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Escolha seu plano</h1>
          <p className="text-gray-500 text-sm">Cancele quando quiser. Sem multa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* STARTER */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="text-sm text-gray-500 mb-1">Starter</div>
            <div className="text-4xl font-bold mb-1">
              R$ 97<span className="text-base font-normal text-gray-400">/mês</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Para pequenas empresas</p>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
              {['500 e-mails/mês', '3 pesquisas ativas', 'Dashboard NPS completo', 'Exportar CSV', 'Suporte por e-mail'].map(i => (
                <li key={i} className="flex gap-2 items-start"><span className="text-green-500 mt-0.5">✓</span>{i}</li>
              ))}
            </ul>
            <button
              onClick={() => checkout('starter')}
              disabled={loading !== null}
              className="w-full border border-gray-900 text-gray-900 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {loading === 'starter' ? 'Redirecionando...' : 'Assinar Starter'}
            </button>
          </div>

          {/* PRO */}
          <div className="bg-white rounded-2xl border-2 border-gray-900 p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-medium">
              Mais popular
            </div>
            <div className="text-sm text-gray-500 mb-1">Pro</div>
            <div className="text-4xl font-bold mb-1">
              R$ 247<span className="text-base font-normal text-gray-400">/mês</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Para empresas em crescimento</p>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
              {['E-mails ilimitados', 'Pesquisas ilimitadas', 'Dashboard NPS + insights IA', 'Exportar CSV', 'Múltiplos usuários', 'Suporte prioritário'].map(i => (
                <li key={i} className="flex gap-2 items-start"><span className="text-green-500 mt-0.5">✓</span>{i}</li>
              ))}
            </ul>
            <button
              onClick={() => checkout('pro')}
              disabled={loading !== null}
              className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
            >
              {loading === 'pro' ? 'Redirecionando...' : 'Assinar Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
