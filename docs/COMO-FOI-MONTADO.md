# Como este projeto foi montado

Documento de leitura. Não é README nem spec — é a explicação, em linguagem
humana, de **o que existe, por que existe e em que ordem foi construído**.

Escrito depois de ler os 61 arquivos de `src/`, o spec e o SQL, um por um.

> **Atualizado** após duas reorganizações grandes: a divisão por feature em
> Clean Architecture e a troca das rotas de API por Server Actions. A seção
> "Depois da primeira versão" no fim conta essa parte.

---

## Antes de tudo: o que é "spec" e o que é "user story" aqui

Você pediu "spec por spec, user story por user story". Vale começar sendo honesto
sobre o que o repositório de fato tem, porque isso muda a leitura:

- **Existe um único spec:** `specs/spec-desafio-olyra.md`. É um documento de
  execução — stack fechada, tokens de design, árvore de pastas, SQL, e o
  trabalho quebrado em 4 blocos com tarefas numeradas.
- **Não existem user stories no formato clássico** ("Como X, quero Y, para Z").
  Não há pasta de stories, nem issues, nem tickets no repositório.

O que faz o papel de user story são as **tarefas numeradas dos blocos**
(`1.1`, `1.2`, … `4.4`) mais o **checklist final** do spec. Cada tarefa é uma
fatia entregável e verificável. Então é assim que este documento vai ler: cada
tarefa do spec como se fosse uma story, e os arquivos que nasceram dela.

Sobre o histórico do git: os blocos 1 a 4 **não** aparecem como commits. O
projeto inteiro entrou de uma vez em `d931720`, e só depois disso o histórico
passa a acompanhar as mudanças. A ordem descrita abaixo é a ordem lógica do
spec — que é a ordem em que as dependências entre os arquivos exigem que tenha
sido feito —, não uma reconstituição de commits.

```
0320f25  Server Actions no lugar das rotas de API
c819cce  reorganização por feature em Clean Architecture
8e8433a  troca para a secret key do Supabase
d931720  o projeto inteiro (blocos 1 a 4)
6f91b29  create-next-app
```

---

## O produto, em uma frase

Um painel interno da Olyra onde alguém da equipe entra com usuário e senha fixos,
cadastra leads (nome, email, origem), enxerga a mesma base em duas visualizações
(tabela e cards), filtra por texto e por origem, e dispara um email de
boas-vindas de verdade para o lead — com o status do envio gravado no banco.

Olyra vende aromatizadores. Por isso a interface não parece software corporativo:
fundo creme, verde floresta, títulos em serifada. Isso é decisão de produto, não
enfeite — está escrito no spec logo na primeira seção.

---

## O mapa mental: as camadas

Antes de ir arquivo por arquivo, a regra que organiza tudo. O código é dividido
**por feature** (`leads`, `auth`), e cada feature tem quatro camadas com uma
direção única de dependência:

```
components/     a UI da feature
     ↓ chama
actions.ts      'use server' — autentica, valida, delega
     ↓ chama
application/    os casos de uso; a regra de negócio mora aqui
     ↓ depende só de
types/          os contratos (portas)
     ↑ implementa
data/           Supabase, Resend, cookie — o mundo lá fora
```

Repare na direção das setas em torno de `types`: a `application` **não conhece**
o `data`. Os dois apontam para o contrato no meio. É isso que permite trocar
Supabase por Postgres sem que a regra de negócio perceba.

E existe um atalho, só para a **leitura inicial** da página:

```
Server Component (page.tsx) → application/get-leads.ts → LeadRepository → Supabase
```

Consequência prática: **nenhum componente de UI importa o cliente do banco.**
Isso não depende de disciplina — é forçado pelo pacote `server-only`, que
transforma esse import em erro de build. Voltaremos nisso.

---

## BLOCO 1 — Fundação

> Objetivo do spec: "projeto rodando, autenticação funcionando, banco conectado."

### Story 1.1 — Criar o projeto

O ponto de partida foi um `create-next-app` (o commit `6f91b29`). Depois vieram
as dependências.

**`package.json`** — vale ler a lista de dependências como uma declaração de
intenção, porque cada uma resolve um problema nomeado no spec:

| Pacote | Para quê |
|---|---|
| `next` 15 + `react` 19 | App Router, Server Components, Server Actions |
| `@supabase/supabase-js` | acesso ao Postgres |
| `resend` | envio de email |
| `zod` 4 | validação, compartilhada entre client e servidor |
| `react-hook-form` + `@hookform/resolvers` | formulários com o mesmo schema Zod |
| `class-variance-authority` | variantes de botão e badge |
| `clsx` + `tailwind-merge` | a função `cn()` |
| `motion` | animação de entrada dos cards |
| `server-only` | barreira de build entre servidor e client |

`server-only` e `motion` **não estavam no spec**. Foram adicionados: um por
segurança, outro porque o spec pedia stagger nos cards mas não disse com quê.

**`tsconfig.json`** — `strict: true` e, além do que o spec pedia,
`noUncheckedIndexedAccess: true`. Esse segundo flag é o que faz
`array[0]` ter tipo `T | undefined` em vez de `T`. É rigoroso e aparece no
código: em `src/lib/utils/format.ts` você vê `parts.at(0)?.charAt(0) ?? ''` —
o `?.` e o `??` estão ali porque esse flag existe.

### Story 1.2 — Tokens de design

**`src/app/globals.css`** é o arquivo mais importante do visual inteiro.

O spec deu 15 tokens. O arquivo final tem uns 25. O que foi acrescentado, e por quê:

- `--color-sage-soft`, `--color-success-soft`, `--color-error-soft` — superfícies
  claras derivadas da paleta. Sem elas, um badge de sucesso teria que inventar
  um hex na hora, e a regra "nenhuma cor crua" cairia.
- `--radius-md`, `--radius-sm`, `--radius-lg` — o Tailwind v4 lê `--radius-md`
  para gerar a utilidade `rounded-md`. Sem esse mapeamento, `rounded-md` usaria
  o valor padrão do Tailwind, não os 10px da marca.
- `--shadow-soft` e `--shadow-raised` — sombra dupla, luz vindo de cima.
- `--ease-out-soft` — a curva de movimento.

Abaixo dos tokens há um `@layer base` que faz três coisas discretas e
importantes: aplica a serifada em todo `h1/h2/h3` automaticamente, define **um
único anel de foco** para o projeto inteiro (`:focus-visible` em verde floresta),
e — no fim do arquivo — zera todas as animações sob
`@media (prefers-reduced-motion: reduce)`. Esse último bloco é acessibilidade
real: quem configurou o sistema para reduzir movimento não vê nada se mexer.

**A regra que amarra tudo:** nenhum componente escreve `#hex` ou `bg-green-500`.
Verifiquei — a única exceção é `features/leads/data/welcome-email-template.ts`,
e ela é justificada em comentário no próprio arquivo: cliente de email não
entende `var()`, então os hex são repetidos à mão ali.

### Story 1.3 — Fontes

**`src/app/layout.tsx`** carrega Raleway (títulos) e Inter (corpo) via
`next/font/google`, expondo cada uma como variável CSS (`--font-raleway`,
`--font-inter`). O `globals.css` então faz `--font-display: var(--font-raleway)`.

A escolha de Raleway não é gosto: é a fonte que o site da Olyra carrega. O
projeto começou com Fraunces, uma serifada, pela leitura "artesanal" do spec —
mas o site real é sem serifa, e coerência com a marca vale mais que a estética
que a spec sugeriu. O corpo fica em Inter porque, em tabela densa e texto de
interface, ela é mais legível em tamanho pequeno do que uma fonte de display.

Por que essa indireção em vez de importar a fonte no CSS: `next/font` baixa e
auto-hospeda os arquivos no build. Não há requisição para o Google em runtime,
não há bloqueio de render, e não há problema de privacidade. O `display: 'swap'`
garante que o texto aparece imediatamente com a fonte de fallback.

O `<html>` já sai com `lang="pt-BR"` — detalhe pequeno, mas é o que faz leitor de
tela pronunciar português.

### Story 1.4 — Banco

**`supabase/schema.sql`** e **`supabase/seed.sql`**.

O schema é quase idêntico ao spec, com duas adições:

1. `create index leads_created_at_idx on leads (created_at desc)` — porque a
   única consulta de listagem ordena exatamente por esse campo, nessa direção.
2. `if not exists` em tudo — dá para rodar o arquivo duas vezes sem quebrar.

O `alter table leads enable row level security` merece um parágrafo, porque é
contraintuitivo: **liga-se RLS e não se cria nenhuma policy.** No Postgres, RLS
ligada sem policy significa "ninguém lê nada". Isso é de propósito. Todo acesso
do painel passa pelo servidor usando a *secret key* (`sb_secret_…`), que carrega
`BYPASSRLS` e ignora as policies por definição. Então a RLS ligada não atrapalha
o painel e serve de rede de segurança: se a *publishable key* vazar, ela não lê
um único lead.

(Essas são as chaves novas do Supabase. A `service_role` virou **secret key** e
a `anon` virou **publishable key**; as antigas ainda funcionam, mas saem de
circulação no fim de 2026. O Supabase ainda recusa a secret key com 401 se a
requisição vier de um navegador — uma barreira a mais, de graça.)

O seed foi reescrito em relação ao spec. O spec tinha um `insert ... values`
simples, que duplicaria os 6 leads a cada execução. A versão final usa
`select ... where not exists`, checando por email — **idempotente**. Rodar de
novo não faz nada.

**`src/features/leads/types/lead.ts`** — o vocabulário do domínio. `ORIGINS` é um
array `as const`, o que permite derivar o tipo `Origin` dele
(`(typeof ORIGINS)[number]`). Uma lista, uma fonte de verdade: o select do
formulário, o filtro da busca e o schema Zod leem todos daqui. Adicionar
"LinkedIn" é uma linha.

Repare que `Lead.origin` é `string`, mas `NewLead.origin` é `Origin`. Isso é
intencional e correto: na **escrita** você exige uma origem válida da lista; na
**leitura**, o banco pode devolver algo antigo que não está mais na lista, e a
interface não pode quebrar por isso.

(As colunas do banco são `name` e `origin`, em inglês, como todo identificador
do código. Os rótulos na tela continuam em português.)

### Story 1.5 — Cliente Supabase

**`src/lib/env.ts`** veio antes, e não estava no spec. É uma função só:

```ts
export function requireEnv(name: string): string
```

Se a variável não existe, lança erro com uma frase útil em português
("Confira o .env.local (ou o painel do Netlify)"). O comentário no arquivo
explica a decisão real: a leitura é **sob demanda**, não em um objeto congelado
no topo do módulo. Se fosse congelado, o `next build` — que executa módulos —
falharia com um build vermelho e críptico. Do jeito que está, falha na hora do
uso, com mensagem clara.

**`src/lib/supabase/client.ts`** diverge do spec de duas formas, e as duas são
upgrade:

O spec pedia `export const db = createClient(...)` — um cliente criado no import.
O código tem `getSupabase()`, que cria na primeira chamada e guarda
(`client ??= createClient(...)`). Criação **preguiçosa**, pelo mesmo motivo do
`env.ts`: o build não precisa dos segredos.

E a primeira linha do arquivo é `import 'server-only'`. Esse pacote não faz nada
em runtime — ele existe para explodir o build se um componente `'use client'`
importar o módulo. É a barreira que garante que a secret key nunca chega ao
navegador. Hoje esse import aparece em **11 arquivos**: todo o `data/` e o
`application/` das duas features, os dois composition roots e este cliente.

Ele mora em `lib/` e não dentro de uma feature porque é conexão compartilhada —
se amanhã existir uma feature `users`, ela usa a mesma.

### Story 1.6 — Sessão

**`src/features/auth/data/cookie-session-store.ts`** é o arquivo que mais se
afasta do spec, e vale entender por quê.

O spec propunha guardar o `SESSION_SECRET` **dentro do cookie** e comparar
igualdade direta. Funciona, mas tem dois problemas: o segredo vai para o
navegador (basta abrir o DevTools para lê-lo), e a comparação com `===` vaza
tempo.

O que foi feito:

```ts
function sign(user: string): string {
  return createHmac('sha256', requireEnv('SESSION_SECRET')).update(user).digest('hex')
}
```

O cookie guarda o **HMAC-SHA256 do usuário**, assinado com o segredo. O segredo
em si nunca sai do servidor. Sem conhecê-lo, não dá para forjar um cookie válido.

E a comparação passa por `safeEquals`, que usa `timingSafeEqual` do Node — tempo
constante, para não vazar informação por quanto demora a falhar. Detalhe: ela
checa o tamanho antes, porque `timingSafeEqual` **lança exceção** se os buffers
tiverem tamanhos diferentes.

O cookie: `httpOnly` (JavaScript não lê), `sameSite: 'lax'` (não vai em
requisição cross-site), `secure` em produção (só HTTPS), 8 horas de vida.

Esse arquivo implementa a porta `SessionStore`; quem checa usuário e senha é o
`env-credentials-checker.ts`, implementando `CredentialsChecker`. São duas portas
separadas de propósito — trocar "credencial fixa em env" por "tabela `users` com
hash" mexe em uma sem tocar na outra.

### Story 1.7 — Entrar e sair

**`src/features/auth/application/session.ts`** expõe `login`, `logout` e
`isAuthenticated`. Nenhum dos três sabe o que é cookie ou variável de ambiente —
falam só com as duas portas.

**`src/features/auth/actions.ts`** é a porta de entrada. O `loginAction`:

1. valida com `loginSchema.safeParse` — o input chega como `unknown`;
2. devolve `{ ok: false, message }` se o corpo é inválido ou a credencial errada;
3. sucesso → a sessão já foi criada pela application → `{ ok: true }`.

Repare que a mensagem de erro é sempre "Usuário ou senha inválidos" — nunca
"usuário não existe". Não se entrega ao atacante a informação de qual metade
estava certa.

(Na primeira versão isso era `src/app/api/auth/login/route.ts`, um route handler
que devolvia 400/401. Virou Server Action — a última seção do documento explica
a troca.)

### Story 1.8 — Tela de login

Aqui aparece o padrão de composição que se repete no projeto inteiro:
**a página é Server Component e o formulário é Client Component.**

**`src/app/login/page.tsx`** (servidor) faz uma coisa útil antes de renderizar:
se você já está autenticado, `redirect('/crm')`. Não faz sentido mostrar login
para quem já entrou. Depois monta o layout — cartão de 400px, centralizado,
wordmark e subtítulo — e coloca `<LoginForm />` dentro.

**`src/features/auth/components/login-form.tsx`** (client) tem o estado. React
Hook Form com `zodResolver(loginSchema)`. Três estados de erro tratados
separadamente:

- erro de **campo** (vazio) → vem do Zod, aparece sob o campo;
- erro do **servidor** (credencial inválida) → `serverError`, em caixa vermelha
  acima do botão;
- erro de **rede** (a chamada não completou) → mensagem específica,
  "Falha de conexão. Verifique sua internet".

Esse terceiro caso é o que quase todo mundo esquece. Sem ele, tirar o wi-fi e
clicar em Entrar deixa o botão travado em "Entrando…" para sempre.

O `noValidate` no `<form>` desliga a validação nativa do navegador, para que o
usuário veja as mensagens em português do Zod e não as do Chrome em inglês.

**`src/features/auth/components/demo-credentials.tsx`** mostra usuário e senha na
própria tela — decisão consciente, porque é painel de demonstração e quem avalia
precisa entrar. Ele não lê `process.env`: chama `getDemoCredentials()` na
application. Assim, apagar o bloco em uso real é devolver `null` lá, sem tocar na
UI.

### Story 1.9 — Guard das rotas protegidas

**`src/app/(app)/layout.tsx`** — 8 linhas de código real, e é a peça de
segurança da navegação:

```tsx
if (!(await isAuthenticated())) redirect('/login')
```

O parêntese `(app)` no nome da pasta é um **route group** do Next: ele agrupa
rotas sob um layout compartilhado **sem** aparecer na URL. A página é `/crm`,
não `/app/crm`. Tudo que estiver dentro de `(app)/` herda esse guard
automaticamente — criar `(app)/relatorios/page.tsx` amanhã já nasce protegido,
sem ninguém lembrar de nada.

Como isso roda no servidor antes de qualquer HTML sair, não existe "flash" de
conteúdo protegido antes do redirect.

**`src/app/page.tsx`** (a raiz) é um despachante de 3 linhas: autenticado vai
para `/crm`, senão para `/login`.

### Story 1.10 — Header e Footer

Quatro arquivos, e a divisão entre eles explica bem a filosofia do projeto:

- **`header.tsx`** — Server Component. Só estrutura, sem estado.
- **`nav-link.tsx`** — Client Component, porque precisa de `usePathname()` para
  saber qual item está ativo. Além de destacar visualmente, marca
  `aria-current="page"` — que é o que um leitor de tela usa para anunciar
  "página atual".
- **`logout-button.tsx`** — Client Component, porque tem `onClick` e estado de
  loading.
- **`footer.tsx`** — Server Component, texto puro.

A lição: só duas coisas viraram client, e cada uma pelo menor motivo possível. O
header não virou client inteiro por causa do link ativo.

Esses quatro ficam em `src/components/layout/` e não dentro de uma feature —
são o chassi da aplicação, não pertencem a leads nem a auth. (O `logout-button`
chama a action de auth, mas continua sendo peça de layout.)

**`components/brand/wordmark.tsx`** não estava no spec. Nasceu como um SVG de
folha desenhado à mão e hoje serve a **logo oficial da Olyra** — o lockup
horizontal (símbolo de gota com espiral + "OLYRA"), monocromático e com fundo
transparente, o que dispensa variante para creme e para branco.

O arquivo é servido de `public/olyra-logo.png`, e **não** por hotlink na CDN da
loja: dependência de terceiro pode cair, mudar de caminho ou limitar requisição,
e a marca sumiria do painel sem aviso.

O símbolo isolado virou o favicon em `src/app/icon.png` — o App Router detecta
esse nome sozinho e gera a tag `<link rel="icon">`. Foi recortado da versão
quadrada da marca, deixando de fora a palavra "OLYRA", que é ilegível a 16px.
Com isso saiu também o `favicon.ico` padrão do `create-next-app`.

O SVG de folha original sobreviveu em `empty-state.tsx`, como ícone decorativo
dos estados vazios.

**Estado ao fim do Bloco 1:** dá para entrar, o header aparece, e tentar acessar
`/crm` sem sessão joga para o login.

---

## BLOCO 2 — O CRM

> Objetivo: cadastrar e listar leads.

### Story 2.1 — O caminho de escrita

Na primeira versão isto era `src/app/api/leads/route.ts`, com `GET` e `POST`,
status codes e JSON. Hoje são duas peças:

**`src/features/leads/actions.ts`** — o adaptador. `createLeadAction` faz três
coisas e nada mais:

```ts
if (!(await isAuthenticated())) return { ok: false, message: 'Sessão expirada…' }

const parsed = leadSchema.safeParse(input)
if (!parsed.success) return { ok: false, message: 'Dados inválidos.' }

return createLead(parsed.data)
```

Autentica, valida, delega. Nenhuma regra vive aqui.

**`src/features/leads/application/create-lead.ts`** — o caso de uso. Chama o
repositório e transforma falha em valor de retorno:

```ts
try {
  return { ok: true, lead: await leadRepository.create(input) }
} catch (error) {
  console.error('[leads] falha ao cadastrar', error)
  return { ok: false, message: 'Não foi possível cadastrar o lead.' }
}
```

Duas coisas para reparar. Primeiro: o `catch` **nunca vaza a mensagem do
Supabase** para o cliente — a técnica fica no `console.error` do servidor, a
humana vai para a tela. Segundo: o parâmetro da action é `input: unknown`, não
`LeadInput`. Isso não é preguiça de tipo; é a afirmação de que **aquilo que
chega ali não é confiável até passar pelo Zod**.

### Story 2.2 — Validação: por que o Zod ficou mais importante, não menos

**`src/features/leads/types/lead-schema.ts`** e
**`src/features/auth/types/auth.ts`** guardam os três schemas do projeto.

Este é o ponto do projeto que mais gera mal-entendido, então vale ser explícito:
**tirar a API não diminuiu o papel do Zod — aumentou.**

Server Action não é função privada. Ela é um **endpoint público**: o Next gera um
identificador para ela e qualquer pessoa pode invocá-la com o payload que quiser,
sem nunca abrir sua interface. Do ponto de vista de segurança, é exatamente a
mesma superfície que a rota `POST /api/leads` era. Se o `safeParse` sair, entra
lixo no banco — ou pior.

Daí o desenho: a action recebe `unknown` e **só confia no que sai do `safeParse`**.

E o schema faz quatro trabalhos ao mesmo tempo, o que é o motivo real de ele
existir num arquivo só:

1. **Feedback no formulário** — o `zodResolver` do React Hook Form usa este mesmo
   schema para mostrar "Email inválido" embaixo do campo.
2. **Defesa no servidor** — a action revalida, porque o formulário é só uma
   sugestão educada.
3. **Normalização** — `.trim()` e `.toLowerCase()` fazem ` Mariana ` virar
   `Mariana` e `MARIANA@X.COM` virar `mariana@x.com` **antes de chegar ao banco**.
   Como vive no schema, acontece nos dois lados de graça.
4. **Fonte do tipo** — `type LeadInput = z.infer<typeof leadSchema>`. O tipo é
   *derivado* da validação, então é impossível o tipo e a regra divergirem.

```ts
name:   z.string().trim().min(2, 'Informe o nome completo'),
email:  z.email('Email inválido').trim().toLowerCase(),
origin: z.enum(ORIGINS, { message: 'Selecione uma origem' }),
```

O `origin` lê de `ORIGINS`, o mesmo array que alimenta o select — adicionar uma
origem nova é mexer em um lugar e a validação acompanha sozinha.

(Detalhe de versão: é `z.email(...)`, não `z.string().email(...)` como no spec.
Zod 4 moveu os validadores de string para o topo.)

### Story 2.3 — Componentes de UI base

O spec pediu 5 arquivos em `components/ui/`. O projeto tem 9. Os quatro extras
não são enfeite:

- **`select.tsx`** — o formulário tem um campo de origem; sem esse componente
  ele seria um `<select>` cru, visualmente destoante de tudo. A seta é um SVG
  posicionado por cima, com `appearance-none` no select — é assim que se
  estiliza select consistentemente entre navegadores.
- **`empty-state.tsx`** — o spec exigia estados vazios; isso os torna um
  componente em vez de um `<p>` copiado em três lugares.
- **`error-state.tsx`** — idem para erro.
- **`skeleton.tsx`** — para os arquivos `loading.tsx`.

E um arquivo que não é componente: **`control.ts`**. Ele exporta a string de
classes compartilhada entre `input` e `select`. O comentário no arquivo diz o
porquê em uma linha: "para que os dois nunca divirjam". Sem isso, alguém muda a
altura do input de `h-11` para `h-12` e o select fica desalinhado no formulário.

Esses nove vivem fora das features, em `src/components/ui/`, porque são **átomos
e moléculas** — não pertencem a leads nem a auth. É a divisão que o
`yasuho-code` pede: átomo e molécula compartilhados, organismo dentro da feature.

**`button.tsx`** e **`badge.tsx`** usam CVA (`class-variance-authority`), como o
spec pediu, porque têm variantes. O botão ganhou uma variante que não estava no
spec — `outline` — e é a que "Enviar boas-vindas" usa: precisava de algo mais
discreto que o primário sem ser invisível como o ghost.

**`field.tsx`** é o componente de acessibilidade do projeto. Ele amarra label ao
input via `htmlFor`, e a mensagem de erro ganha `role="alert"` (leitor de tela
anuncia assim que aparece) mais um `id` previsível — `${htmlFor}-error` — que os
formulários usam em `aria-describedby`. Erro nunca é só cor vermelha: tem ícone
de alerta junto, porque quem não distingue vermelho precisa de outro sinal.

### Story 2.4 — Formulário de cadastro

**`src/features/leads/components/lead-form.tsx`**. Mesmo desenho do login: RHF +
Zod, `isSubmitting` no botão, mensagem de status em faixa.

Duas escolhas concretas:

- `mode: 'onBlur'` — a validação dispara ao **sair** do campo, não a cada tecla.
  Validar enquanto se digita mostra "Email inválido" quando a pessoa digitou
  `m` e ainda está no meio da palavra. É agressivo. `onBlur` espera ela terminar.
- O componente chama `createLeadAction(values)` e lê o resultado. Não existe
  `fetch`, não existe cast, não existe `try/catch`:

```tsx
const result = await createLeadAction(values)

if (!result.ok) {
  setStatus({ tone: 'error', message: result.message })
  return
}

onCreated(result.lead)
```

Fluxo de sucesso: adiciona o lead à lista, `reset()` limpa o formulário,
mensagem verde "Lead cadastrado com sucesso." aparece com `role="status"`.

### Story 2.5 — Busca e filtro

Duas peças, e a separação entre elas é o ponto interessante.

**`src/features/leads/application/filter-leads.ts`** — **função pura**, sem
React, sem I/O. Recebe uma lista e filtros, devolve uma lista. Dá para testar em
um `node -e` sem subir nada.

Ela está em `application` e não em `data` porque é regra de domínio: o que conta
como "encontrar um lead" é decisão de produto, não de infraestrutura. E é o único
arquivo de `application` sem `server-only` — roda no navegador, junto do hook.

Dentro dela, a função `normalize` faz algo que o spec não pediu:

```ts
value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
```

Isso remove acentos. Efeito prático: buscar por `indicacao` encontra
"Indicação", e `jose` encontra "José". Para um painel em português isso não é
detalhe — é a diferença entre a busca funcionar e não funcionar na prática.

O `NFD` decompõe "ç" em "c" + cedilha, e o regex remove os diacríticos.

**`src/features/leads/components/search-bar.tsx`** — o componente. É *controlado*:
não tem estado próprio, recebe `filters` e `onChange`. Isso é o que permite as
duas visões (lista e cards) reusarem o mesmo componente sem duplicar lógica.

Os labels usam `sr-only` — visualmente escondidos, presentes para leitor de tela.
E os `id` vêm de `useId()`, então se o componente aparecesse duas vezes na mesma
página não haveria colisão de id.

Sobre **filtrar no client**: o spec justificou ("a lista é pequena"). Se a base
crescer, o ponto de troca é este arquivo mais um parâmetro no `getLeads()`. A
mudança fica localizada.

### Story 2.6 — Tabela

**`src/features/leads/components/lead-table.tsx`**. O requisito difícil do spec
estava aqui: *"mobile: tabela vira lista de linhas empilhadas (não usar scroll
horizontal)"*.

A solução foi renderizar **duas árvores** e alternar por CSS:

```
<table className="hidden … md:table">   ← desktop
<ul    className="md:hidden">           ← mobile
```

Isso custa duplicar o `map`. A alternativa — usar CSS para transformar
`display: table` em blocos — quebra a semântica da tabela e confunde leitor de
tela. Duas árvores é a escolha honesta: cada breakpoint recebe a marcação certa.

A tabela tem `scope="col"` em todo `<th>` — é o que faz o leitor de tela
anunciar "Origem: Instagram" ao navegar pelas células, em vez de só "Instagram".

Os textos de estado vazio **não estão no componente**: chegam por prop
(`emptyTitle`, `emptyDescription`). Isso é o que permite o pai distinguir
"Ainda sem leads" (base vazia) de "Nenhum lead encontrado" (o filtro escondeu
tudo) — duas situações que exigem orientações completamente diferentes.

### Story 2.7 — A página `/crm`

Aqui está a decisão arquitetural mais importante do bloco.

**`src/app/(app)/crm/page.tsx`** é Server Component. Ele:

1. chama `getLeads()` no servidor;
2. se deu certo, renderiza `<CrmView initialLeads={result.leads} />`;
3. se deu errado, renderiza `<ErrorState>` com a mensagem.

**`src/features/leads/application/get-leads.ts`** é o que torna o item 3
possível. Em vez de deixar a exceção subir (o que daria uma tela de erro 500 do
Next), ela captura e devolve um objeto discriminado:

```ts
type LeadsResult = { ok: true; leads: Lead[] } | { ok: false; message: string }
```

O comentário no arquivo resume: *"Falha de banco vira estado de tela, não erro
500 — o painel continua navegável"*. Com o Supabase fora do ar, o header, o
footer e a navegação continuam lá; só a lista vira uma caixa explicando o que
houve.

Esses tipos moram em `types/results.ts` por um motivo prático: eles atravessam a
fronteira servidor→client. Como são tipos puros, somem na compilação — o client
recebe o formato sem arrastar junto o módulo de servidor.

**`src/features/leads/components/crm-view.tsx`** é o Client Component que segura
o estado. Ele é fino de propósito: chama `useLeadList(initialLeads)` e distribui
o resultado para três filhos (`SearchBar`, `NewLeadButton` e `LeadTable`).

**`src/features/leads/hooks/use-lead-list.ts`** é onde o estado de fato vive, e o
comentário no topo explica a decisão central:

> Guarda a lista recebida do servidor e a mantém sincronizada após cadastro ou
> envio de boas-vindas, **sem refazer o fetch** — a lista é pequena e a mutação
> já devolve o lead atualizado.

Isso é o padrão do projeto: o servidor entrega a lista inicial; toda mutação
devolve o registro afetado; o client aplica localmente (`addLead`, `updateLead`).
Nunca há uma releitura depois de uma escrita. A tela responde na hora.

O hook fica em `hooks/` e não em `application/` porque está preso ao ciclo de
vida do React — a regra do projeto é que `application` não conhece componente.

O hook também expõe `isFiltered`, que é justamente o que o `CrmView` usa para
escolher a mensagem certa de estado vazio.

O layout usa `lg:grid-cols-3` com o formulário em 1 coluna e a lista em 2, mais
`lg:sticky lg:top-8` no cartão do formulário — ele acompanha a rolagem, então dá
para cadastrar vários leads seguidos sem subir a página.

---

## BLOCO 3 — Cards e email

### Story 3.1 e 3.2 — Cards

**`src/features/leads/components/lead-card.tsx`** — avatar circular com as
iniciais (`getInitials` de `lib/utils/format.ts`, que pega a primeira letra do
primeiro e do último nome), nome em serifada, email, badge de origem, data, e o
botão no rodapé.

Dois detalhes de construção: `h-full` + `flex-col` + `mt-auto` no rodapé fazem
todos os cards da linha terminarem na mesma altura com o botão alinhado, mesmo
com nomes de tamanhos diferentes. E `break-all` no email evita que um endereço
longo estoure o card.

**`src/features/leads/components/cards-view.tsx`** — grid de 1/2/3 colunas e a
animação de entrada:

```tsx
initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: EASE_OUT_SOFT, delay: Math.min(index, 8) * 0.05 }}
```

Fade + 12px de translação, 400ms, 50ms de stagger — exatamente o que o spec
especificou. Duas defesas contra excesso:

- `useReducedMotion()` zera a translação para quem pediu menos movimento;
- `Math.min(index, 8)` **trava o stagger no nono card**. Sem isso, com 60 leads
  o último esperaria 3 segundos para aparecer. Com o teto, ninguém espera mais
  que 400ms.

A lista é `<ul>/<li>` — semanticamente é uma lista de contatos, não uma pilha de
`div`s.

### Story 3.4 — Template do email

**`src/features/leads/data/welcome-email-template.ts`** exporta três coisas:
`welcomeSubject`, `welcomeText` e `welcomeHtml`.

Três, e não uma, porque um email decente manda **as duas versões** — HTML e texto
puro. Quem lê em cliente sem HTML, ou em filtro de spam, vê a versão texto. Mandar
só HTML aumenta a chance de cair em spam.

O HTML é escrito com `<table>` aninhada e `style=""` inline. Isso parece código
de 2005 e é intencional — o comentário no topo do arquivo explica: Outlook e
Gmail descartam `<style>` e boa parte do CSS moderno. Tabela com estilo inline é
o que funciona em todo lugar. É também por isso que os hex da paleta estão
repetidos como constantes ali: `var()` não é suportado em email.

E tem `escapeHtml()`. Um lead cadastrado como `<script>alert(1)</script>` teria o
nome injetado direto no HTML do email sem isso. É pequeno, e é a diferença entre
um template e um template seguro.

O arquivo mora em `data/` porque é detalhe de como o email sai — se trocarmos o
Resend por um provedor com templates próprios, ele sai junto.

### Story 3.5 — O caso de uso mais cuidadoso do projeto

**`src/features/leads/application/send-welcome.ts`** é o único lugar que faz duas
coisas que podem falhar **independentemente**: mandar o email e gravar no banco.

A sequência:

1. lead não existe → `{ ok: false, message: 'Lead não encontrado.' }`;
2. **já tem `welcome_sent_at`** → devolve o lead sem reenviar;
3. envia pelo mailer; se recusar → `{ ok: false }` com a mensagem real do Resend;
4. marca `welcome_sent_at` e devolve o lead.

O passo 2 é uma **proteção contra duplo envio** que o spec não pediu. Dois
cliques rápidos, ou duas abas abertas, não geram dois emails para o lead.

O passo 4 tem o tratamento mais interessante do arquivo:

```ts
} catch (error) {
  // O email já saiu; devolver sucesso com o lead marcado em memória evita que
  // o operador reenvie por achar que falhou.
  console.error('[leads] email enviado, mas falhou ao marcar', error)
  return { ok: true, lead: { ...lead, welcome_sent_at: new Date().toISOString() } }
}
```

Se o email saiu mas o `UPDATE` falhou, o caso de uso **não** devolve erro.
Devolver erro faria o operador clicar de novo e o lead receber dois emails.
Devolver sucesso significa que o banco fica temporariamente desatualizado — o que
se conserta com um refresh. Entre "email duplicado para o cliente" e "estado
desatualizado até recarregar", escolheu-se o segundo. Essa é a decisão certa, e
está documentada em comentário no lugar onde alguém vai lê-la.

O detalhe que faz essa regra valer a pena arquiteturalmente: ela orquestra
`leadRepository` e `welcomeMailer`, e **não conhece nenhum dos dois
concretamente** — só as portas. Trocar Supabase e Resend não muda uma linha aqui.

**`src/features/leads/data/resend-welcome-mailer.ts`** implementa `WelcomeMailer`
e devolve `{ ok: true } | { ok: false; message }`. Falha esperada de serviço
externo não vira exceção; vira valor de retorno.

### Story 3.6 — O botão

**`src/features/leads/components/send-welcome-button.tsx`**. Um componente, usado
nos dois lugares (tabela e card), com três estados possíveis:

- `welcome_sent_at` preenchido → não é botão, é um `<Badge tone="success">`
  com um check. Não dá para clicar porque não há o que fazer.
- enviando → botão desabilitado, texto "Enviando…".
- erro → mensagem vermelha com `role="alert"` logo abaixo do botão.

Nesse terceiro caso, a mensagem exibida é a **mensagem real do Resend**, não uma
genérica. E isso é deliberado, por causa da limitação abaixo.

### A limitação conhecida do Resend

Sem um domínio verificado, o Resend só envia **de** `onboarding@resend.dev` e
**para** o endereço cadastrado na conta. Tentar enviar boas-vindas para
`mariana.costa@exemplo.com` vai retornar erro da API.

O projeto não esconde isso: a mensagem da API sobe intacta até a tela. Assim, na
demonstração, dá para ver exatamente por que falhou em vez de um "erro ao enviar"
sem informação. Está registrado no README e no spec. Para uso real: verificar um
domínio da Olyra e trocar `RESEND_FROM`.

### O que entrou e depois saiu: o resumo por origem

Existiu aqui um `origin-summary.tsx` — a **melhoria opcional #1** do spec
("contador de leads por origem"). Foi removido depois: para saber a composição
da base já existe o filtro, e uma faixa fixa de contadores ocupava o topo da
tela o tempo todo para responder uma pergunta que quase nunca é feita. Relatório
é outra tela, não um enfeite permanente.

Com isso, **nenhuma das 5 melhorias opcionais do spec sobreviveu**. O que entrou
no lugar foram coisas que o spec não pediu e que pesam mais no uso diário:
cadastro em modal, validação na borda do banco e erros com código
diagnosticável.

---

## BLOCO 4 — Deploy e entrega

**`netlify.toml`** declara o build e o plugin `@netlify/plugin-nextjs`. Deixar no
repositório em vez de configurar no painel significa que a configuração é
versionada — quem clonar e conectar já sai com o build certo.

**`.env.example`** lista as 7 variáveis com comentários apontando onde obter cada
uma. É o contrato de setup: `cp .env.example .env.local` e preencher.

**`README.md`** cobre o que o spec exigiu — stack com justificativa, passo a
passo local, o SQL inline, decisões técnicas, estrutura de pastas e a limitação
do Resend.

Duas coisas do Bloco 4 **não são verificáveis pelo repositório**: se o deploy no
Netlify está de pé e se o email de entrega foi enviado. Nada no código responde
isso.

---

## Depois da primeira versão: as duas reorganizações

O projeto entrou inteiro em `d931720`. Depois disso vieram duas mudanças
estruturais que valem ser contadas, porque explicam por que os caminhos deste
documento não batem com o spec.

### 1. De pastas técnicas para features (`c819cce`)

A primeira versão seguia a árvore do spec: `components/leads/`, `lib/leads/`,
`hooks/`, `types/`. Funcionava, mas espalhava uma mesma feature por quatro
pastas — mexer em leads significava abrir quatro lugares.

Passou a ser dividido **por feature**, cada uma com quatro camadas:

```
features/leads/
  components/   UI da feature
  hooks/        estado preso ao React
  application/  casos de uso — a regra
  data/         Supabase, Resend — o mundo lá fora
  types/        contratos (portas) e tipos de domínio
```

O ponto não é a pasta, é a **direção da dependência**. `application` depende só
de `types`; `data` implementa `types`. Os dois apontam para o contrato, e nunca
um para o outro.

As portas, todas declaradas como `type`:

| Porta | Implementação hoje |
|---|---|
| `LeadRepository` | `data/supabase-lead-repository.ts` |
| `WelcomeMailer` | `data/resend-welcome-mailer.ts` |
| `SessionStore` | `auth/data/cookie-session-store.ts` |
| `CredentialsChecker` | `auth/data/env-credentials-checker.ts` |

E um arquivo por feature escolhe a implementação: `dependencies.server.ts` para
leads, `dependencies.ts` para auth. **Trocar Supabase por Postgres é escrever
`data/postgres-lead-repository.ts` e mudar uma linha nesse arquivo.** A
application, os componentes e as telas não percebem.

### 2. De rotas de API para Server Actions (`0320f25`)

A primeira versão tinha quatro route handlers e um "gateway HTTP" no client que
embrulhava `fetch`. O raciocínio para tirar tudo foi simples: **não existe
consumidor externo.** O único cliente do backend é o próprio front. Uma API REST
ali era serializar JSON, escolher status codes e manter uma camada de transporte
para falar consigo mesmo.

O que sumiu:

```
app/api/leads/route.ts
app/api/send-welcome/route.ts
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
features/leads/data/http-lead-gateway.ts
features/leads/types/lead-gateway.ts     ← a porta que só abstraía o fetch
features/leads/dependencies.ts           ← sem gateway, não sobrou o que compor
```

O que entrou: `features/leads/actions.ts` e `features/auth/actions.ts`.

Três ganhos concretos:

- **Tipagem de ponta a ponta.** O gateway fazia
  `(await response.json()) as { lead: Lead }` — um cast não verificado, o ponto
  mais fraco de tipagem do projeto. Sumiu.
- **Funciona sem JavaScript.** Server Action é o caminho de progressive
  enhancement do Next.
- **Menos código.** 216 linhas a menos, 130 a mais.

E o que **não** mudou: `application`, `data` e `types`. Só o adaptador de entrada
foi trocado — que era exatamente o que a arquitetura da mudança anterior prometia.

Uma coisa que foi deliberadamente **mantida**: a checagem de sessão e o
`safeParse` continuam nas actions. Server Action é endpoint público; tratá-la
como "função interna" e tirar a validação seria abrir um buraco. Está comentado
no `actions.ts` para quem for ler entender que é escolha, não sobra.

---

## O que existe no código e não estava no spec

Vale ter essa lista à mão, porque é onde a implementação tomou decisões próprias:

| Item | Por quê |
|---|---|
| `lib/env.ts` | falha de env com mensagem útil, sem quebrar o build |
| Portas em `types/` | contrato separado da implementação; troca de provedor sem atrito |
| `server-only` em 11 arquivos | erro de build em vez de vazamento de chave |
| Sessão por HMAC + `timingSafeEqual` | segredo não vai ao navegador; comparação em tempo constante |
| Cliente Supabase preguiçoso | build não precisa dos segredos |
| Seed idempotente | rodar de novo não duplica |
| Índice em `created_at desc` | é exatamente a ordenação da listagem |
| Busca sem acento (`NFD`) | `indicacao` encontra "Indicação" |
| Normalização (`trim`/`toLowerCase`) no schema | dados limpos nos dois lados |
| `escapeHtml` no template | nome de lead não injeta HTML no email |
| Proteção contra reenvio | dois cliques não mandam dois emails |
| Fallback quando o `UPDATE` falha | prefere estado velho a email duplicado |
| `loading.tsx` nas duas rotas | skeleton durante o carregamento no servidor |
| `select`, `empty-state`, `error-state`, `skeleton`, `control.ts` | 4 componentes e 1 base compartilhada além dos 5 do spec |
| Variante `outline` no botão | discrição para "Enviar boas-vindas" |
| `wordmark.tsx` + `icon.png` | logo oficial da Olyra, servida localmente, e favicon próprio |
| `page-heading.tsx` | título e descrição das páginas, um só lugar |
| `demo-credentials.tsx` | quem avalia entra sem depender de receber a senha |
| Bloco `prefers-reduced-motion` | acessibilidade de movimento |
| `noUncheckedIndexedAccess` | rigor de tipo além do `strict` |

E o que **não** foi feito das melhorias opcionais: ordenação da tabela, exclusão
de lead, toast, export CSV. O spec dizia "não sacrificar os blocos 1-4 por
nenhuma dessas" — e não sacrificou.

---

## Os cinco padrões que se repetem

Se você guardar só cinco coisas deste documento, que sejam estas — elas explicam
quase toda decisão do código:

**1. Servidor lê, client escreve.**
A página é Server Component e busca a lista. O client recebe como estado inicial
e só faz mutações. Não existe `useEffect` buscando dados em lugar nenhum.

**2. Mutação devolve o registro; o client aplica localmente.**
`createLeadAction` devolve o lead criado. `sendWelcomeAction` devolve o lead
atualizado. Ninguém relê a lista depois de escrever. A tela responde na hora.

**3. Erro esperado é valor de retorno; erro inesperado é exceção.**
`LeadsResult`, `LeadResult`, `SendResult` e `LoginResult` são uniões
discriminadas com `ok: true | false`. Banco fora do ar e Resend recusando não são
"excepcionais" — são cenários previstos, e viram estado de tela. Por isso os
componentes fazem `if`, não `try/catch`.

**4. Duas barreiras entre servidor e navegador.**
`import 'server-only'` em 11 arquivos torna erro de compilação importar servidor
no client. E toda entrada pública (as actions) recebe `unknown` e só confia no
que sai do Zod. Uma barreira protege o segredo; a outra protege o dado.

**5. Uma fonte de verdade por conceito.**
Cores → `@theme`. Origens → `ORIGINS`. Validação → `lead-schema.ts`. Estilo de
campo → `control.ts`. Filtro → `filter-leads.ts`. Persistência → `LeadRepository`.
Escolha de provedor → `dependencies*.ts`. Cada conceito tem exatamente um arquivo
onde mudá-lo.

---

## O que não existe (e é bom saber)

Para não procurar depois:

- **Nenhum teste.** Nem unitário, nem E2E. `filter-leads.ts` e `format.ts` são
  funções puras e seriam triviais de testar — é o ponto de entrada natural se
  você quiser começar. Com as portas declaradas, os casos de uso também ficaram
  fáceis de testar com um repositório falso.
- **Nenhum ADR.** As decisões estão em comentários no código, na seção
  "Decisões técnicas" do README e aqui — não em `docs/adr/`.
- **Documentação só em pt-BR.** README e spec não têm contraparte en-US.
- **Sem paginação.** `getAll()` traz tudo. Coerente com o escopo, mas é o
  primeiro limite que a base vai encontrar.
- **Sem editar nem excluir lead.** O CRUD é só C e R.
- **Sem rate limit no login.** Não há limite de tentativas de senha.
- **A sessão não expira do lado do servidor.** O valor do cookie é sempre o mesmo
  HMAC; as 8 horas vêm do `maxAge`, que quem respeita é o navegador. Um cookie
  copiado vale até o `SESSION_SECRET` mudar. A correção é assinar
  `usuario|expiração` e validar no servidor.
- **Sem email único em `leads`.** Dá para cadastrar o mesmo endereço duas vezes.
  Um `create unique index` mais o tratamento do erro `23505` resolvem.
- **`AGENTS.md` e `CLAUDE.md` foram apagados** e os SVGs padrão do Next também —
  limpeza do boilerplate.
