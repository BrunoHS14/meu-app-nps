'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const isSignup = params.get('signup') === '1'
  const plan = params.get('plan') || 'starter'

  const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }
      if (data.user) {
        const slug = orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        await supabase.from('organizations').insert({
          name: orgName,
          slug: slug + '-' + Math.random().toString(36).slice(2, 6),
          owner_id: data.user.id,
          plan: 'trial',
          emails_limit: 50,
        })
      }
      setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) { setError('E-mail ou senha incorretos'); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm">
        <div className="mb-6">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← NPS Pro</a>
          <h1 className="text-xl font-semibold mt-4">
            {mode === 'login' ? 'Entrar na conta' : 'Criar conta grátis'}
          </h1>
          {mode === 'signup' && (
            <p className="text-sm text-gray-500 mt-1">14 dias grátis · Plano {plan}</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nome da empresa</label>
              <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)}
                placeholder="Minha Empresa"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 block mb-1">E-mail</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Senha</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="mínimo 6 caracteres"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">{success}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition">
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-4">
          {mode === 'login' ? (
            <>Não tem conta? <button onClick={() => setMode('signup')} className="text-gray-700 underline">Criar grátis</button></>
          ) : (
            <>Já tem conta? <button onClick={() => setMode('login')} className="text-gray-700 underline">Entrar</button></>
          )}
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}