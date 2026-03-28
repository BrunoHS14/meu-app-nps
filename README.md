# NPS Pro — Guia de Deploy Completo

## Stack (100% gratuita para começar)
- **Next.js 14** — framework full-stack
- **Vercel** — hospedagem grátis com SSL automático
- **Supabase** — banco PostgreSQL + autenticação (grátis)
- **Resend** — envio de e-mails (3.000/mês grátis)
- **Stripe** — pagamentos (só cobra % sobre o que você receber)

---

## PASSO 1 — Supabase (banco de dados)

1. Acesse https://supabase.com e crie uma conta gratuita
2. Clique em **New project** → dê um nome → escolha região "South America (São Paulo)"
3. Aguarde o projeto criar (~2 min)
4. Vá em **Settings → API** e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
5. Vá em **SQL Editor** → clique em **New query**
6. Cole o conteúdo de `supabase/migrations/001_initial.sql` e clique em **Run**

---

## PASSO 2 — Resend (e-mails)

1. Acesse https://resend.com e crie uma conta gratuita
2. Vá em **API Keys → Create API Key** → copie a chave → `RESEND_API_KEY`
3. Para o e-mail de envio:
   - **Opção grátis sem domínio:** use `onboarding@resend.dev` (só envia para e-mails verificados)
   - **Com domínio próprio (recomendado):** vá em **Domains → Add Domain** e siga as instruções DNS

---

## PASSO 3 — Stripe (pagamentos)

1. Acesse https://stripe.com e crie uma conta
2. Vá em **Developers → API Keys** e copie:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
3. Vá em **Products → Add product** e crie dois produtos:
   - **NPS Pro Starter** → Preço recorrente → R$ 97/mês → copie o Price ID → `STRIPE_PRICE_STARTER`
   - **NPS Pro Pro** → Preço recorrente → R$ 247/mês → copie o Price ID → `STRIPE_PRICE_PRO`
4. O webhook será configurado após o deploy no Vercel (passo 5)

---

## PASSO 4 — GitHub

```bash
# No terminal, dentro da pasta nps-saas:
git init
git add .
git commit -m "initial commit"
git branch -M main

# Crie um repositório no GitHub (github.com/new) e depois:
git remote add origin https://github.com/SEU_USUARIO/nps-saas.git
git push -u origin main
```

---

## PASSO 5 — Vercel (hospedagem)

1. Acesse https://vercel.com e entre com sua conta GitHub
2. Clique em **Add New → Project**
3. Selecione o repositório `nps-saas`
4. Em **Environment Variables**, adicione todas as variáveis do `.env.example` com os valores reais
5. Clique em **Deploy**
6. Após o deploy, copie a URL (ex: `https://nps-saas.vercel.app`) → `NEXT_PUBLIC_APP_URL`
7. Re-deploy após adicionar essa última variável

---

## PASSO 6 — Stripe Webhook (após deploy)

1. No Stripe, vá em **Developers → Webhooks → Add endpoint**
2. URL: `https://SEU_APP.vercel.app/api/webhook`
3. Eventos a ouvir:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copie o **Signing secret** → `STRIPE_WEBHOOK_SECRET`
5. Atualize essa variável no Vercel → **Redeploy**

---

## PASSO 7 — Testar tudo

1. Acesse `https://SEU_APP.vercel.app`
2. Clique em **Criar conta grátis** e cadastre-se
3. No dashboard, adicione um e-mail seu em **Enviar** e dispare uma pesquisa
4. Verifique a caixa de entrada e clique em uma nota
5. Volte ao dashboard e confirme que a resposta apareceu

---

## Variáveis de ambiente resumidas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
NEXT_PUBLIC_APP_URL=
```

---

## Estrutura do projeto

```
nps-saas/
├── app/
│   ├── page.tsx                  # Landing page com pricing
│   ├── login/page.tsx            # Login e cadastro
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard principal (NPS, envio, respostas)
│   │   └── upgrade/page.tsx      # Página de upgrade de plano
│   ├── survey/[token]/
│   │   ├── page.tsx              # Página de resposta (cliente clica do e-mail)
│   │   ├── RespondClient.tsx     # Componente de seleção de nota
│   │   └── thanks/page.tsx       # Página de agradecimento
│   └── api/
│       ├── survey/route.ts       # Enviar e-mails via Resend
│       ├── respond/route.ts      # Registrar resposta no banco
│       ├── checkout/route.ts     # Criar sessão Stripe
│       └── webhook/route.ts      # Receber eventos Stripe
├── lib/
│   ├── supabase.ts               # Client-side Supabase
│   └── supabase-server.ts        # Server-side Supabase
├── supabase/migrations/
│   └── 001_initial.sql           # Schema completo do banco
└── .env.example                  # Todas as variáveis necessárias
```

---

## Modelo de negócio

| Plano | Preço | Custo seu | Margem |
|-------|-------|-----------|--------|
| Trial | R$ 0 | R$ 0 | — |
| Starter | R$ 97/mês | ~R$ 0* | ~100% |
| Pro | R$ 247/mês | ~R$ 0* | ~100% |

*Vercel, Supabase e Resend têm planos gratuitos generosos para começar. Você só começa a pagar quando tiver volume relevante.

---

## Próximos passos para crescer

- [ ] Adicionar domínio customizado no Vercel (grátis)
- [ ] Configurar domínio próprio no Resend para melhor entregabilidade
- [ ] Adicionar Google Analytics ou Plausible (grátis) para rastrear conversões
- [ ] Criar plano white-label para agências revenderem
