# Data Model: Trip Item History

**Feature**: `008-trip-item-history`  
**Date**: 2026-04-19

---

## Entidades Modificadas

### CompletedList (modificada)

Representa uma viagem de compras finalizada. Campo `purchasedItems` adicionado.

```typescript
interface CompletedList {
    id: string;               // UUID v4 — sem alteração
    createdAt: string;        // ISO 8601 — sem alteração
    completedAt: string;      // ISO 8601 — sem alteração
    durationMs: number;       // Duração em ms — sem alteração
    itemCount: number;        // Total de itens — sem alteração
    purchasedItems?: string[]; // NOVO: títulos dos itens concluídos no momento do arquivamento
}
```

**Campo `purchasedItems`**:
- Tipo: `string[] | undefined`
- Opcional (`?`) para retrocompatibilidade com viagens antigas
- Contém apenas os títulos (nomes) dos itens que estavam **concluídos** no momento do arquivamento
- Itens excluídos (`deleted: true`) antes do término da viagem **não** são incluídos
- Imutável após criação — não deve ser alterado após o arquivamento

---

## Entidades Não Modificadas

### ListItem — sem alteração

Os campos `deleted` e `deletedAt` adicionados na feature 007 permanecem inalterados. A cor de fundo vermelha dos itens excluídos é uma mudança visual pura, sem impacto no modelo de dados.

### ShoppingList — sem alteração

### StorageSchema — sem alteração

---

## Fluxo de Persistência

### Ao arquivar uma lista concluída (App.tsx → archiveCompletedList):

```
ShoppingList.items
  → filter: item.completed === true AND !(item.deleted ?? false)
  → map: item.title
  → CompletedList.purchasedItems
```

### Retrocompatibilidade:

```
CompletedList sem purchasedItems
  → exibir: "Detalhes não disponíveis para esta viagem"
```

---

## Estado de UI (sem persistência)

### TripDetailDialog

Controlado por estado local em `Dashboard.tsx`:

```typescript
const [selectedTrip, setSelectedTrip] = useState<CompletedList | null>(null)
```

- `null` → Dialog fechado
- `CompletedList` → Dialog aberto, exibindo os itens da viagem selecionada
- Abertura: toque em qualquer card de viagem na seção "Viagens recentes"
- Fechamento: toque fora do dialog ou no botão de fechar
