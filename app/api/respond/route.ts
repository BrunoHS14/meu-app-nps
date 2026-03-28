import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, score, open_answer } = body
  if (!token) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const supabase = createServiceSupabase()

  const { data: send } = await supabase
    .from('survey_sends').select('id, score, open_answer').eq('token', token).single()

  if (!send) return NextResponse.json({ error: 'Token não encontrado' }, { status: 404 })
  if (send.score !== null || send.open_answer !== null) return NextResponse.json({ message: 'Já respondido' })

  await supabase.from('survey_sends').update({
    score: score ?? null,
    open_answer: open_answer ?? null,
    responded_at: new Date().toISOString(),
  }).eq('token', token)

  return NextResponse.json({ ok: true })
}