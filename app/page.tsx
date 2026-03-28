import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-ecoa-purple selection:text-white">
      
      {/* Menu Superior (Navbar) */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-3xl font-extrabold tracking-tighter text-ecoa-dark flex items-center gap-1">
          {/* Um ícone simples para simular o logo */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ecoa-blue to-ecoa-violet flex items-center justify-center text-white text-sm font-black">
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

      {/* Hero Section (Onde a mágica acontece) */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-32 max-w-5xl mx-auto">
        
        {/* Etiqueta de novidade */}
        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-ecoa-purple/10 text-ecoa-purple text-sm font-bold tracking-wide uppercase">
          🚀 O novo padrão em pesquisas NPS
        </div>
        
        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-ecoa-dark tracking-tight mb-8 leading-tight">
          A voz do seu cliente que <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-ecoa-blue to-ecoa-violet text-transparent bg-clip-text">
            reverbera em resultados.
          </span>
        </h1>
        
        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed">
          Descubra o que seus clientes realmente pensam. Dispare pesquisas automatizadas, 
          analise o feedback em tempo real e tome decisões baseadas em dados. Tudo em conformidade com a LGPD.
        </p>
        
        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/login" className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-ecoa-blue to-ecoa-purple hover:opacity-90 transition-opacity rounded-full shadow-lg shadow-ecoa-purple/30 w-full sm:w-auto">
            Começar a usar agora
          </Link>
          <button className="px-8 py-4 text-base font-bold text-ecoa-dark bg-gray-100 hover:bg-gray-200 transition-colors rounded-full w-full sm:w-auto">
            Entender como funciona
          </button>
        </div>
        
      </main>
      
    </div>
  )
}