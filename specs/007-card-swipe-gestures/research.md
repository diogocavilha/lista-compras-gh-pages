# Research: Cards com Gestos de Swipe e Seção de Excluídos

## Gestos de Swipe Horizontal (Excluir / Concluir)

### Decisão: Touch events nativos no `ListItem.tsx`

- **Rationale**: Sem dependências adicionais (honra a constitution). O gesto de swipe é simples — detector de eixo dominante + threshold de 40% da largura. `onTouchStart`/`onTouchMove`/`onTouchEnd` via listeners no `document` (para captura fora dos limites do card).
- **Visual durante o swipe**: Camada de fundo colorida revelada abaixo do card que se desloca. Manipulação direta de DOM via `ref` (sem re-render React) para manter o gesto fluido.
  - Swipe esquerda → fundo vermelho revelado (`error.light`)
  - Swipe direita → fundo verde revelado (`success.light`)
- **Alternativas consideradas**: `react-spring` / `framer-motion` para animações (rejeitadas — adicionam 40–80 kB desnecessários); HTML5 Drag & Drop API (rejeitada — não suporta touch nativamente).

---

## Disambiguação de Gestos (Swipe Horizontal vs. Arrasto Vertical)

### Decisão: Detecção de eixo dominante nos primeiros 5 px de movimento

- **Rationale**: `|dx| > |dy|` → swipe horizontal; `|dy| >= |dx|` → arrasto vertical de reordenação. O `ListItem` registra listeners no `document` ao iniciar o toque e determina o eixo na primeira movimentação que excede o threshold.
- **Handoff para reordenação**: Quando o eixo vertical é detectado, `ListItem` remove seus próprios listeners e chama `onDragStart(index, currentY)`. O `List.tsx` então assume o controle adicionando seus próprios listeners para o arrasto de reordenação.
- **Alternativas consideradas**: Drag handle separado para reordenação (mais simples mas adiciona elemento visual extra; a detecção de eixo é preferível para manter o card limpo).

---

## Feedback Visual durante o Swipe

### Decisão: Camada de fundo atrás do card + manipulação direta de DOM

- **Rationale**: A camada de fundo (div absoluto abaixo do card) é manipulada diretamente via `ref` (sem `setState`) para evitar re-renders React durante o gesto, que causariam jank. A cor e visibilidade são atualizadas via `style.backgroundColor` e `style.display`.
- **Estrutura HTML**:
  ```
  <Box position="relative" overflow="hidden">
    <div ref={bgRef} />   ← fundo colorido (absolute, preenche o container)
    <Card ref={cardRef} />  ← card que desliza sobre o fundo
  </Box>
  ```
- **Snap-back**: Quando o swipe não atinge o threshold, o card retorna via `transition: transform 0.2s ease` e o fundo some.

---

## Modelo de Dados: Itens Excluídos

### Decisão: Adicionar campos `deleted: boolean` e `deletedAt: string | null` a `ListItem`

- **Rationale**: Itens excluídos precisam ser persistidos (aparecem na seção "Excluídos"). Adicionar dois campos à entidade existente é a mudança mínima — não requer nova collection no storage. Compatibilidade retroativa garantida: dados antigos não terão `deleted`, tratado como `false` via `item.deleted ?? false`.
- **Organização no array `items`**: Itens ativos ficam no início do array (preservando a ordem do usuário); itens excluídos são movidos para o final quando deletados. Isso simplifica a reordenação (opera apenas nos índices 0..activeCount-1).
- **Alternativas consideradas**: Array separado `deletedItems: ListItem[]` em `ShoppingList` (mais limpo conceitualmente, mas requer mais mudanças no schema e no `storageService`; rejeitado por complexidade desnecessária).

---

## Layout do Card

### Decisão: Card simples sem checkbox — gesto de swipe direita como toggle de conclusão

- **Rationale**: O checkbox é removido conforme solicitado. O toggle de conclusão passa a ser exclusivamente via swipe direita. O card exibe apenas o nome do produto. Itens concluídos exibem ícone `CheckIcon` alinhado à direita e fundo verde. Itens excluídos (na seção inferior) exibem fundo vermelho sem gestos.
- **Drag handle**: O eixo dominante do gesto inicial determina se é swipe ou arrasto; não é necessário um ícone de drag handle separado. Isso mantém o card limpo com apenas o nome (e checkmark quando concluído).

---

## handleDeleteItem em App.tsx

### Decisão: Marcar item como `deleted: true` (soft delete) em vez de remover do array

- **Rationale**: Itens precisam aparecer na seção "Excluídos". Soft delete preserva os dados sem precisar de um novo array separado. O item permanece em `activeList.items`, apenas com `deleted: true`.
- **Impacto em `archiveCompletedList`**: A verificação de "todos concluídos" deve ignorar itens excluídos: `activeList.items.filter(i => !i.deleted).every(i => i.completed)`.

---

## handleReorderItems em App.tsx

### Decisão: Separar ativos e excluídos, reordenar apenas os ativos, recompor o array

- **Algoritmo**:
  1. `activeItems = items.filter(i => !i.deleted)`
  2. `deletedItems = items.filter(i => i.deleted)`
  3. Aplicar `splice` nos `activeItems` com fromIndex/toIndex
  4. `items = [...activeItems, ...deletedItems]`
- **Rationale**: Mantém excluídos sempre no final sem perturbar a ordem dos itens ativos. `fromIndex`/`toIndex` são índices dentro do array de ativos (não do array completo), o que simplifica o cálculo em `List.tsx`.

---

## Seção "Excluídos" em List.tsx

### Decisão: Renderizar duas seções separadas dentro do mesmo componente `List`

- **Rationale**: Evita criar um novo componente para a seção de excluídos — a lógica de exibição é simples. A seção de excluídos usa o mesmo `ListItem` mas sem gestos (`swipeable={false}`).
- **Comportamento**: A seção "Excluídos" aparece automaticamente quando `deletedItems.length > 0`. Cada card excluído tem fundo vermelho fixo. Nenhum swipe ou reordenação é disponível nesses cards.

---

## Arquivos Afetados

| Arquivo | Tipo de mudança |
|---------|----------------|
| `src/types/index.ts` | Adicionar `deleted`, `deletedAt` a `ListItem` |
| `src/App.tsx` | Alterar `handleDeleteItem` (soft delete); adicionar `handleReorderItems`; atualizar `handleAddItem` e `handleToggleItem` |
| `src/components/List.tsx` | Remover trash zone antiga; adicionar drag-to-reorder; renderizar seção "Excluídos" |
| `src/components/ListItem.tsx` | Reescrever como Card com swipe horizontal + arrasto vertical; remover checkbox; adicionar visual de excluído/concluído |
| `src/hooks/useLongPress.ts` | REMOVER |
