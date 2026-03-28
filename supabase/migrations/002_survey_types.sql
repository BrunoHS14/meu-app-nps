-- Adicionar novos campos na tabela surveys
alter table surveys
  add column if not exists type text not null default 'nps' check (type in ('nps', 'csat', 'open')),
  add column if not exists color text not null default '#111827',
  add column if not exists logo_url text,
  add column if not exists thank_you_message text not null default 'Obrigado pelo seu feedback!';

-- Recriar a tabela survey_sends para suportar resposta aberta
alter table survey_sends
  add column if not exists open_answer text;
