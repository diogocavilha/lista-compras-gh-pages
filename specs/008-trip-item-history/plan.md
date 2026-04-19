# Implementation Plan: Trip Item History

**Branch**: `008-trip-item-history` | **Date**: 2026-04-19 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/008-trip-item-history/spec.md`

## Summary

Duas melhorias ao app de lista de compras: (1) ao tocar em uma viagem no painel de histórico, exibir os itens comprados naquela viagem em modo leitura via Dialog; (2) garantir que itens excluídos exibam cor de fundo vermelha claramente visível no card. A primeira requer adicionar `purchasedItems?: string[]` à entidade `CompletedList` e criar um componente `TripDetailDialog`. A segunda é um ajuste visual em `ListItem.tsx` (mover o bgcolor para o próprio Card).

## Technical Context

**Language/Version**: TypeScript 5.1 / React 18.2  
**Primary Dependencies**: MUI v9 (`@mui/material`, `@mui/icons-material`), Vite 5, Emotion  
**Storage**: `localStorage` via `storageService` — adicionar `purchasedItems` a `CompletedList`; sem nova API  
**Testing**: Verificação manual (per constitution — sem frameworks de teste automatizados)  
**Target Platform**: Web (mobile-first, GitHub Pages)  
**Project Type**: Single-page web application  
**Performance Goals**: Interações responsivas ao toque; sem metas específicas de latência  
**Constraints**: Sem dependências externas novas; manter retrocompatibilidade com dados existentes no `localStorage`  
**Scale/Scope**: Aplicativo single-user; dados locais; histórico típico de 5–50 viagens

## Constitution Check

| Princípio | Status | Notas |
|-----------|--------|-------|
| I. Clean Code | ✓ PASS | Componente separado `TripDetailDialog`; lógica de cor centralizada em `ListItem` |
| II. Small Scope | ✓ PASS | 2 user stories, 6 arquivos, nenhuma nova dependência |
| III. No Over-Engineering | ✓ PASS | Dialog em vez de rota nova; `string[]` em vez de objeto completo |
| IV. Manual Verification | ✓ PASS | Checklist manual em `quickstart.md`; sem frameworks de teste |

**Gate result**: PASS — implementação pode prosseguir.

## Project Structure

### Documentation (this feature)

```text
specs/008-trip-item-history/
├── plan.md              ← este arquivo
├── research.md          ← decisões técnicas
├── data-model.md        ← modelo de dados
├── quickstart.md        ← comandos e checklist de verificação
└── tasks.md             ← gerado por /speckit.tasks
```

### Source Code (arquivos afetados)

```text
src/
├── types/
│   └── index.ts                    # +purchasedItems?: string[] em CompletedList
├── components/
│   ├── Dashboard.tsx               # +selectedTrip state, cards clicáveis, TripDetailDialog
│   ├── TripDetailDialog.tsx        # NOVO: Dialog read-only com itens da viagem
│   ├── ListItem.tsx                # Incluir item.deleted na lógica de bgcolor do Card
│   └── List.tsx                    # Remover bgcolor: 'error.light' do Box wrapper
└── App.tsx                         # archiveCompletedList salva purchasedItems
```

**Structure Decision**: Single project React SPA. Sem novos diretórios — apenas um componente novo em `src/components/`.

## Design Decisions

### TripDetailDialog — estrutura JSX

```tsx
<Dialog open={!!trip} onClose={onClose} maxWidth="xs" fullWidth>
  <DialogTitle>
    {formatListDate(trip.createdAt)}
    <Typography variant="caption" color="text.secondary">
      Duração: {formatDuration(trip.durationMs)}
    </Typography>
  </DialogTitle>
  <DialogContent>
    {trip.purchasedItems && trip.purchasedItems.length > 0 ? (
      <List dense>
        {trip.purchasedItems.map((title, i) => (
          <ListItem key={i}>
            <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography color="text.secondary" variant="body2">
        Detalhes não disponíveis para esta viagem.
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={onClose}>Fechar</Button>
  </DialogActions>
</Dialog>
```

> **Nota**: Usar `List`/`ListItem`/`ListItemText` do MUI (primitivos de lista) — diferentes do componente customizado `List.tsx` do app.

### ListItem.tsx — lógica de cor

```tsx
// Antes (007):
bgcolor: item.completed ? 'success.light' : 'background.paper'

// Depois (008):
bgcolor: item.deleted 
    ? 'error.light' 
    : item.completed 
        ? 'success.light' 
        : 'background.paper'
```

### archiveCompletedList — salvar itens

```typescript
const purchasedItems = list.items
    .filter(item => item.completed && !(item.deleted ?? false))
    .map(item => item.title)

const completedList: CompletedList = {
    // ...campos existentes...
    purchasedItems,
}
```
