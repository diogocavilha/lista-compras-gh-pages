# Tasks: Otimização da Interface para Mobile (MUI Migration)

**Input**: Design documents from `/specs/006-mobile-ui-optimization/`
**Prerequisites**: plan.md ✓ | spec.md ✓ | research.md ✓ | data-model.md ✓ | quickstart.md ✓

**Tests**: Verificação manual (per constitution — sem frameworks de teste automatizados)

**Organization**: Tasks organizadas por user story para permitir implementação e teste independentes de cada história.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependências de tasks incompletas)
- **[Story]**: User story à qual a task pertence (US1, US2, US3, US4)
- Caminhos de arquivo incluídos em todas as descrições

---

## Phase 1: Setup (Troca de dependências)

**Purpose**: Remover Chakra UI e instalar MUI. Deve ser concluída antes de qualquer migração de componente.

- [x] T001 Remover pacotes Chakra UI e Framer Motion: `npm uninstall @chakra-ui/react @chakra-ui/icons framer-motion`
- [x] T002 Instalar MUI v6: `npm install @mui/material @mui/icons-material` (manter `@emotion/react` e `@emotion/styled`)

---

## Phase 2: Foundational (Pré-requisitos bloqueantes)

**Purpose**: Infraestrutura compartilhada que DEVE estar completa antes de qualquer user story.

**⚠️ CRÍTICO**: Nenhuma user story pode ser iniciada até esta fase estar completa.

- [x] T003 Criar `src/context/ThemeContext.tsx` — contexto React com `themeMode: 'light' | 'dark'` e `toggleTheme()`, lendo/escrevendo via `storageService.getTheme()` / `storageService.setTheme()`; envolver com `createTheme({ palette: { mode } })` e exportar `ThemeProvider` customizado
- [x] T004 [P] Criar `src/components/ConfirmDialog.tsx` — componente MUI `Dialog` reutilizável com props: `open`, `title`, `message`, `confirmLabel` (default "Confirmar"), `cancelLabel` (default "Cancelar"), `severity?: 'error' | 'warning'`, `onConfirm`, `onCancel`
- [x] T005 [P] Criar `src/hooks/useLongPress.ts` — hook com threshold de 1000ms via `setTimeout` em `onTouchStart`/`onMouseDown`; cancela em movimento > 5px (`onTouchMove`/`onMouseMove`) ou em release antes do threshold; retorna `{ handlers, isDragging, dragX, dragY }`
- [x] T006 Migrar `src/main.tsx` — substituir `<ChakraProvider>` por `<ThemeContextProvider>` (do ThemeContext.tsx) + `<CssBaseline />`; remover todos os imports de `@chakra-ui`
- [x] T007 Limpar `src/App.css` — remover estilos globais específicos do Chakra que conflitem com `CssBaseline`; manter apenas regras que não são cobertas pelo MUI

**Checkpoint**: Dependências instaladas, infraestrutura compartilhada pronta — implementação das user stories pode começar.

---

## Phase 3: User Story 1 — Navegação por Abas em Dispositivos Móveis (Priority: P1) 🎯 MVP

**Goal**: O app abre com `BottomNavigation` fixada no rodapé (Compras, Painel, Configurações); tema claro/escuro funcionando via ThemeContext.

**Independent Test**: Acessar o app em viewport de 375px e verificar que as três abas são clicáveis no rodapé, o conteúdo de cada aba é exibido corretamente e o botão de tema alterna entre light/dark.

- [x] T008 [US1] Migrar `src/App.tsx` — substituir `<Tabs>` do Chakra por `<BottomNavigation>` do MUI fixado no rodapé (`position: fixed; bottom: 0`); renderizar `List`, `Dashboard` e `BackupRestore` condicionalmente pelo índice da tab ativa; adicionar estado `snackbar: { message, severity } | null` com `<Snackbar>` + `<Alert>` para substituir `useToast`; adicionar prop `showSnackbar` para componentes filhos; remover todos os imports de `@chakra-ui`
- [x] T009 [P] [US1] Migrar `src/components/ThemeToggle.tsx` — substituir `useColorMode` do Chakra por `useThemeContext()` do ThemeContext; substituir `IconButton` do Chakra por `IconButton` do MUI; usar `Brightness4Icon` (dark) e `Brightness7Icon` (light) do `@mui/icons-material`; remover todos os imports de `@chakra-ui`

**Checkpoint**: Navegação mobile funcional com bottom nav e tema alternável.

---

## Phase 4: User Story 2 — Adição de Itens à Lista em Mobile (Priority: P1)

**Goal**: Tela principal mostra apenas a lista (ou empty state); FAB abre Dialog para adicionar item; Enter/botão confirmam adição.

**Independent Test**: Com uma lista ativa, tocar o FAB abre o Dialog; digitar um item e pressionar Enter (ou o botão Adicionar) adiciona o item à lista e fecha o Dialog; o campo é limpo após adição.

- [x] T010 [US2] Migrar `src/components/List.tsx` — substituir todos os componentes Chakra por MUI (`Box`, `Stack`, `Typography`, `List`, `ListItem`, `TextField`); remover o form inline de adição sempre visível; adicionar `<Fab color="primary">` fixado `bottom: 72px; right: 16px` com `AddIcon`; adicionar `<Dialog fullWidth maxWidth="xs">` com `<TextField autoFocus>` para entrada do item, botões Cancelar / Adicionar e submit via Enter; garantir que a lista ocupa `height: calc(100dvh - 56px)` com scroll interno; exibir estado vazio (`Typography` com mensagem) quando `list.items.length === 0` ou `list === null`; aceitar prop `showSnackbar` e substituir todas as chamadas `useToast` por `showSnackbar`; remover todos os imports de `@chakra-ui`

**Checkpoint**: Fluxo completo de adição de item via FAB + Dialog funcionando em mobile.

---

## Phase 5: User Story 3 — Visualização e Interação com Itens (Priority: P2)

**Goal**: Itens da lista renderizados com MUI; long press de 1s ativa drag mode com zona de lixeira; arrastar sobre a lixeira e soltar exibe ConfirmDialog; confirmar exclui o item.

**Independent Test**: Com uma lista com itens, marcar e desmarcar um item funciona; long press de 1s ativa o drag e mostra a lixeira; arrastar o item sobre a lixeira e soltar mostra confirmação; confirmar remove o item.

- [x] T011 [US3] Migrar `src/components/ListItem.tsx` — substituir todos os componentes Chakra por MUI (`Stack`, `Typography`, `Checkbox`, `IconButton`); integrar `useLongPress` para detectar hold de 1s; durante drag, aplicar `transform: translate(dx, dy)` no elemento via ref e `requestAnimationFrame` para seguir o ponteiro; emitir `onDragStart(itemId)` e `onDragEnd(isOverTrash)` para o componente pai via props; substituir `window.confirm` de exclusão por `ConfirmDialog`; remover todos os imports de `@chakra-ui`
- [x] T012 [US3] Atualizar `src/components/List.tsx` — adicionar estado `dragState: { draggingItemId: string | null, isOverTrash: boolean }`; renderizar zona de lixeira flutuante (`Fab` com `DeleteIcon`, centralizado acima do bottom nav, `position: fixed; bottom: 72px`) que aparece via transição CSS `opacity` quando `draggingItemId !== null`; mudar cor da lixeira para `error` quando `isOverTrash === true`; na conclusão do drag sobre a lixeira, abrir `ConfirmDialog`; passar `onDragStart`/`onDragEnd` como props para `ListItem`

**Checkpoint**: Interações com itens funcionando — checkbox, long-press, drag-to-trash com confirmação.

---

## Phase 6: User Story 4 — Visualização do Painel em Mobile (Priority: P3)

**Goal**: Dashboard renderizado com MUI; todos os cards e estatísticas cabem em viewport de 375px sem scroll horizontal.

**Independent Test**: Navegar para a aba Painel em viewport 375px; todos os elementos são legíveis e não há scroll horizontal.

- [x] T013 [P] [US4] Migrar `src/components/Dashboard.tsx` — substituir todos os componentes Chakra por MUI (`Box`, `Typography`, `Stack`, `Card`, `CardContent`, `Grid2`); substituir `SimpleGrid columns={{ base: 1, md: 2 }}` por `Grid2 container` com `xs={12} sm={6}` nos filhos; substituir `Stat`/`StatLabel`/`StatNumber` por `Typography` com variantes `subtitle2` (label) e `h5` (valor); substituir `Card`/`CardBody` por `Card`/`CardContent`; remover todos os imports de `@chakra-ui`

**Checkpoint**: Dashboard totalmente funcional e responsivo em mobile.

---

## Phase 7: Polish & Concerns transversais

**Purpose**: Migrar o componente restante, eliminar todos os `window.confirm()` restantes e verificar o build final.

- [x] T014 [P] Migrar `src/components/BackupRestore.tsx` — substituir todos os componentes Chakra por MUI (`Stack`, `Button`, `Typography`, `Card`, `CardContent`, `CardHeader`, `Divider`); substituir `DownloadIcon`/`DeleteIcon` do Chakra por equivalentes do `@mui/icons-material`; substituir os dois `window.confirm()` (restore e clear all) por `ConfirmDialog` em sequência (para o double-confirm de clear all, encadear dois estados de diálogo); remover todos os imports de `@chakra-ui`
- [x] T015 Substituir `window.confirm()` restante em `src/App.tsx` (criação de nova lista quando já existe uma ativa) por `ConfirmDialog`; adicionar estado `confirmDialog: ConfirmDialogState | null` no App
- [x] T016 Executar `npm run type-check` e corrigir todos os erros TypeScript nos arquivos migrados
- [x] T017 Executar `npm run build` e verificar que o bundle compila sem erros; confirmar que o tamanho do bundle não regrediu significativamente
- [x] T018 Verificação manual completa contra o checklist em `specs/006-mobile-ui-optimization/quickstart.md` em viewport de 375px

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — começar imediatamente
- **Foundational (Phase 2)**: Depende da conclusão do Setup — BLOQUEIA todas as user stories
- **US1 (Phase 3)**: Depende da Phase 2; T008 e T009 podem executar em paralelo
- **US2 (Phase 4)**: Depende de Phase 2 + T008 (App.tsx precisa do estado de snackbar); T010 pode começar quando T008 estiver pronto
- **US3 (Phase 5)**: Depende de Phase 2 + T010 (List.tsx base); T011 e T012 devem ser feitos em sequência (T011 antes de T012 para alinhar as props)
- **US4 (Phase 6)**: Depende da Phase 2; independente de US2/US3 — pode ser feita em paralelo com Phase 5
- **Polish (Phase 7)**: Depende de todas as fases anteriores

### User Story Dependencies

- **US1 (P1)**: Inicia após Phase 2 — sem dependência de outras user stories
- **US2 (P1)**: Inicia após T008 (App.tsx com Snackbar) — sem dependência de US1 exceto pelo shell
- **US3 (P2)**: Inicia após T010 (List.tsx base migrado) — depende da base de US2
- **US4 (P3)**: Inicia após Phase 2 — completamente independente de US1/US2/US3

### Within Each User Story

- Phase 2: T003 antes de T006 (ThemeContext criado antes de ser usado em main.tsx); T004 e T005 em paralelo com T003
- Phase 3: T008 e T009 em paralelo (arquivos independentes)
- Phase 5: T011 antes de T012 (props de drag definidas em ListItem antes de serem usadas em List)

### Parallel Opportunities

- T004 e T005 podem executar em paralelo com T003 (arquivos diferentes)
- T008 e T009 podem executar em paralelo (App.tsx vs ThemeToggle.tsx)
- T013 pode executar em paralelo com Phase 5 (Dashboard independente da lista)
- T014 pode executar em paralelo com T015 (BackupRestore vs App.tsx)

---

## Parallel Example: Phase 2 (Foundational)

```
# Tasks que podem rodar em paralelo após T001+T002:
Task T003: Criar src/context/ThemeContext.tsx
Task T004: Criar src/components/ConfirmDialog.tsx   ← paralelo com T003
Task T005: Criar src/hooks/useLongPress.ts          ← paralelo com T003 e T004
# Depois:
Task T006: Migrar src/main.tsx                      ← depende de T003
Task T007: Limpar src/App.css                       ← paralelo com T006
```

## Parallel Example: Phase 3 (US1)

```
# Tasks que podem rodar em paralelo após Phase 2:
Task T008: Migrar src/App.tsx (BottomNavigation + Snackbar)
Task T009: Migrar src/components/ThemeToggle.tsx    ← paralelo com T008
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 — as duas P1)

1. Concluir Phase 1: Setup (T001, T002)
2. Concluir Phase 2: Foundational (T003–T007)
3. Concluir Phase 3: US1 — Navegação (T008, T009)
4. Concluir Phase 4: US2 — Adição de Itens (T010)
5. **PARAR e VALIDAR**: App abre na lista, FAB funciona, BottomNavigation funciona
6. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → infraestrutura pronta
2. US1 + US2 → app usável no celular com navegação e adição de itens (MVP!)
3. US3 → interações avançadas com itens (drag-to-trash)
4. US4 → dashboard mobile
5. Polish → componentes restantes + verificação final

### Parallel Strategy (desenvolvedor único)

Prioridade de execução recomendada para desenvolvedor único:
T001 → T002 → T003 + T004 + T005 (paralelo) → T006 + T007 (paralelo) → T008 + T009 (paralelo) → T010 → T011 → T012 → T013 → T014 + T015 (paralelo) → T016 → T017 → T018

---

## Notes

- `[P]` = arquivos diferentes, sem dependências entre si
- `[Story]` mapeia a task para a user story específica
- Cada user story deve ser completável e testável independentemente
- Executar `npm run type-check` após cada componente migrado para detectar erros cedo
- Nenhuma task deve deixar `@chakra-ui` imports no arquivo alvo
- Commit após cada fase ou grupo lógico de tasks
