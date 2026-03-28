import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-ecoa-purple selection:text-white text-gray-900">
      
      {/* 1. HEADER / NAVBAR BEM PROFISSIONAL */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <nav className="flex items-center justify-between h-20 px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="text-3xl font-extrabold tracking-tighter text-ecoa-dark flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ecoa-blue to-ecoa-violet flex items-center justify-center text-white text-base font-black shadow-lg shadow-ecoa-blue/20">
              E
            </div>
            ECOA<span className="text-ecoa-blue">.</span>
          </div>
          
          {/* Botões de Acesso (Entrar e Criar Conta) */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-ecoa-dark transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link href="/login" className="px-6 py-2.5 text-sm font-semibold text-white bg-ecoa-dark hover:bg-gray-800 transition-all duration-300 rounded-full shadow-md hover:shadow-lg">
              Criar conta grátis
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION (A Promessa Principal) */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-36 pb-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-ecoa-blue/10 text-ecoa-blue text-sm font-bold tracking-wide border border-ecoa-blue/20">
          ✨ Pesquisas de satisfação que os clientes amam responder
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-ecoa-dark tracking-tight mb-8 leading-[1.1]">
          Meça a lealdade do seu cliente <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-ecoa-blue to-ecoa-purple text-transparent bg-clip-text">
            antes que ele cancele.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          Dispare pesquisas NPS diretamente no corpo do e-mail. Zero formulários longos, máxima taxa de resposta. Transforme opiniões em lucro para o seu negócio.
        </p>
        
        {/* Call to Action principal */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
          <Link href="/login" className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-ecoa-blue to-ecoa-purple hover:scale-105 transition-transform duration-300 rounded-full shadow-xl shadow-ecoa-purple/20 w-full sm:w-auto">
            Começar gratuitamente hoje
          </Link>
          <a href="#como-funciona" className="px-8 py-4 text-base font-bold text-ecoa-dark bg-white border-2 border-gray-100 hover:border-gray-200 transition-colors rounded-full shadow-sm w-full sm:w-auto flex items-center justify-center gap-2">
            Ver como funciona
          </a>
        </div>
        
        {/* 3. O MOCKUP DO E-MAIL (A prova visual) */}
        <div className="mt-24 w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200/60 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
          <div className="bg-gray-50 px-6 py-4 flex items-center gap-4 border-b border-gray-100 text-left">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 font-bold border border-gray-200 shadow-sm">
              ECOA
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">EQUIPE ECOA</p>
              <p className="text-xs text-gray-500">pesquisas@ecoa.com.br</p>
            </div>
          </div>
          
          <div className="p-10 md:p-14 text-center bg-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ecoa-blue to-ecoa-purple"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Como foi sua última experiência? 💙</h2>
            <p className="text-gray-500 mb-10 text-lg">
              Em uma escala de 0 a 10, o quanto você recomendaria nossos serviços para um parceiro de negócios?
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
              {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                <div key={num} className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg border font-bold text-sm md:text-base cursor-pointer hover:scale-110 transition-transform shadow-sm
                  ${num <= 6 ? 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 
                    num <= 8 ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 
                    'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'}`}>
                  {num}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-400 mt-5 max-w-xl mx-auto px-2 uppercase tracking-wider">
              <span>0 - Improvável</span>
              <span>10 - Muito Provável</span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. SEÇÃO DE BENEFÍCIOS REAIS */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-ecoa-dark mb-6 tracking-tight">Pare de adivinhar. Comece a medir.</h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto">A ferramenta definitiva para times de Sucesso do Cliente que precisam de dados acionáveis e rápidos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 text-ecoa-blue rounded-2xl flex items-center justify-center text-3xl mb-8">
                🖱️
              </div>
              <h3 className="text-2xl font-bold text-ecoa-dark mb-4">Um clique. É só isso.</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Esqueça os links que abrem novas abas. Seu cliente vota diretamente dentro do e-mail, multiplicando a sua taxa de resposta em até 4 vezes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 text-ecoa-purple rounded-2xl flex items-center justify-center text-3xl mb-8">
                📈
              </div>
              <h3 className="text-2xl font-bold text-ecoa-dark mb-4">Dados em tempo real</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                O cliente clicou, o dado está no seu painel. Acompanhe a média do seu NPS e saiba exatamente como a percepção da sua marca está evoluindo.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 text-ecoa-violet rounded-2xl flex items-center justify-center text-3xl mb-8">
                🛡️
              </div>
              <h3 className="text-2xl font-bold text-ecoa-dark mb-4">Adequado à LGPD</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Gerenciamento de listas de bloqueio (unsubscribe) automático e segurança de banco de dados nativa. Você foca no cliente, a gente foca na segurança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FINAL */}
      <section className="py-20 bg-ecoa-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">Pronto para ouvir seus clientes?</h2>
          <p className="text-gray-400 text-xl mb-10">Crie sua conta em 30 segundos e envie sua primeira pesquisa hoje mesmo.</p>
          <Link href="/login" className="inline-block px-10 py-5 text-lg font-bold text-ecoa-dark bg-white hover:bg-gray-100 transition-colors rounded-full shadow-xl">
            Criar minha conta agora
          </Link>
        </div>
      </section>

      {/* 6. FOOTER LIMPÃO */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tighter text-ecoa-dark mb-4 md:mb-0">
            ECOA<span className="text-ecoa-blue">.</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} ECOA Software B2B. Feito para crescer.
          </p>
        </div>
      </footer>
      
    </div>
  )
}