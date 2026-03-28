import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NPS Pro — Pesquisa de satisfação por e-mail',
  description: 'Envie pesquisas NPS, colete respostas e acompanhe a satisfação dos seus clientes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
