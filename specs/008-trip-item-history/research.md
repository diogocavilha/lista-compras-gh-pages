# Research: Trip Item History

**Feature**: `008-trip-item-history`  
**Date**: 2026-04-19

---

## Decision 1: Como armazenar itens comprados em cada viagem

**Decision**: Adicionar `purchasedItems?: string[]` à interface `CompletedList` — um array opcional com os títulos dos itens comprados (concluídos) no momento do arquivamento.

**Rationale**: Mínima mudança no modelo de dados. Armazenar apenas títulos (strings) é suficiente para exibição em modo leitura — não há necessidade de persistir `id`, `completedAt`, ou outros campos do `ListItem`. O campo é opcional (`?`) para retrocompatibilidade: viagens antigas que não possuem esse campo exibirão uma mensagem amigável em vez de falhar.

**Alternatives considered**:
- Armazenar `ListItem[]` completos — desnecessário; exibição leitura precisa só do título. Aumentaria o tamanho dos dados no `localStorage` sem benefício real.
- Criar entidade separada `TripItems` no `localStorage` — over-engineering para o escopo atual.

---

## Decision 2: Como exibir a lista de compras em modo leitura

**Decision**: Usar um `Dialog` do MUI em `Dashboard.tsx` com um novo componente `TripDetailDialog` para exibir os itens da viagem selecionada.

**Rationale**: O usuário mencionou que "ao tocar em qualquer item listado no histórico, a lista de compras deve ser exibida em modo leitura." Um Dialog modal é a solução mais simples e apropriada para exibição de detalhes sem navegação — mantém o contexto da tela atual e não requer sistema de roteamento. A app é single-page sem React Router, então Dialog é a escolha natural.

**Alternatives considered**:
- Expandir o card de viagem inline (accordion) — requer mais estado e layout; Dialog é mais simples.
- Criar nova aba/tela para detalhes — over-engineering; quebra o fluxo simples do app.

---

## Decision 3: Cor de fundo dos itens excluídos

**Decision**: Mover o `bgcolor: 'error.light'` do `Box` wrapper em `List.tsx` para o próprio `Card` em `ListItem.tsx`, adicionando `item.deleted` na lógica de cor do card.

**Rationale**: O problema atual é que o `Card` em `ListItem.tsx` tem `bgcolor: 'background.paper'` mesmo quando o item está excluído, sobrepondo o fundo do `Box` wrapper. Aplicar a cor diretamente no `Card` resolve o problema e centraliza a lógica de cor visual de estado no componente `ListItem`.

**Alternatives considered**:
- Manter bgcolor no Box e remover do Card — exige que o Card seja transparente, o que quebra o visual de outros estados (completed/active).
- Usar uma cor mais intensa (`error.main`) — optamos por `error.light` para manter consistência com a paleta MUI e não ser excessivamente agressivo visualmente.

---

## Decision 4: Onde criar o componente TripDetailDialog

**Decision**: Criar `src/components/TripDetailDialog.tsx` como componente separado.

**Rationale**: A lógica de exibição do diálogo de detalhes de viagem é suficientemente distinta para justificar um arquivo próprio. Mantém `Dashboard.tsx` limpo e focado na exibição do painel.

**Alternatives considered**:
- Inline no Dashboard — tornaria o Dashboard complexo e difícil de manter.
