# Data Model: Cards com Gestos de Swipe e Seção de Excluídos

## Domain Entities

### `ListItem` (alterada)

```
id:          string        — UUID, identificador único
title:       string        — nome do produto (exibido no card)
completed:   boolean       — true se o item foi concluído (swipe direita)
completedAt: string | null — timestamp de conclusão ISO 8601 ou null
createdAt:   string        — timestamp de criação ISO 8601
deleted:     boolean       — true se o item foi excluído por swipe esquerda  ← NOVO
deletedAt:   string | null — timestamp de exclusão ISO 8601 ou null          ← NOVO
```

**Nota de compatibilidade retroativa**: Dados existentes sem `deleted`/`deletedAt` são tratados como `deleted: false` via `item.deleted ?? false`. Nenhuma migração necessária.

**Estados possíveis**:
- `deleted: false, completed: false` → Item ativo, não concluído (exibido na lista principal, fundo branco/paper)
- `deleted: false, completed: true`  → Item ativo, concluído (lista principal, fundo verde + CheckIcon)
- `deleted: true,  completed: *`     → Item excluído (seção "Excluídos", fundo vermelho, sem gestos)

### `ShoppingList` (sem alterações de interface)

```
createdAt: string      — timestamp de criação da lista
items:     ListItem[]  — array ordenado; primeiros itens = ativos (ordem do usuário); últimos = excluídos
status:    'active'
```

**Organização interna do array `items`**:
- Itens **ativos** (deleted: false) ficam no início, na ordem definida pelo usuário
- Itens **excluídos** (deleted: true) ficam no final, na ordem em que foram excluídos

### `CompletedList`, `StorageSchema`, `DashboardStats` — sem alterações

---

## UI State Entities

### `GestureState` (gerenciado em `ListItem.tsx` via ref)

```
startX:  number                          — posição X do toque inicial
startY:  number                          — posição Y do toque inicial
axis:    'horizontal' | 'vertical' | null — determinado na primeira movimentação > 5px
active:  boolean                         — true enquanto o gesto está em andamento
```

### `DragState` (gerenciado em `List.tsx` via ref — apenas para reordenação vertical)

```
dragIndex:    number | null — índice no array de itens ATIVOS do card sendo arrastado
hoverIndex:   number | null — índice de destino calculado durante o drag
startY:       number        — posição Y do toque no momento em que o eixo vertical foi detectado
originalRects: DOMRect[]   — posições originais de todos os cards ativos (capturadas no início)
```

---

## Mudanças em relação à feature anterior (006)

| Elemento removido | Razão |
|------------------|-------|
| `DragState.draggingItemId` (string) | Substituído por `dragIndex` (number) — mais eficiente para cálculos de posição |
| `DragState.isOverTrash` | Lixeira flutuante removida — exclusão agora por swipe esquerda |
| Long-press trash zone | Substituída por swipe esquerda |
| `useLongPress` hook | Removido — sem long-press nesta feature |
| Checkbox em `ListItem` | Removido — toggle via swipe direita |
| Delete button | Removido — exclusão via swipe esquerda |
| `.reverse()` no array de itens | Removido — ordem do array é canônica (definida pelo usuário) |

| Elemento adicionado | Descrição |
|--------------------|-----------|
| `ListItem.deleted` | Flag de soft delete |
| `ListItem.deletedAt` | Timestamp de exclusão |
| Seção "Excluídos" em `List.tsx` | Renderiza itens com `deleted: true` |
| Swipe horizontal em `ListItem.tsx` | Detecta eixo dominante; swipe esq = delete, swipe dir = toggle |
| Drag vertical em `List.tsx` | Recebe handoff do `ListItem` quando eixo vertical é detectado |
| `handleReorderItems` em `App.tsx` | Move itens ativos dentro do array preservando excluídos no final |
