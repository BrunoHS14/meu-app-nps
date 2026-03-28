import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-ecoa-purple selection:text-white">
      
      {/* Menu Superior (Navbar) */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-3xl font-extrabold tracking-tighter text-ecoa-dark flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ecoa-blue to-ecoa-violet flex items-center justify-center text-white text-sm font-black shadow-md">
            E
          </div>
          ECOA<span className="text-ecoa-blue">.</span>
        </div>
        <div>
          <Link href="/login" className="px-6 py-2.5 text-sm font-semibold text-white bg-ecoa-dark hover:bg-ecoa-purple transition-all duration-300 rounded-full shadow-md">
            Acessar Sistema
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 max-w-5xl mx-auto">
        
        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-ecoa-purple/10 text-ecoa-purple text-sm font-bold tracking-wide uppercase">
          🚀 O novo padrão em pesquisas B2B
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-ecoa-dark tracking-tight mb-8 leading-tight">
          A voz do seu cliente que <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-ecoa-blue to-ecoa-violet text-transparent bg-clip-text">
            reverbera em resultados.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed">
          Descubra o que seus clientes realmente pensam. Dispare pesquisas automatizadas, 
          analise o feedback em tempo real e tome decisões baseadas em dados. Tudo em conformidade com a LGPD.
        </p>
        
        {/* Botões de Ação (AGORA O BOTÃO FUNCIONA!) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
          <Link href="/login" className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-ecoa-blue to-ecoa-purple hover:opacity-90 transition-opacity rounded-full shadow-lg shadow-ecoa-purple/30 w-full sm:w-auto">
            Começar a usar agora
          </Link>
          <a href="#como-funciona" className="px-8 py-4 text-base font-bold text-ecoa-dark bg-white border border-gray-200 hover:bg-gray-100 transition-colors rounded-full shadow-sm w-full sm:w-auto flex items-center justify-center gap-2">
            Entender como funciona ↓
          </a>
        </div>
        
        {/* FAKE DASHBOARD (Para dar cara de Software e tirar o "sem sal") */}
        <div className="mt-20 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Barrinha superior da janela (estilo Mac) */}
          <div className="bg-gray-100 px-4 py-3 flex gap-2 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          {/* Conteúdo fake para preencher o visual */}
          <div className="p-8 flex flex-col gap-6 bg-gray-50/50">
            <div className="flex justify-between items-center">
               <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
               <div className="h-8 w-24 bg-ecoa-blue/20 rounded-lg"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="h-32 flex-1 bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col justify-end">
                 <div className="h-4 w-20 bg-gray-100 rounded mb-2"></div>
                 <div className="h-8 w-16 bg-green-100 rounded text-green-600 font-bold flex items-center px-2">NPS 85</div>
              </div>
              <div className="h-32 flex-1 bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col justify-end">
                 <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                 <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-32 flex-1 bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col justify-end">
                 <div className="h-4 w-28 bg-gray-100 rounded mb-2"></div>
                 <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-64 w-full bg-white border border-gray-100 rounded-xl shadow-sm"></div>
          </div>
        </div>
      </main>

      {/* SEÇÃO COMO FUNCIONA (Onde o botão te leva) */}
      <section id="como-funciona" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ecoa-dark mb-4">Métricas que geram lucro</h2>
            <p className="text-gray-500 text-lg">Veja como a ECOA transforma opiniões em dados acionáveis em três passos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-ecoa-blue/10 text-ecoa-blue rounded-xl flex items-center justify-center text-2xl mb-6">
                📧
              </div>
              <h3 className="text-xl font-bold text-ecoa-dark mb-3">1. Disparo Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Importe seus clientes e deixe que a ECOA cuide do resto. Disparos rápidos, com alta taxa de entrega e design otimizado para não cair no spam.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-ecoa-purple/10 text-ecoa-purple rounded-xl flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-ecoa-dark mb-3">2. Zero Fricção</h3>
              <p className="text-gray-600 leading-relaxed">
                Seu cliente vota direto no corpo do e-mail com um clique. A resposta é capturada instantaneamente no seu banco de dados.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-ecoa-violet/10 text-ecoa-violet rounded-xl flex items-center justify-center text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-ecoa-dark mb-3">3. Conformidade LGPD</h3>
              <p className="text-gray-600 leading-relaxed">
                Dormir tranquilo não tem preço. Sistema de "unsubscribe" automático e segurança de dados nativa (Row Level Security).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé Clássico */}
      <footer className="bg-ecoa-dark py-12 text-center">
        <div className="text-2xl font-extrabold tracking-tighter text-white opacity-90 mb-4">
          ECOA<span className="text-ecoa-blue">.</span>
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} ECOA Software. Todos os direitos reservados.
        </p>
      </footer>
      
    </div>
  )
}