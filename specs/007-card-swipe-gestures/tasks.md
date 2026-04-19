# Tasks: Cards com Gestos de Swipe e Seção de Excluídos

**Input**: Design documents from `/specs/007-card-swipe-gestures/`
**Prerequisites**: plan.md ✓ | spec.md ✓ | research.md ✓ | data-model.md ✓ | quickstart.md ✓

**Tests**: Verificação manual (per constitution — sem frameworks de teste automatizados)

**Organization**: Tasks organizadas por user story para permitir implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependências de tasks incompletas)
- **[Story]**: User story à qual a task pertence (US1, US2, US3)

---

## Phase 1: Setup (Limpeza de código obsoleto)

**Purpose**: Remover o hook `useLongPress` (e sua importação em `ListItem.tsx`) antes de qualquer implementação. Deve ser concluída antes de qualquer outra fase.

- [x] T001 Remover arquivo `src/hooks/useLongPress.ts` (não utilizado após esta feature; sua importação atual em `ListItem.tsx` será eliminada na reescrita do componente)

---

## Phase 2: Foundational (Pré-requisitos bloqueantes)

**Purpose**: Alterações de modelo de dados e ajustes em `App.tsx` que TODAS as user stories precisam. Deve estar completa antes de qualquer user story.

**⚠️ CRÍTICO**: Nenhuma user story pode ser iniciada até esta fase estar completa.

- [x] T002 Adicionar `deleted: boolean` e `deletedAt: string | null` à interface `ListItem` em `src/types/index.ts`; compatibilidade retroativa será tratada no código via `item.deleted ?? false`
- [x] T003 Atualizar `handleAddItem` em `src/App.tsx`: incluir `deleted: false, deletedAt: null` no objeto `newItem` para que novos itens não tenham estado de exclusão indefinido
- [x] T004 Atualizar `handleToggleItem` em `src/App.tsx`: substituir `updatedItems.every(item => item.completed)` por `updatedItems.filter(i => !(i.deleted ?? false)).every(i => i.completed)` — itens excluídos não devem bloquear o arquivamento da lista

**Checkpoint**: Modelo de dados atualizado, App.tsx ajustado — user stories podem começar.

---

## Phase 3: User Story 1 — Reordenar Itens por Arrasto Vertical (Priority: P1) 🎯 MVP

**Goal**: O usuário arrasta qualquer card verticalmente para reorganizar a lista; a nova ordem é persistida.

**Independent Test**: Abrir lista com 3+ itens, arrastar o 1º card para baixo, verificar que a ordem muda e persiste após recarregar o app.

- [x] T005 [P] [US1] Adicionar `handleReorderItems(fromIndex: number, toIndex: number)` em `src/App.tsx` — `activeItems = items.filter(i => !(i.deleted ?? false))`, `deletedItems = items.filter(i => i.deleted ?? false)`, aplicar splice nos activeItems, recompor `[...activeItems, ...deletedItems]`, atualizar estado e persistir via `storageService.setActiveList()`; adicionar prop `onReorderItems={handleReorderItems}` ao `<List>` na JSX
- [x] T006 [P] [US1] Reescrever `src/components/ListItem.tsx` como MUI Card base — remover Checkbox, importação de useLongPress, e todas as props antigas; nova interface: `{ item: ListItem, index: number, onToggleItem: (id: string) => void, onDeleteItem: (id: string) => void, onDragStart: (index: number, clientY: number) => void, swipeable?: boolean }`; estrutura JSX: `<Box position="relative" overflow="hidden" mb={1} borderRadius={2}><div ref={bgRef} style={{display:'none'}} /><Card ref={cardRef}><CardContent><Stack direction="row" alignItems="center"><Typography flex={1}>{item.title}</Typography></Stack></CardContent></Card></Box>`; implementar `gestureRef = useRef({startX, startY, axis: null, active: false})`; registrar listeners no `document` no `onTouchStart`/`onMouseDown`; na primeira movimentação > 5 px: se `|dy| >= |dx|` → modo vertical: remover listeners e chamar `onDragStart(index, currentY)` e retornar (swipe horizontal será implementado em T009 e T012)
- [x] T007 [P] [US1] Reescrever `src/components/List.tsx` — remover imports de `DeleteIcon`, `MuiList`, `MuiListItem`, estado `DragState` antigo e handlers de trash zone; adicionar `onReorderItems: (from: number, to: number) => void` à interface `ListProps`; adicionar `itemRefs = useRef<(HTMLDivElement | null)[]>([])` e `dragRef = useRef<{dragIndex: number|null, hoverIndex: number|null, startY: number, originalRects: DOMRect[]}>({dragIndex: null, hoverIndex: null, startY: 0, originalRects: []})`; implementar `handleDragStart(index, clientY)`: captura `originalRects` de todos os cards ativos via `getBoundingClientRect()`, registra listeners no `document` para `touchmove`/`mousemove` (aplica `translateY(deltaY)` no card arrastado via ref, itera outros cards via originalRects para calcular `hoverIndex` e aplicar `translateY(±cardHeight)` para ceder espaço) e `touchend`/`mouseup` (limpa transforms, chama `onReorderItems(dragIndex, hoverIndex)` se diferente, reseta dragRef); renderizar `activeItems = list.items.filter(i => !(i.deleted ?? false))` em `<Box>` com `ref={(el: HTMLDivElement | null) => { itemRefs.current[index] = el }}`, passando `onDragStart={handleDragStart}`; renderizar seção "Excluídos" como placeholder vazio (seção completa em T010)

**Checkpoint**: Arrasto vertical funcional — cards seguem o toque, outros cedem espaço, nova ordem persiste ao recarregar.

---

## Phase 4: User Story 2 — Excluir Item por Swipe para a Esquerda (Priority: P1)

**Goal**: Deslizar card para a esquerda além de 40% da largura remove o item da lista principal, que passa a aparecer na seção "Excluídos" abaixo com fundo vermelho.

**Independent Test**: Com 2+ itens, deslizar um card para a esquerda; verificar que ele desaparece da lista principal, fundo vermelho é revelado durante o gesto, e o item aparece na seção "Excluídos".

- [x] T008 [P] [US2] Alterar `handleDeleteItem` em `src/App.tsx` de `filter(item => item.id !== itemId)` para `map(item => item.id === itemId ? { ...item, deleted: true, deletedAt: new Date().toISOString() } : item)` — os itens excluídos ficam no array mas com `deleted: true`
- [x] T009 [P] [US2] Adicionar swipe horizontal esquerdo a `src/components/ListItem.tsx` — no handler de movimento (quando `gestureRef.current.axis === 'horizontal'` e `swipeable !== false`): aplicar `cardRef.current.style.transform = translateX(${dx}px)`, atualizar `bgRef.current.style` com `display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px', backgroundColor: error.light` (usar cor hex `#ffcdd2` para compatibilidade com style inline), `position: 'absolute', inset: 0`; no handler de release: se `dx < -(cardWidth * 0.4)` → chamar `onDeleteItem(item.id)`; caso contrário → snap-back com `cardRef.current.style.transition = 'transform 0.2s ease'` e ocultar `bgRef.current.style.display = 'none'`; prevenir scroll (`e.preventDefault()`) durante swipe horizontal
- [x] T010 [P] [US2] Completar seção "Excluídos" em `src/components/List.tsx` — calcular `deletedItems = list.items.filter(i => i.deleted ?? false)`; renderizar abaixo dos activeItems: `{deletedItems.length > 0 && (<Box sx={{ mt: 3 }}><Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Excluídos</Typography>{deletedItems.map(item => (<Box key={item.id} sx={{ bgcolor: 'error.light', borderRadius: 2, mb: 1 }}><ListItem item={item} index={-1} swipeable={false} onToggleItem={onToggleItem} onDeleteItem={onDeleteItem} onDragStart={() => {}} /></Box>))}</Box>)}`; NÃO usar `itemRefs` nos cards excluídos (não participam de reordenação)

**Checkpoint**: Swipe esquerda funcional — fundo vermelho revelado durante gesto, item migra para seção "Excluídos" com fundo vermelho, persiste ao recarregar.

---

## Phase 5: User Story 3 — Concluir Item por Swipe para a Direita (Priority: P2)

**Goal**: Deslizar card para a direita além de 40% marca o item como concluído (toggle) — card fica com fundo verde e ícone de check à direita.

**Independent Test**: Com 1+ itens, deslizar card para a direita; verificar fundo verde revelado durante gesto, card fica verde com CheckIcon e nome riscado; deslizar novamente desmarca.

- [x] T011 [US3] Adicionar swipe direita e visual de conclusão a `src/components/ListItem.tsx` — no handler de movimento: quando swipeable e dx > 0, atualizar `bgRef` com `backgroundColor: '#c8e6c9'` (success.light) e ícone visual (pode ser feito via innerHTML ou ícone inline simples); no handler de release: se `dx > cardWidth * 0.4` → chamar `onToggleItem(item.id)`; adicionar visual de item concluído ao Card: aplicar `sx={{ bgcolor: item.completed ? 'success.light' : 'background.paper' }}` no Card (wrapper externo do MUI Card); adicionar `{item.completed && <CheckIcon sx={{ color: 'success.dark', flexShrink: 0 }} />}` no Stack, alinhado à direita (Stack já usa `direction="row" alignItems="center"`); aplicar `textDecoration: item.completed ? 'line-through' : 'none'` na Typography do nome

**Checkpoint**: Swipe direita funcional — fundo verde revelado, card fica com fundo verde, CheckIcon visível, nome riscado; toggle funciona.

---

## Phase 6: Polish & Concerns transversais

**Purpose**: Verificação de tipos, build e validação visual completa.

- [x] T012 Executar `npm run type-check` e corrigir todos os erros TypeScript — verificar especialmente props removidas/adicionadas em `ListItem`, `List` e `App`; verificar que `deleted` e `deletedAt` estão tipados corretamente
- [x] T013 Executar `npm run build` e verificar que o bundle compila sem erros ou warnings relevantes
- [x] T014 Verificação manual completa contra o checklist em `specs/007-card-swipe-gestures/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — começar imediatamente
- **Foundational (Phase 2)**: Depende da conclusão da Phase 1 — BLOQUEIA as user stories
- **US1 (Phase 3)**: Depende da Phase 2; T005, T006 e T007 podem rodar em paralelo (arquivos diferentes)
- **US2 (Phase 4)**: Depende de T006 (ListItem base) e T007 (List base); T008, T009 e T010 podem rodar em paralelo entre si
- **US3 (Phase 5)**: Depende de T009 (ListItem com swipe left — mesmo arquivo); T011 é sequencial após T009
- **Polish (Phase 6)**: Depende de todas as fases anteriores

### Within Each User Story

- US1: T005, T006, T007 em paralelo → checkpoint
- US2: T008, T009, T010 em paralelo → checkpoint
- US3: T011 sequencial após T009 → checkpoint

### Parallel Opportunities

- T005, T006, T007 podem rodar em paralelo (App.tsx vs ListItem.tsx vs List.tsx)
- T008, T009, T010 podem rodar em paralelo (App.tsx vs ListItem.tsx vs List.tsx)
- T012, T013 podem rodar em paralelo

---

## Parallel Example: Phase 3 (US1)

```
# Rodar em paralelo após Phase 2:
Task T005: Adicionar handleReorderItems em src/App.tsx
Task T006: Reescrever src/components/ListItem.tsx como Card base
Task T007: Reescrever src/components/List.tsx com drag-to-reorder
```

## Parallel Example: Phase 4 (US2)

```
# Rodar em paralelo após T006 e T007:
Task T008: Soft delete em src/App.tsx
Task T009: Swipe esquerda em src/components/ListItem.tsx
Task T010: Seção "Excluídos" em src/components/List.tsx
```

---

## Implementation Strategy

### MVP (US1 + US2 são P1 — entregar juntos)

1. Phase 1: Limpar código obsoleto (T001)
2. Phase 2: Atualizar modelo e App.tsx (T002, T003, T004)
3. Phase 3: Card + reordenação vertical (T005, T006, T007 em paralelo)
4. Phase 4: Swipe delete + seção excluídos (T008, T009, T010 em paralelo)
5. Phase 5: Swipe conclusão + visual verde (T011)
6. Phase 6: Verificação (T012, T013, T014)

---

## Notes

- `[P]` = arquivos diferentes, sem dependências entre si dentro da fase
- Nenhum arquivo deve importar `useLongPress` após T001
- T006 (ListItem base) e T007 (List base) devem estar completos ANTES de T009 e T010 respectivamente (mesmo arquivo)
- T009 (swipe left em ListItem) deve estar completo ANTES de T011 (swipe right em ListItem — mesmo arquivo)
- Executar `npm run type-check` após cada fase para detectar erros cedo
