# Desafio Olyra — Mini CRM de Leads

Spec de execução. Escrita para ser seguida passo a passo, sem ambiguidade.

Seguir as skills `yasuho-code`, `yasuho-design`, `yasuho-motion`.

**Sobre a empresa:** Olyra vende aromatizadores. A identidade visual deve remeter a natureza, calma, botânico, artesanal — não a software corporativo frio.

---

## STACK DEFINIDA (não alterar)

| Item | Escolha |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript strict |
| Estilo | Tailwind v4 com `@theme` |
| Banco | Supabase (Postgres) |
| Auth | Credenciais fixas em env var + cookie de sessão |
| Email | Resend API |
| Deploy | Netlify |

**Por que Next.js e não Astro:** o projeto tem estado, formulários, interatividade e rotas protegidas. É aplicação, não site estático.

**Por que auth fixa e não Supabase Auth:** o enunciado pede explicitamente "credenciais fixas, sem cadastro de usuários". Implementar auth completo seria over-engineering fora do escopo pedido.

---

## DESIGN — Identidade Olyra

### Tokens (usar exatamente estes valores)

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Paleta oficial Olyra */
  --color-forest: #3c5b43;      /* verde principal — ações, destaque */
  --color-forest-deep: #061b0c;  /* verde quase preto — texto principal */
  --color-cream: #f8f4e8;        /* creme — fundo da página */
  --color-sage: #a3c4a8;         /* verde claro — bordas, acentos suaves */

  /* Derivados semânticos */
  --color-bg: var(--color-cream);
  --color-surface: #ffffff;
  --color-text: var(--color-forest-deep);
  --color-text-muted: #5a6b5e;
  --color-border: #dfe5da;
  --color-primary: var(--color-forest);
  --color-primary-hover: #2f4835;

  /* Estados */
  --color-success: #4a7c59;
  --color-error: #9b4444;

  /* Tipografia */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Forma */
  --radius: 10px;
}
```

**Regra absoluta:** nenhum componente usa cor crua (`#hex` ou `bg-green-500`). Sempre token.

### Estética: Warm / Artesanal

Seguindo `yasuho-design`, Parte 2, item 4. Aplicado aqui:

- Fundo creme, superfícies brancas, respiro generoso
- Títulos em serifada (Fraunces) — dá calor e personalidade, combina com produto artesanal
- Corpo em sans neutra (Inter) — legibilidade
- Bordas suaves em tom da paleta (sage), nunca cinza puro
- Sombra muito discreta, quase imperceptível
- Cantos arredondados (10px)

### Tipografia (via Google Fonts no layout)

```
Fraunces  — títulos (peso 500-600)
Inter     — corpo e interface (peso 400-500)
```

### Movimento

Conforme `yasuho-motion`, estética warm: suave e discreto.
- Transições de cor/hover: 150ms ease-out
- Entrada de cards: fade + translate Y 12px, 400ms, stagger 50ms
- Nada de parallax, scroll animation ou efeito chamativo

---

## ARQUITETURA DE PASTAS

```
src/
  app/
    layout.tsx                 ← fontes, metadata
    globals.css                ← tokens @theme
    login/
      page.tsx                 ← tela de login
    (app)/                     ← rotas protegidas
      layout.tsx               ← header + footer + guard de auth
      crm/
        page.tsx               ← formulário + tabela de leads
      cards/
        page.tsx               ← visualização em cards
    api/
      auth/
        login/route.ts         ← valida credencial, seta cookie
        logout/route.ts        ← limpa cookie
      leads/route.ts           ← GET lista, POST cria
      send-welcome/route.ts    ← envia email via Resend
  components/
    ui/
      button.tsx
      input.tsx
      field.tsx                ← label + input + erro
      card.tsx
      badge.tsx
    layout/
      header.tsx
      footer.tsx
    leads/
      lead-form.tsx            ← formulário de cadastro
      lead-table.tsx           ← tabela com busca
      lead-card.tsx            ← card individual
      search-bar.tsx
  lib/
    db/
      client.ts                ← cliente Supabase
    auth.ts                    ← helpers de sessão
    validations.ts             ← schemas Zod
  types/
    lead.ts                    ← tipos do domínio
```

---

## BANCO DE DADOS

### Tabela `leads` no Supabase

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  origem text not null,
  welcome_sent_at timestamptz,
  created_at timestamptz default now()
);

alter table leads enable row level security;

-- Como a autenticação é fixa (não usa Supabase Auth),
-- o acesso é feito via service role key no servidor.
-- Nenhuma policy pública é criada — o client nunca acessa direto.
```

### Seed — leads fictícios

Inserir estes 6 leads para visualização inicial:

```sql
insert into leads (nome, email, origem) values
  ('Mariana Costa',    'mariana.costa@exemplo.com',  'Instagram'),
  ('Rafael Andrade',   'rafael.andrade@exemplo.com', 'Indicação'),
  ('Juliana Prado',    'juliana.prado@exemplo.com',  'Site'),
  ('Bruno Lima',       'bruno.lima@exemplo.com',     'Feira'),
  ('Carolina Nunes',   'carolina.nunes@exemplo.com', 'Instagram'),
  ('Thiago Moreira',   'thiago.moreira@exemplo.com', 'Google');
```

### Tipo do domínio

```ts
// src/types/lead.ts
export type Lead = {
  id: string
  nome: string
  email: string
  origem: string
  welcome_sent_at: string | null
  created_at: string
}

export type NewLead = {
  nome: string
  email: string
  origem: string
}

export const ORIGENS = [
  'Instagram',
  'Site',
  'Indicação',
  'Feira',
  'Google',
  'Outro',
] as const
```

---

## VARIÁVEIS DE AMBIENTE

Criar `.env.local` (e configurar as mesmas no painel do Netlify):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# Auth fixa
AUTH_USER=olyra
AUTH_PASSWORD=escolher-uma-senha-forte
SESSION_SECRET=string-aleatoria-longa

# Resend
RESEND_API_KEY=re_xxxxx
RESEND_FROM=onboarding@resend.dev
```

**Nota sobre `RESEND_FROM`:** sem domínio verificado, o Resend só permite enviar de `onboarding@resend.dev` e apenas para o email cadastrado na conta. Isso é suficiente para o desafio — mencionar essa limitação no README.

---

# ETAPAS DE EXECUÇÃO

Cada etapa é independente e verificável. Marcar ao concluir.

---

## BLOCO 1 — Fundação (fazer hoje, antes de sair)

Objetivo: projeto rodando, autenticação funcionando, banco conectado.

### [ ] 1.1 — Criar projeto

```bash
npx create-next-app@latest olyra-crm --typescript --tailwind --app --no-src-dir=false
cd olyra-crm
npm install @supabase/supabase-js resend zod react-hook-form @hookform/resolvers
```

### [ ] 1.2 — Configurar tokens

Substituir o conteúdo de `src/app/globals.css` pelo bloco `@theme` da seção DESIGN acima.

### [ ] 1.3 — Configurar fontes

Em `src/app/layout.tsx`, importar Fraunces e Inter via `next/font/google`, aplicar como variáveis CSS.

### [ ] 1.4 — Criar projeto Supabase

1. Criar conta/projeto em supabase.com
2. Rodar o SQL da tabela `leads` no SQL Editor
3. Rodar o SQL de seed
4. Copiar URL e Service Role Key para `.env.local`

### [ ] 1.5 — Cliente Supabase

```ts
// src/lib/db/client.ts
import { createClient } from '@supabase/supabase-js'

export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
```

Este cliente só é usado no servidor (route handlers e server components). Nunca importar em componente client.

### [ ] 1.6 — Helpers de autenticação

```ts
// src/lib/auth.ts
import { cookies } from 'next/headers'

const COOKIE_NAME = 'olyra_session'

export function validateCredentials(user: string, password: string) {
  return user === process.env.AUTH_USER && password === process.env.AUTH_PASSWORD
}

export async function createSession() {
  const store = await cookies()
  store.set(COOKIE_NAME, process.env.SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
}

export async function destroySession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAuthenticated() {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === process.env.SESSION_SECRET
}
```

### [ ] 1.7 — Rotas de auth

`src/app/api/auth/login/route.ts` — recebe `{ user, password }`, valida, cria sessão, retorna sucesso ou 401.

`src/app/api/auth/logout/route.ts` — destrói sessão, retorna sucesso.

### [ ] 1.8 — Tela de login

`src/app/login/page.tsx`

- Layout centralizado, fundo creme
- Card branco com sombra suave, largura máxima 400px
- Logo/nome "Olyra" em Fraunces
- Subtítulo curto: "Painel de leads"
- Campos: usuário e senha (usar React Hook Form)
- Erro exibido abaixo dos campos em caso de credencial inválida
- Botão em `--color-primary`, largura total
- Ao logar com sucesso, redirecionar para `/crm`

### [ ] 1.9 — Guard de rotas protegidas

`src/app/(app)/layout.tsx`

- Server component
- Chama `isAuthenticated()`; se falso, `redirect('/login')`
- Renderiza `<Header />`, `{children}`, `<Footer />`

### [ ] 1.10 — Header e Footer

**Header:**
- Nome "Olyra" à esquerda (Fraunces)
- Navegação: "Lista" (`/crm`) e "Cards" (`/cards`) — item ativo destacado
- Botão "Sair" à direita
- Fundo branco, borda inferior 1px em `--color-border`
- Mobile: navegação vira ícones ou empilha

**Footer:**
- Texto discreto: "Olyra — Painel de Leads"
- Fundo transparente, borda superior fina, texto em `--color-text-muted`

**Checkpoint do Bloco 1:** login funciona, redireciona pra `/crm`, header e footer aparecem, rota protegida bloqueia acesso sem sessão.

---

## BLOCO 2 — CRM (segunda à noite)

Objetivo: cadastrar e listar leads.

### [ ] 2.1 — API de leads

`src/app/api/leads/route.ts`

```
GET  → retorna todos os leads, ordenados por created_at desc
POST → valida body com Zod, insere no banco, retorna o lead criado
```

Ambos verificam autenticação antes de responder. Sem sessão válida → 401.

### [ ] 2.2 — Validação

```ts
// src/lib/validations.ts
import { z } from 'zod'
import { ORIGENS } from '@/types/lead'

export const leadSchema = z.object({
  nome: z.string().min(2, 'Informe o nome completo'),
  email: z.string().email('Email inválido'),
  origem: z.enum(ORIGENS),
})
```

### [ ] 2.3 — Componentes de UI base

Criar em `src/components/ui/`: `button.tsx`, `input.tsx`, `field.tsx`, `card.tsx`, `badge.tsx`.

Usar CVA no `button` e `badge` (têm variantes). `input`, `field` e `card` não precisam.

Botão — variantes: `primary` (fundo forest), `ghost` (transparente com hover sage), `danger` (para ações destrutivas, se houver). Tamanhos: `sm`, `md`.

### [ ] 2.4 — Formulário de cadastro

`src/components/leads/lead-form.tsx`

- React Hook Form + Zod resolver
- Campos: Nome (texto), Email (email), Origem (select com as opções de `ORIGENS`)
- Labels visíveis acima dos campos
- Erros abaixo de cada campo, em `--color-error`
- Botão "Cadastrar lead"
- Ao enviar com sucesso: limpar formulário, atualizar lista, mostrar confirmação breve
- Estado de loading no botão durante envio

### [ ] 2.5 — Busca e filtro

`src/components/leads/search-bar.tsx`

- Input de busca — filtra por nome ou email (case-insensitive)
- Select de origem — filtra por origem, com opção "Todas"
- Filtragem no client (a lista é pequena, não precisa ir ao servidor)

### [ ] 2.6 — Tabela de leads

`src/components/leads/lead-table.tsx`

Colunas: Nome · Email · Origem (badge) · Data · Ação (botão de email)

- Origem exibida como badge colorido em tom sage
- Data formatada em pt-BR (`dd/mm/aaaa`)
- Coluna de ação: botão "Enviar boas-vindas" (implementado no Bloco 3)
- Se `welcome_sent_at` existir, mostrar "Enviado" em vez do botão
- **Mobile:** tabela vira lista de linhas empilhadas (não usar scroll horizontal)
- Estado vazio: mensagem orientando a cadastrar o primeiro lead

### [ ] 2.7 — Página `/crm`

`src/app/(app)/crm/page.tsx`

- Título da página em Fraunces
- Formulário no topo (ou em coluna lateral no desktop)
- Barra de busca
- Tabela abaixo
- Layout: no desktop, formulário à esquerda (1/3) e lista à direita (2/3); no mobile, empilhado

**Checkpoint do Bloco 2:** cadastrar lead funciona, ele aparece na lista, busca e filtro funcionam, layout responsivo OK.

---

## BLOCO 3 — Cards + Email (terça à noite)

### [ ] 3.1 — Card de lead

`src/components/leads/lead-card.tsx`

- Card branco, borda sutil, cantos arredondados
- Avatar circular com as iniciais do nome, fundo sage
- Nome em destaque (Fraunces), email abaixo em muted
- Badge de origem
- Data de cadastro em texto pequeno
- Botão "Enviar boas-vindas" no rodapé do card
- Hover: borda muda para sage, transição 150ms

### [ ] 3.2 — Página `/cards`

`src/app/(app)/cards/page.tsx`

- Mesma barra de busca da tela CRM (componente reutilizado)
- Grid responsivo: 3 colunas desktop, 2 tablet, 1 mobile
- Animação de entrada com stagger de 50ms
- Estado vazio tratado

### [ ] 3.3 — Configurar Resend

1. Criar conta em resend.com
2. Gerar API key
3. Adicionar `RESEND_API_KEY` no `.env.local`

### [ ] 3.4 — Template do email

Email HTML simples, na identidade Olyra (fundo creme, título em serifada, verde nos detalhes).

Conteúdo sugerido:

```
Assunto: Bem-vindo à Olyra, {nome}!

Olá, {nome}!

Que bom ter você por aqui.

Na Olyra, criamos aromatizadores pensados para transformar
ambientes em espaços de bem-estar. Cada essência é escolhida
com cuidado para acompanhar seus momentos.

Em breve entraremos em contato para apresentar nossa linha
e entender como podemos atender você melhor.

Com carinho,
Equipe Olyra
```

Manter o HTML simples — usar tabelas ou divs com estilo inline (clientes de email têm suporte limitado a CSS moderno).

### [ ] 3.5 — Rota de envio

`src/app/api/send-welcome/route.ts`

```
POST { leadId }
  → verifica autenticação
  → busca lead no banco
  → envia email via Resend
  → atualiza welcome_sent_at do lead
  → retorna sucesso ou erro
```

Tratar erro do Resend e devolver mensagem clara pro front.

### [ ] 3.6 — Integrar botão no front

Tanto na tabela quanto no card:
- Ao clicar: estado de loading
- Sucesso: feedback visual, botão vira "Enviado ✓"
- Erro: mensagem de erro visível

**Checkpoint do Bloco 3:** cards renderizam, email chega de verdade na caixa de entrada, status atualiza.

---

## BLOCO 4 — Deploy e entrega (terça à noite)

### [ ] 4.1 — Deploy no Netlify

1. Subir o código para um repositório no GitHub
2. Em netlify.com, conectar o repositório
3. Instalar o plugin oficial `@netlify/plugin-nextjs` (o Netlify normalmente detecta e sugere)
4. Configurar todas as variáveis de ambiente no painel (Site settings → Environment variables)
5. Fazer o deploy
6. Renomear o site para algo organizado, ex: `olyra-crm.netlify.app`

### [ ] 4.2 — Testar em produção

- [ ] Login funciona
- [ ] Cadastro de lead persiste
- [ ] Busca e filtro funcionam
- [ ] Cards renderizam
- [ ] Email é enviado de verdade
- [ ] Testado em celular real, não só devtools

### [ ] 4.3 — README

Conteúdo obrigatório:

```markdown
# Olyra — Mini CRM de Leads

Breve descrição do projeto.

## Stack
Lista com justificativa curta de cada escolha.

## Rodando localmente
1. Clonar
2. npm install
3. Criar .env.local (listar todas as variáveis necessárias, com exemplo)
4. Rodar o SQL de criação da tabela e seed (incluir o SQL no README)
5. npm run dev

## Decisões técnicas
- Por que Next.js
- Por que Supabase
- Por que autenticação fixa por cookie (e não Supabase Auth)
- Por que filtro no client
- Limitação conhecida: sem domínio verificado, o Resend envia apenas
  de onboarding@resend.dev e para o email cadastrado na conta

## Estrutura de pastas
Árvore resumida com explicação de cada camada.
```

### [ ] 4.4 — Enviar email de entrega

Para `tech@olyra.com.br` e `brunoqueirozbk@gmail.com`, contendo:

1. `.zip` do projeto — **sem** `node_modules`, `.next` e `.env.local`
2. Link do Netlify
3. Credenciais de login
4. Encaminhar o email de boas-vindas que a plataforma enviou

---

# MELHORIAS OPCIONAIS

Só implementar se sobrar tempo, na ordem de melhor custo/benefício:

1. **Contador de leads por origem** — pequeno resumo no topo da tela CRM. Rápido e mostra atenção a produto.
2. **Ordenação da tabela** — clicar no cabeçalho ordena por nome ou data.
3. **Excluir lead** — com confirmação.
4. **Toast de feedback** — em vez de mensagem inline.
5. **Exportar CSV** — útil de verdade para quem usa CRM.

Não sacrificar os blocos 1-4 por nenhuma dessas.

---

# REGRAS DE CÓDIGO (importante)

Conforme `yasuho-code`:

- **Zero `any`.** TypeScript strict.
- **Nenhum componente importa o cliente Supabase direto.** Só route handlers e server components acessam `lib/db/client.ts`.
- **Nenhuma cor crua.** Sempre token do `@theme`.
- **Sem comentário óbvio.** Não escrever `// busca os leads` antes de uma função chamada `getLeads`. Comentar apenas o *porquê* de decisões não evidentes.
- **Sem `useEffect` para buscar dados** quando Server Component resolve.
- **Componentes pequenos e com responsabilidade única.** Se um arquivo faz mais de uma coisa, quebrar.
- **Nomenclatura de arquivo em kebab-case.**
- **Estados de loading, vazio e erro tratados** em toda tela com dados.

---

# CHECKLIST FINAL

- [ ] Login com credencial fixa funciona
- [ ] Rotas protegidas bloqueiam acesso sem sessão
- [ ] Cadastro de lead com validação
- [ ] Lista com busca e filtro por origem
- [ ] Visualização em cards
- [ ] Email real enviado via Resend
- [ ] Status de envio persistido no banco
- [ ] Header e footer em todas as telas
- [ ] 6 leads fictícios no banco
- [ ] Responsivo testado em celular real
- [ ] Identidade visual Olyra aplicada (paleta + estética botânica)
- [ ] Deploy no Netlify funcionando
- [ ] README completo
- [ ] Build sem warnings
- [ ] Zero `any` no projeto
