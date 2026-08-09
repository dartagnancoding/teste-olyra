# Olyra — Mini CRM de Leads

Painel interno para cadastrar leads da Olyra, filtrá-los por origem e disparar
o email de boas-vindas. Duas visualizações da mesma base (lista e cards), acesso
protegido por credencial fixa e envio real de email.

Identidade visual: paleta oficial Olyra (verde floresta, creme, sage) em estética
**warm/artesanal** — títulos em serifada, respiro generoso, movimento discreto.

---

## Stack

| Item | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 15 (App Router) | Rotas protegidas, formulários e estado — é aplicação, não site estático. Server Components resolvem a leitura inicial sem `useEffect`. |
| Linguagem | TypeScript strict | Zero `any`; `noUncheckedIndexedAccess` ligado. |
| Estilo | Tailwind v4 com `@theme` | Toda cor é token semântico. Trocar a marca é trocar o `@theme`, não caçar hex em 40 arquivos. |
| Banco | Supabase (Postgres) | Postgres gerenciado, sem infra para manter no escopo do desafio. |
| Auth | Credencial fixa em env + cookie assinado | O enunciado pede credenciais fixas, sem cadastro de usuários. |
| Formulários | React Hook Form + Zod | Validação declarativa compartilhada entre client e servidor. |
| Email | Resend | API simples, sem servidor SMTP. |
| Animação | Motion (Framer Motion) | Entrada dos cards com stagger, respeitando `prefers-reduced-motion`. |
| Deploy | Netlify | Pedido do desafio. `@netlify/plugin-nextjs` cobre o App Router. |

---

## Rodando localmente

### 1. Clonar e instalar

```bash
git clone <url-do-repositorio>
cd teste-olyra
npm install
```

### 2. Criar o `.env.local`

```bash
cp .env.example .env.local
```

Variáveis necessárias:

| Variável | Onde obter |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys → **Secret key** (`sb_secret_…`) |
| `AUTH_USER` | Você escolhe — usuário do painel |
| `AUTH_PASSWORD` | Você escolhe — senha do painel |
| `SESSION_SECRET` | String aleatória longa: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM` | `onboarding@resend.dev` enquanto não houver domínio verificado |

> A **secret key** substitui a antiga `service_role` e ignora RLS (`BYPASSRLS`).
> Ela só é lida no servidor e nunca chega ao navegador — não a exponha com
> prefixo `NEXT_PUBLIC_`. A **publishable key** (`sb_publishable_…`, sucessora
> da `anon`) não é usada neste projeto.

### 3. Criar a tabela e o seed no Supabase

No SQL Editor do projeto, rodar `supabase/schema.sql` e depois `supabase/seed.sql`.

```sql
-- supabase/schema.sql
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  origin text not null,
  welcome_sent_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);

alter table leads enable row level security;
```

```sql
-- supabase/seed.sql — 6 leads fictícios, idempotente
insert into leads (name, email, origin)
select * from (values
  ('Mariana Costa',  'mariana.costa@exemplo.com',  'Instagram'),
  ('Rafael Andrade', 'rafael.andrade@exemplo.com', 'Indicação'),
  ('Juliana Prado',  'juliana.prado@exemplo.com',  'Site'),
  ('Bruno Lima',     'bruno.lima@exemplo.com',     'Feira'),
  ('Carolina Nunes', 'carolina.nunes@exemplo.com', 'Instagram'),
  ('Thiago Moreira', 'thiago.moreira@exemplo.com', 'Google')
) as novos (name, email, origin)
where not exists (
  select 1 from leads existentes where existentes.email = novos.email
);
```

### 4. Subir

```bash
npm run dev
```

Abrir http://localhost:3000 e entrar com `AUTH_USER` / `AUTH_PASSWORD`.

---

## Deploy no Netlify

1. Subir o repositório para o GitHub.
2. Em netlify.com, conectar o repositório. O `netlify.toml` já declara o build e
   o plugin `@netlify/plugin-nextjs`.
3. Site settings → Environment variables: cadastrar **todas** as variáveis do
   `.env.example` com os valores reais.
4. Deploy.

---

## Decisões técnicas

**Next.js em vez de Astro.** O projeto tem sessão, formulários, rotas protegidas
e mutações. Astro brilha em conteúdo estático; aqui o custo de reintroduzir
interatividade em ilhas não se pagaria.

**Supabase em vez de Postgres próprio.** Banco gerenciado com SQL Editor
embutido resolve o escopo sem provisionar infra. A troca é possível sem tocar a
UI: o contrato está em `src/lib/db/types.ts` e a implementação concreta em
`src/lib/db/leads.ts`.

**Autenticação fixa por cookie, não Supabase Auth.** O enunciado pede
explicitamente credenciais fixas sem cadastro de usuários. Implementar OAuth,
recuperação de senha e tabela de usuários seria over-engineering.
O cookie guarda um **HMAC-SHA256** do usuário assinado com `SESSION_SECRET` —
o segredo em si nunca trafega para o navegador, e sem ele não dá para forjar
sessão. O cookie é `httpOnly`, `sameSite=lax`, `secure` em produção, 8h de vida.
A comparação de credenciais usa `timingSafeEqual`.

**RLS ligada, sem policy pública.** Como todo acesso passa pelo servidor com a
secret key, nenhuma policy é necessária. Com RLS ligada e sem policy, a
publishable key não lê nada mesmo se vazar. O Supabase ainda recusa a secret key
com 401 se ela partir de um browser, então a chave só funciona onde deve.

**Filtro no client.** A base cabe em memória (dezenas a poucas centenas de
leads). Filtrar no client dá resposta instantânea e evita uma ida ao servidor a
cada tecla. Se a base crescer, o ponto de troca é `src/lib/leads/filter-leads.ts`
mais um parâmetro de query na rota `GET /api/leads`.

**Leitura no servidor, mutação no client.** `/crm` e `/cards` são Server
Components que carregam a lista direto do repositório — sem `useEffect` de
fetch. O client recebe a lista como estado inicial e a atualiza com o lead que a
própria mutação devolve, sem refetch.

**Cliente Supabase preguiçoso e marcado `server-only`.** O build do Next não
exige os segredos, e importar o cliente em um componente client vira erro de
build em vez de vazamento de chave.

### Limitação conhecida — Resend

Sem um domínio verificado, o Resend só permite enviar **de** `onboarding@resend.dev`
e **para** o endereço cadastrado na conta. Enviar boas-vindas para um lead com
outro email retorna erro da API — que a interface exibe na íntegra, abaixo do
botão. Para uso real, basta verificar um domínio da Olyra e trocar `RESEND_FROM`.

---

## Estrutura de pastas

```
src/
  app/
    layout.tsx              fontes (Fraunces/Inter), metadata
    globals.css             tokens @theme da identidade Olyra
    page.tsx                redireciona para /crm ou /login
    login/page.tsx          tela de login
    (app)/                  grupo de rotas protegidas
      layout.tsx            guard de sessão + header + footer
      crm/page.tsx          formulário + resumo + busca + tabela
      cards/page.tsx        busca + grid de cards
    api/
      auth/login|logout     valida credencial, cria/destrói sessão
      leads                 GET lista · POST cadastra
      send-welcome          POST envia email e persiste o status
  components/
    ui/                     átomos e moléculas (button, input, select,
                            field, card, badge, empty-state, error-state)
    layout/                 header, footer, nav-link, logout-button,
                            page-heading
    brand/                  wordmark
    auth/                   login-form
    leads/                  crm-view, cards-view, lead-form, lead-table,
                            lead-card, search-bar, send-welcome-button,
                            origin-summary
  hooks/
    use-lead-list.ts        lista + filtros + mutações locais
  lib/
    db/types.ts             contrato de persistência (LeadRepository)
    db/client.ts            cliente Supabase (server-only, preguiçoso)
    db/leads.ts             implementação concreta do contrato
    leads/api.ts            acesso do client às rotas
    leads/filter-leads.ts   busca, filtro e contagem por origem (puro)
    leads/load-leads.ts     leitura server-side com erro tratado
    email/                  template e envio das boas-vindas
    utils/                  cn, formatação de data e iniciais
    auth.ts                 assinatura e verificação de sessão
    env.ts                  leitura de env com falha explícita
    validations.ts          schemas Zod
  types/lead.ts             tipos do domínio e lista de origens
supabase/
  schema.sql · seed.sql     SQL de criação e leads fictícios
```

**Camadas.** A UI nunca importa o cliente do banco: componente → `lib/leads/api.ts`
→ route handler → `lib/db/leads.ts` → Supabase. Para leitura inicial, o Server
Component chama `lib/leads/load-leads.ts` direto.

---

## Funcionalidades

- Login com credencial fixa; rotas protegidas redirecionam para `/login`
- Cadastro de lead com validação (nome, email, origem)
- Busca por nome ou email — sem acento e sem diferenciar maiúsculas
- Filtro por origem
- Resumo com total e contagem por origem
- Visualização em tabela (empilha em mobile, sem scroll horizontal) e em cards
- Envio real de email de boas-vindas, com status persistido em `welcome_sent_at`
- Estados de carregamento, vazio e erro em toda tela com dados
- `prefers-reduced-motion` respeitado

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servir o build
npm run lint    # ESLint
```
