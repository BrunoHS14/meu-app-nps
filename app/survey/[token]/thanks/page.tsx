export default function ThanksPage({ searchParams }: { searchParams: { score?: string } }) {
  const score = parseInt(searchParams.score || '0')
  const isPromoter = score >= 9
  const isNeutral = score >= 7 && score <= 8

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-5xl mb-4">{isPromoter ? '🎉' : isNeutral ? '😊' : '🙏'}</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          {isPromoter ? 'Que ótimo!' : isNeutral ? 'Obrigado!' : 'Obrigado pelo feedback!'}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          {isPromoter
            ? 'Ficamos muito felizes em saber que você nos recomendaria. Seu feedback nos motiva a continuar melhorando!'
            : isNeutral
            ? 'Seu feedback é muito valioso para nós. Estamos sempre buscando melhorar sua experiência.'
            : 'Lamentamos que sua experiência não foi tão positiva. Sua opinião nos ajuda a melhorar.'}
        </p>
        <div className={`mt-6 inline-block text-xs px-3 py-1 rounded-full ${isPromoter ? 'bg-green-50 text-green-700' : isNeutral ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
          Você deu nota {score}
        </div>
      </div>
    </div>
  )
}
