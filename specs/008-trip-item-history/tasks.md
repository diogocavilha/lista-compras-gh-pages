# Tasks: Trip Item History

**Input**: Design documents from `/specs/008-trip-item-history/`
**Prerequisites**: plan.md ✓ | spec.md ✓ | research.md ✓ | data-model.md ✓ | quickstart.md ✓

**Tests**: Verificação manual (per constitution — sem frameworks de teste automatizados)

**Organization**: Tasks organizadas por user story para permitir implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependências de tasks incompletas)
- **[Story]**: User story à qual a task pertence (US1, US2)

---

## Phase 1: Foundational (Pré-requisito bloqueante para US1)

**Purpose**: Alteração no modelo de dados que a US1 precisa. US2 pode iniciar em paralelo a esta fase pois não depende dela.

**⚠️ CRÍTICO**: A US1 não pode ser iniciada até esta fase estar completa.

- [x] T001 Adicionar `purchasedItems?: string[]` à interface `CompletedList` em `src/types/index.ts` — campo opcional para retrocompatibilidade; viagens sem o campo exibem mensagem amigável

**Checkpoint**: Modelo de dados atualizado — US1 pode começar.

---

## Phase 2: User Story 1 — Ver Itens Comprados por Viagem (Priority: P1) 🎯 MVP

**Goal**: Ao tocar em qualquer viagem no painel de histórico, exibir a lista de compras daquela viagem em modo leitura (dialog).

**Independent Test**: Concluir uma lista com 3 itens nomeados (ex: Leite, Pão, Ovos), acessar a aba "Painel", tocar no card da viagem e verificar que os 3 nomes aparecem no dialog.

- [x] T002 [P] [US1] Atualizar `archiveCompletedList` em `src/App.tsx` — adicionar `purchasedItems` ao objeto `CompletedList`: `list.items.filter(item => item.completed && !(item.deleted ?? false)).map(item => item.title)`
- [x] T003 [P] [US1] Criar `src/components/TripDetailDialog.tsx` — Dialog MUI com props `{ trip: CompletedList | null, onClose: () => void }`; exibir data da viagem (`formatListDate(trip.createdAt)`) e duração como título; listar `trip.purchasedItems` com `CheckIcon` e `ListItemText` do MUI (importar `List`, `ListItem`, `ListItemIcon`, `ListItemText` de `@mui/material` — não o componente customizado do app); se `!trip.purchasedItems || trip.purchasedItems.length === 0`, exibir `<Typography color="text.secondary">Detalhes não disponíveis para esta viagem.</Typography>`; incluir botão "Fechar" em `DialogActions`
- [x] T004 [US1] Atualizar `src/components/Dashboard.tsx` — adicionar `useState<CompletedList | null>(null)` para `selectedTrip`; adicionar `onClick={() => setSelectedTrip(trip)}` e `sx={{ cursor: 'pointer' }}` nos cards de viagem da seção "Viagens recentes"; importar e renderizar `<TripDetailDialog trip={selectedTrip} onClose={() => setSelectedTrip(null)} />` ao final do JSX; importar `CompletedList` de `../types/index` (já importado) e `{ useState }` de `react`

**Checkpoint**: Tocar em uma viagem abre o dialog com itens; botão "Fechar" dispensa; viagens antigas exibem mensagem amigável.

---

## Phase 3: User Story 2 — Fundo Vermelho para Itens Excluídos (Priority: P2)

**Goal**: Cards na seção "Excluídos" da lista ativa exibem fundo vermelho diretamente no card, de forma visivelmente clara.

**Independent Test**: Excluir um item (deslizar para a esquerda na lista ativa), verificar que o card na seção "Excluídos" tem fundo visivelmente vermelho (`error.light`); recarregar o app e confirmar que a cor persiste.

- [x] T005 [P] [US2] Atualizar lógica de `bgcolor` do `Card` em `src/components/ListItem.tsx` — substituir `bgcolor: item.completed ? 'success.light' : 'background.paper'` por `bgcolor: item.deleted ? 'error.light' : item.completed ? 'success.light' : 'background.paper'`
- [x] T006 [P] [US2] Remover `bgcolor: 'error.light'` do `Box` wrapper dos itens excluídos em `src/components/List.tsx` — o Box mantém apenas `borderRadius: 2` e `mb: 1`; a cor é agora responsabilidade do Card em `ListItem.tsx`

**Checkpoint**: Itens excluídos têm fundo vermelho no Card; itens ativos e concluídos mantêm suas cores corretas.

---

## Phase 4: Polish & Verificação

**Purpose**: Verificação de tipos, build e validação visual completa.

- [x] T007 Executar `npm run type-check` e corrigir todos os erros TypeScript — verificar especialmente `purchasedItems` em `CompletedList`, props de `TripDetailDialog`, e importações do MUI List primitivo vs componente customizado `List.tsx`
- [x] T008 Executar `npm run build` e verificar que o bundle compila sem erros ou warnings relevantes
- [ ] T009 Verificação manual completa contra o checklist em `specs/008-trip-item-history/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: Sem dependências — começar imediatamente; US2 pode iniciar em paralelo
- **US1 (Phase 2)**: Depende da Phase 1 (T001); T002 e T003 podem rodar em paralelo (arquivos diferentes); T004 depende de T003 (importa TripDetailDialog)
- **US2 (Phase 3)**: Independente da Phase 1 e US1; T005 e T006 podem rodar em paralelo (arquivos diferentes)
- **Polish (Phase 4)**: Depende de todas as fases anteriores

### Within Each User Story

- US1: T002 e T003 em paralelo → T004 sequencial
- US2: T005 e T006 em paralelo → checkpoint

### Parallel Opportunities

- T001 (types) e T005+T006 (US2) podem rodar em paralelo (arquivos diferentes)
- T002 e T003 podem rodar em paralelo (App.tsx vs TripDetailDialog.tsx)
- T005 e T006 podem rodar em paralelo (ListItem.tsx vs List.tsx)
- T007 e T008 podem rodar em paralelo após todas as implementações

---

## Parallel Example: Phase 2 (US1)

```
# Rodar em paralelo após T001:
Task T002: Atualizar archiveCompletedList em src/App.tsx
Task T003: Criar src/components/TripDetailDialog.tsx

# Depois (T004 depende de T003):
Task T004: Atualizar src/components/Dashboard.tsx
```

## Parallel Example: Phase 3 (US2)

```
# Podem rodar em paralelo (e até em paralelo com Phase 1):
Task T005: Atualizar bgcolor em src/components/ListItem.tsx
Task T006: Remover bgcolor do Box em src/components/List.tsx
```

---

## Implementation Strategy

### MVP (US1 é P1 — entregar primeiro)

1. Phase 1: Atualizar modelo de dados (T001)
2. Phase 2: Dialog de detalhe de viagem (T002, T003 em paralelo → T004)
3. Phase 3: Fundo vermelho para itens excluídos (T005, T006 em paralelo)
4. Phase 4: Verificação (T007, T008, T009)

---

## Notes

- `[P]` = arquivos diferentes, sem dependências entre si dentro da fase
- **Atenção ao import em T003**: MUI tem `List`, `ListItem`, `ListItemIcon`, `ListItemText` como componentes primitivos em `@mui/material` — diferentes do componente customizado `src/components/List.tsx` do app. Usar os primitivos do MUI no TripDetailDialog.
- US2 (T005 + T006) pode ser iniciada em paralelo com Phase 1 — não há dependências entre elas
- Executar `npm run type-check` após cada fase para detectar erros cedo
