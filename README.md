# Olyra — Mini CRM de Leads

Painel interno para cadastrar leads da Olyra, filtrá-los por origem e disparar
o email de boas-vindas. Duas visualizações da mesma base (lista e cards), acesso
protegido por credencial fixa e envio real de email.

Identidade visual seguindo o site da Olyra: superfícies brancas sobre `#f5f5f5`,
verde floresta nas ações, Raleway nos títulos e movimento discreto.

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

-- Email identifica o lead: sustenta o seed idempotente e a aplicação traduz a
-- violação (23505) em "já existe um lead com esse email".
create unique index if not exists leads_email_unique on leads (lower(email));

alter table leads enable row level security;
```

O seed fica em [`supabase/seed.sql`](supabase/seed.sql) — sete leads fictícios,
idempotente (o email é a chave; rodar de novo não duplica). Três detalhes são
intencionais e vale saber por quê:

- **Cada lead tem um `created_at` próprio,** recuado em dias. Inseridos numa
  transação só, todos herdariam o mesmo `now()` com precisão de microssegundo —
  e aí "mais recentes" e "mais antigos" devolvem a mesma ordem, fazendo a
  ordenação parecer quebrada.
- **Dois já receberam boas-vindas,** para a coluna de status mostrar os dois
  estados e o botão de envio rápido aparecer habilitado e desabilitado na mesma
  tela.
- **Um nome tem acento** (Letícia Gonçalves), que é o que permite conferir que
  a busca acha quem se digita "leticia goncalves".

### 4. Subir

```bash
npm run dev
```

Abrir http://localhost:3000 e entrar com `AUTH_USER` / `AUTH_PASSWORD`.

---

## Deploy no Netlify

1. Subir o repositório para o GitHub.
2. Em netlify.com, conectar o repositório. O `netlify.toml` já declara o build,
   o plugin `@netlify/plugin-nextjs` e o Node 22.
3. Site settings → Environment variables: cadastrar **todas** as variáveis do
   `.env.example` com os valores reais.
4. Deploy.

Passo a passo detalhado, com checklist de teste em produção e tabela de falhas:
[`docs/DEPLOY.md`](docs/DEPLOY.md).

---

## Decisões técnicas

**Next.js em vez de Astro.** O projeto tem sessão, formulários, rotas protegidas
e mutações. Astro brilha em conteúdo estático; aqui o custo de reintroduzir
interatividade em ilhas não se pagaria.

**Supabase em vez de Postgres próprio.** Banco gerenciado com SQL Editor
embutido resolve o escopo sem provisionar infra. A troca é possível sem tocar a
UI: o contrato está em `features/leads/types/lead-repository.ts` e a
implementação concreta em `features/leads/data/supabase-lead-repository.ts`.

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
cada tecla. Se a base crescer, o ponto de troca é
`features/leads/application/filter-leads.ts` mais um parâmetro em `getLeads()`.

**Server Actions em vez de rotas de API.** Não há consumidor externo nem regra
de negócio que justifique uma API dedicada: o único cliente do backend é o
próprio front. Uma rota REST aqui seria serializar JSON, escolher status codes e
manter uma camada de transporte para falar consigo mesmo. As mutações são
Server Actions — o componente chama uma função tipada, sem `fetch` e sem
`as { lead: Lead }` no meio do caminho, e o formulário funciona mesmo sem
JavaScript. Isso removeu quatro rotas, o gateway HTTP e a porta que só existia
para abstrair o `fetch`.

Como Server Action é endpoint público (invocável sem passar pela UI), a
verificação de sessão e o parse com Zod continuam em `actions.ts`, exatamente
como estavam nos route handlers.

**Leitura no servidor, mutação no client.** `/crm` é um Server Component que
carrega a lista direto do repositório — sem `useEffect` de fetch. O client
recebe a lista como estado inicial e a atualiza com o lead que a própria mutação
devolve, sem refetch.

**Lista e cards na mesma tela, um estado só.** As duas visões são alternadas por
um toggle e leem do mesmo `useLeadList`, então busca, filtro e ordenação valem
para ambas e um lead cadastrado aparece nas duas. Antes eram duas rotas com
estados paralelos — trocar de aba perdia o filtro.

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

Organização **por feature**, cada uma dividida em quatro camadas.

```
src/
  features/
    leads/
      components/           crm-view (dono do estado), toggle-view, lead-table,
                            cards-view, lead-card, lead-actions, lead-form,
                            search-bar, send-welcome-button, new-lead-button
      hooks/                use-lead-list — lista, filtros e mutações locais
                            use-send-welcome — regra de envio, compartilhada
                            pelo botão rápido e pelo menu
      application/          casos de uso: get-leads, create-lead, delete-lead,
                            send-welcome, filter-leads, describe-failure
      data/                 supabase-lead-repository, postgrest-errors,
                            resend-welcome-mailer, welcome-email-template
      types/                lead, lead-row, lead-schema, results, data-result
                            e as portas: lead-repository, welcome-mailer
      actions.ts            Server Actions — adaptador de entrada
      dependencies.server.ts composition root
    auth/
      components/           login-form, demo-credentials
      application/          session: login, logout, isAuthenticated
      data/                 cookie-session-store, env-credentials-checker
      types/                auth: loginSchema e as portas SessionStore
                            e CredentialsChecker
      actions.ts            Server Actions
      dependencies.ts       composition root
  components/
    ui/                     átomos e moléculas compartilhados (button, input,
                            select, field, card, badge, modal, menu, skeleton,
                            empty/error state)
    layout/                 header, footer, logout-button, page-heading
    brand/                  wordmark
  lib/
    supabase/client.ts      conexão compartilhada (server-only, preguiçosa)
    utils/                  cn, formatação de data e iniciais
    env.ts                  leitura de env com falha explícita
  app/
    layout.tsx              fontes (Raleway/Inter), metadata
    globals.css             tokens @theme da identidade Olyra
    page.tsx                redireciona para /crm ou /login
    login/page.tsx          tela de login
    (app)/                  grupo de rotas protegidas
      layout.tsx            guard de sessão + header + footer
      crm/page.tsx          a tela: busca, filtros e as duas visões
      crm/loading.tsx       skeleton enquanto o servidor busca os leads
supabase/
  schema.sql · seed.sql     SQL de criação e leads fictícios
```

Testes ficam ao lado do que testam (`filter-leads.test.ts` vizinho de
`filter-leads.ts`), não em uma árvore `__tests__` paralela — mover o arquivo
leva o teste junto.

**Direção das dependências.**

```
components → application → types (portas) ← data
```

Componentes chamam casos de uso; casos de uso dependem só de **contratos**
declarados em `types`; `data` implementa esses contratos. Nenhum componente
importa `data` nem o cliente do banco — o pacote `server-only` transforma essa
tentativa em erro de build.

**Trocar Supabase por Postgres** é escrever `data/postgres-lead-repository.ts`
respeitando a porta `LeadRepository` e apontar uma linha de
`features/leads/dependencies.server.ts` para ele. A application, os componentes
e as rotas não mudam. O mesmo vale para trocar o Resend: a porta é
`WelcomeMailer`.

---

## Funcionalidades

- Login com credencial fixa; rotas protegidas redirecionam para `/login`
- Cadastro de lead com validação (nome, email, origem)
- Busca por nome ou email — sem acento e sem diferenciar maiúsculas
- Filtro por origem
- Cadastro em modal, aberto pelo botão “Novo lead”
- Visualização em tabela (empilha em mobile, sem scroll horizontal) e em cards
- Envio real de email de boas-vindas, com status persistido em `welcome_sent_at`
- Estados de carregamento, vazio e erro em toda tela com dados
- `prefers-reduced-motion` respeitado

## Testes

```bash
npm test          # roda uma vez
npm run test:watch
```

Vitest, ambiente Node, sem DOM. A cobertura é deliberadamente estreita: **a
lógica pura e as fronteiras**, que é onde o erro passa despercebido.

| Arquivo | O que garante |
|---|---|
| `filter-leads.test.ts` | busca sem acento, filtro por origem, as quatro ordenações e a não-mutação da lista original |
| `postgrest-errors.test.ts` | cada código do Postgres/PostgREST cai na categoria certa |
| `lead-row.test.ts` | uma coluna renomeada no banco derruba o parse — regressão de um bug real |
| `lead-schema.test.ts` | normalização e recusa de entrada inválida |
| `describe-failure.test.ts` | o detalhe técnico vai para o log e **nunca** para a tela |
| `format.test.ts` | data no fuso de São Paulo e degradação sem "Invalid Date" |

Não há teste de componente nem E2E. Com o tempo disponível, cobrir a lógica que
falha em silêncio rende mais que simular clique em botão — o comportamento da
interface foi verificado no navegador.

> `vitest.config.mts` aponta `server-only` para o módulo vazio do próprio
> pacote. Fora do contexto de servidor do React ele lança de propósito, e é
> essa barreira que impede um componente client de arrastar a chave do Supabase.

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servir o build
npm run lint    # ESLint
npm test        # Vitest
```
