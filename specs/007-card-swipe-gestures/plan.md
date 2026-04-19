# Implementation Plan: Cards com Gestos de Swipe e Seção de Excluídos

**Branch**: `007-card-swipe-gestures` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)

## Summary

Reescrever `ListItem` como MUI `Card` sem checkbox; implementar gesto de swipe horizontal com detecção de eixo dominante (swipe esq = soft delete, swipe dir = toggle conclusão); drag vertical passa controle ao `List.tsx` para reordenação; itens excluídos aparecem em seção separada com fundo vermelho; itens concluídos têm fundo verde + CheckIcon; remover long-press trash zone e `useLongPress`.

## Technical Context

**Language/Version**: TypeScript 5.1 / React 18.2
**Primary Dependencies**: MUI v9 (`@mui/material`, `@mui/icons-material`) — já instalado
**Storage**: `localStorage` via `storageService` — adicionar `deleted`/`deletedAt` a `ListItem`; sem nova API
**Testing**: Verificação manual (per constitution)
**Target Platform**: Web app mobile, GitHub Pages
**Project Type**: SPA
**Performance Goals**: Gestos responsivos — sem jank durante swipe/arrasto; manipulação direta de DOM via refs durante gestos
**Constraints**: Sem dependências adicionais; 5 arquivos afetados (3 modificados, 1 reescrito, 1 removido)
**Scale/Scope**: Pequeno — mudança de interação + apresentação visual + modelo de dados mínimo

## Constitution Check

| Princípio | Status | Notas |
|-----------|--------|-------|
| Clean Code | PASS | Gestos isolados em `ListItem`; reordenação em `List`; lógica de estado em `App` |
| Small & Clear Scope | PASS | 5 arquivos, sem novas dependências |
| No Over-Engineering | PASS | Touch events nativos; detecção de eixo dominante simples |
| No Automated Tests | PASS | Verificação manual via `quickstart.md` |

## Project Structure

### Arquivos modificados

```text
src/
├── types/
│   └── index.ts                ← Adicionar deleted, deletedAt a ListItem
├── App.tsx                     ← handleDeleteItem (soft delete); handleReorderItems; handleAddItem; handleToggleItem
├── components/
│   ├── List.tsx                ← Remover trash zone; drag-to-reorder; seção "Excluídos"
│   └── ListItem.tsx            ← Reescrever: Card + swipe horizontal + handoff drag vertical
└── hooks/
    └── useLongPress.ts         ← REMOVER
```

## Design Decisions

### Card Layout por Estado

```
Item ativo, não concluído:
┌──────────────────────────────────────────────┐
│ Nome do produto                              │  ← fundo paper, sem ícone
└──────────────────────────────────────────────┘

Item ativo, concluído (swipe direita):
┌──────────────────────────────────────────────┐  ← fundo success.light (verde)
│ ~~Nome do produto~~                       ✓  │  ← CheckIcon à direita
└──────────────────────────────────────────────┘

Item excluído (seção "Excluídos"):
┌──────────────────────────────────────────────┐  ← fundo error.light (vermelho)
│ Nome do produto                              │  ← sem gestos, sem ícone
└──────────────────────────────────────────────┘
```

### Gesto de Swipe Horizontal em ListItem.tsx

**Estrutura do componente**:
```
<Box position="relative" overflow="hidden" borderRadius={2} mb={1}>
  <div ref={bgRef} />         ← camada de fundo (absoluta, transparente por padrão)
  <Card ref={cardRef}>
    <CardContent>
      <Typography>{item.title}</Typography>
      {item.completed && <CheckIcon />}
    </CardContent>
  </Card>
</Box>
```

**Fluxo do gesto**:
1. `onTouchStart`/`onMouseDown` no card: registra `startX`, `startY`; adiciona listeners no `document`
2. Primeiro `touchmove`/`mousemove` com deslocamento > 5px:
   - `|dx| > |dy|` → modo swipe horizontal
   - `|dy| >= |dx|` → modo arrasto vertical: remove listeners, chama `onDragStart(index, currentY)` e retorna
3. Modo swipe: `translateX(dx)` no card; atualiza `bgRef` (cor + display) sem re-render React
4. `touchend`/`mouseup`:
   - `|dx| > 40% card width` → ação (swipe esquerda: `onSwipeLeft(item.id)`, swipe direita: `onSwipeRight(item.id)`)
   - Caso contrário: snap-back via `transition: transform 0.2s ease`; bgRef oculto

**Props de ListItem (modo swipeable)**:
```typescript
interface ListItemProps {
    item: ListItem
    index: number
    onToggleItem: (itemId: string) => void   // swipe direita
    onDeleteItem: (itemId: string) => void   // swipe esquerda
    onDragStart: (index: number, clientY: number) => void  // arrasto vertical
    swipeable?: boolean  // false para itens na seção "Excluídos"
}
```

### Drag-to-Reorder Vertical em List.tsx

Quando `ListItem` detecta eixo vertical e chama `onDragStart(index, currentY)`:

1. `handleDragStart(index, clientY)`:
   - Captura `originalRects` de todos os cards ativos via `getBoundingClientRect()`
   - Registra listeners `touchmove`/`mousemove` e `touchend`/`mouseup` no `document`
   - Aplica estilos de "em arrasto" no card (opacity, zIndex)

2. `handleDragMove(clientY)`:
   - `deltaY = clientY - startY`
   - Aplica `translateY(deltaY)` no card arrastado via `itemRefs[dragIndex]`
   - Para cada outro card: compara centro atual do card arrastado com centros originais → `translateY(±cardHeight)` para ceder espaço
   - Atualiza `hoverIndex`

3. `handleDragEnd()`:
   - Remove listeners; limpa todos os transforms
   - Se `hoverIndex !== dragIndex` → chama `onReorderItems(dragIndex, hoverIndex)`

**Estado**: gerenciado via `useRef` (sem re-render durante o drag)

### Seção "Excluídos" em List.tsx

```tsx
const activeItems = list.items.filter(item => !(item.deleted ?? false))
const deletedItems = list.items.filter(item => item.deleted ?? false)

// Renderizar activeItems com swipe + drag-to-reorder
// Se deletedItems.length > 0:
//   <Typography variant="subtitle2">Excluídos</Typography>
//   {deletedItems.map(item => <ListItem swipeable={false} ... />)}
```

### handleDeleteItem em App.tsx (Soft Delete)

```typescript
// Em vez de filter, mapear e marcar como deleted
const handleDeleteItem = (itemId: string) => {
    const updatedItems = activeList.items.map(item =>
        item.id === itemId
            ? { ...item, deleted: true, deletedAt: new Date().toISOString() }
            : item
    )
    // activeItems mantêm posição; deletedItems vão para o final via handleReorderItems
    // Aqui apenas persiste a mudança de estado
}
```

### handleReorderItems em App.tsx

```typescript
const handleReorderItems = (fromIndex: number, toIndex: number) => {
    const active = activeList.items.filter(i => !(i.deleted ?? false))
    const deleted = activeList.items.filter(i => i.deleted ?? false)
    const [moved] = active.splice(fromIndex, 1)
    active.splice(toIndex, 0, moved)
    // items = [...active, ...deleted]
}
```

### handleToggleItem em App.tsx (ajuste para ignorar itens excluídos)

```typescript
// "todos concluídos" só considera itens NÃO excluídos:
const nonDeleted = updatedItems.filter(i => !(i.deleted ?? false))
const allCompleted = nonDeleted.length > 0 && nonDeleted.every(i => i.completed)
```

## Complexity Tracking

*Sem violações da Constitution.*
