-- Organizações (cada cliente que compra o SaaS)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_id uuid references auth.users(id) on delete cascade,
  plan text not null default 'trial', -- trial | starter | pro
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive', -- active | inactive | past_due | canceled
  emails_sent_this_month int default 0,
  emails_limit int default 50, -- trial: 50, starter: 500, pro: unlimited
  created_at timestamptz default now()
);

-- Pesquisas NPS criadas por cada organização
create table surveys (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  name text not null,
  question text not null default 'Em uma escala de 0 a 10, o quanto você recomendaria nossa empresa para um amigo?',
  thank_you_message text default 'Obrigado pelo seu feedback!',
  active boolean default true,
  created_at timestamptz default now()
);

-- Disparos individuais (cada e-mail enviado)
create table survey_sends (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references surveys(id) on delete cascade,
  org_id uuid references organizations(id) on delete cascade,
  recipient_email text not null,
  recipient_name text,
  token text unique not null default gen_random_uuid()::text,
  score int check (score >= 0 and score <= 10),
  responded_at timestamptz,
  sent_at timestamptz default now()
);

-- Índices para performance
create index on survey_sends(token);
create index on survey_sends(org_id);
create index on survey_sends(survey_id);

-- Row Level Security
alter table organizations enable row level security;
alter table surveys enable row level security;
alter table survey_sends enable row level security;

-- Políticas: usuário só vê seus próprios dados
create policy "org_owner" on organizations for all using (owner_id = auth.uid());
create policy "survey_org" on surveys for all using (
  org_id in (select id from organizations where owner_id = auth.uid())
);
create policy "send_org" on survey_sends for all using (
  org_id in (select id from organizations where owner_id = auth.uid())
);

-- Função para calcular NPS
create or replace function calc_nps(p_org_id uuid, p_survey_id uuid default null)
returns numeric as $$
declare
  total int;
  promoters int;
  detractors int;
begin
  select count(*) into total
  from survey_sends
  where org_id = p_org_id
    and score is not null
    and (p_survey_id is null or survey_id = p_survey_id);

  if total = 0 then return 0; end if;

  select count(*) into promoters from survey_sends
  where org_id = p_org_id and score >= 9
    and (p_survey_id is null or survey_id = p_survey_id);

  select count(*) into detractors from survey_sends
  where org_id = p_org_id and score <= 6
    and (p_survey_id is null or survey_id = p_survey_id);

  return round(((promoters::numeric / total) - (detractors::numeric / total)) * 100);
end;
$$ language plpgsql;
