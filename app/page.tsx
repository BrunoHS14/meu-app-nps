'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg">NPS Pro</span>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Entrar</Link>
          <Link href="/login?signup=1" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          ✓ 14 dias grátis · sem cartão de crédito
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Descubra o que seus<br />clientes realmente pensam
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Envie pesquisas NPS por e-mail em minutos. Acompanhe a satisfação, identifique detratores e converta neutros em promotores.
        </p>
        <Link href="/login?signup=1" className="inline-block bg-gray-900 text-white text-base font-medium px-8 py-4 rounded-xl hover:bg-gray-700 transition">
          Criar conta grátis →
        </Link>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '📧', title: 'Disparo por e-mail', desc: 'Envie pesquisas personalizadas para seus clientes com um clique. Sem configuração técnica.' },
          { icon: '📊', title: 'Dashboard em tempo real', desc: 'Veja seu NPS, taxa de resposta e segmentação de promotores/detratores instantaneamente.' },
          { icon: '🤖', title: 'Insights com IA', desc: 'Análise automática das respostas com recomendações acionáveis para melhorar seu score.' },
        ].map(f => (
          <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* PRICING */}
      <section className="max-w-4xl mx-auto px-6 py-16" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-12">Planos simples e transparentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* STARTER */}
          <div className="border border-gray-200 rounded-2xl p-8">
            <div className="text-sm font-medium text-gray-500 mb-2">Starter</div>
            <div className="text-4xl font-bold mb-1">R$ 97<span className="text-lg font-normal text-gray-400">/mês</span></div>
            <p className="text-sm text-gray-500 mb-6">Para pequenas empresas</p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              {['Até 500 e-mails/mês', '3 pesquisas ativas', 'Dashboard NPS', 'Exportar CSV', 'Suporte por e-mail'].map(i => (
                <li key={i} className="flex gap-2"><span className="text-green-500">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/login?signup=1&plan=starter" className="block text-center border border-gray-900 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50">
              Começar trial grátis
            </Link>
          </div>

          {/* PRO */}
          <div className="border-2 border-gray-900 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
              Mais popular
            </div>
            <div className="text-sm font-medium text-gray-500 mb-2">Pro</div>
            <div className="text-4xl font-bold mb-1">R$ 247<span className="text-lg font-normal text-gray-400">/mês</span></div>
            <p className="text-sm text-gray-500 mb-6">Para empresas em crescimento</p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              {['E-mails ilimitados', 'Pesquisas ilimitadas', 'Dashboard NPS + insights IA', 'Exportar CSV', 'Múltiplos usuários', 'Suporte prioritário'].map(i => (
                <li key={i} className="flex gap-2"><span className="text-green-500">✓</span>{i}</li>
              ))}
            </ul>
            <Link href="/login?signup=1&plan=pro" className="block text-center bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700">
              Começar trial grátis
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} NPS Pro · Feito com ☕ no Brasil
      </footer>
    </div>
  )
}
