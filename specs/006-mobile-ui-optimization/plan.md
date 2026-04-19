# Implementation Plan: Otimização da Interface para Mobile

**Branch**: `006-mobile-ui-optimization` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-mobile-ui-optimization/spec.md`

## Summary

Migrar completamente a interface do Chakra UI para o Material UI (MUI v6), redesenhar a navegação para um padrão mobile-first com `BottomNavigation`, introduzir um FAB para adição de itens via `Dialog`, implementar long-press + drag-to-trash para exclusão de itens e eliminar todos os `window.confirm()` com um componente `ConfirmDialog` reutilizável.

## Technical Context

**Language/Version**: TypeScript 5.1 / React 18.2  
**Primary Dependencies**: MUI v6 (`@mui/material`, `@mui/icons-material`), Emotion (já instalado), Vite 5  
**Storage**: `localStorage` (via `storageService` — sem alterações)  
**Testing**: Verificação manual (per constitution — sem frameworks de teste automatizados)  
**Target Platform**: Web app mobile (PWA-ready), deploy via GitHub Pages  
**Project Type**: SPA (Single Page Application)  
**Performance Goals**: Build bundle sem regressão significativa de tamanho vs. baseline atual  
**Constraints**: Sem dependências adicionais além de MUI; sem quebra das APIs de `storageService`, `analyticsService`, `backupService`  
**Scale/Scope**: 7 componentes + 3 novos arquivos (hook, context, componente compartilhado)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Clean Code & Good Practices | PASS | Cada componente tem responsabilidade única; hook e context isolados |
| Small & Clear Scope | PASS | Escopo limitado a: troca de UI lib + novos padrões de interação definidos na spec |
| No Over-Engineering | PASS | Drag-to-trash via touch events nativos (sem react-dnd); ConfirmDialog compartilhado evita duplicação |
| No Automated Tests | PASS | Verificação via checklist manual em `quickstart.md` |

## Project Structure

### Documentation (this feature)

```text
specs/006-mobile-ui-optimization/
├── plan.md          ← este arquivo
├── research.md      ← decisões técnicas e alternativas consideradas
├── data-model.md    ← entidades de domínio + estado de UI
├── quickstart.md    ← setup, comandos, mapa de migração, checklist manual
└── tasks.md         ← gerado por /speckit-tasks (ainda não criado)
```

### Source Code — Arquivos modificados

```text
src/
├── main.tsx                          ← Substituir ChakraProvider por ThemeProvider + CssBaseline
├── App.css                           ← Limpar; regras globais passam para CssBaseline / theme
├── App.tsx                           ← Substituir Tabs por BottomNavigation; Snackbar no lugar de useToast
├── context/
│   └── ThemeContext.tsx              ← NOVO: contexto de tema (mode + toggleTheme)
├── hooks/
│   └── useLongPress.ts              ← NOVO: hook de long-press (1s threshold)
└── components/
    ├── ConfirmDialog.tsx             ← NOVO: dialog de confirmação reutilizável
    ├── List.tsx                      ← Migrar para MUI; adicionar FAB + Dialog de adição
    ├── ListItem.tsx                  ← Migrar para MUI; integrar useLongPress + drag-to-trash
    ├── Dashboard.tsx                 ← Migrar para MUI (Card, Grid, Typography)
    ├── ThemeToggle.tsx               ← Migrar para MUI; usar ThemeContext
    └── BackupRestore.tsx             ← Migrar para MUI; substituir window.confirm() por ConfirmDialog
```

## Design Decisions

### Navegação

**Antes**: `Tabs` do Chakra no topo da tela  
**Depois**: `BottomNavigation` do MUI fixada no fundo da tela

- Tab 0 (Compras): ícone `ShoppingCartIcon`
- Tab 1 (Painel): ícone `BarChartIcon`
- Tab 2 (Configurações): ícone `SettingsIcon`

O conteúdo de cada aba ocupa `height: calc(100dvh - 56px)` com scroll vertical independente.

---

### Adição de Itens (FAB + Dialog)

**FAB**: `<Fab color="primary">` fixado `bottom: 72px; right: 16px` (acima da bottom nav)  
**Dialog**: `<Dialog fullWidth maxWidth="xs">` com `<TextField autoFocus>` e botões Cancelar / Adicionar  
**Trigger**: FAB toque → `setAddItemOpen(true)`  
**Submit**: Enter no TextField ou botão Adicionar → `onAddItem(value)` → `setAddItemOpen(false)`

---

### Long Press + Drag to Trash

**`useLongPress` hook**:
- `onTouchStart` / `onMouseDown`: inicia `setTimeout(1000)`
- `onTouchMove` / `onMouseMove`: cancela timeout se movimento > 5px (previne ativação acidental)
- `onTouchEnd` / `onMouseUp`: cancela timeout; se já em drag mode, faz hit test vs trash zone
- Retorna: `{ handlers, isDragging }`

**Visual feedback durante drag**:
- Item em drag: `transform: translate(dx, dy)` em tempo real via ref + `requestAnimationFrame`
- Opacidade reduzida (0.6) no item original
- Zona de lixeira: `Fab` com `DeleteIcon` aparece via transição CSS `opacity` no fundo da tela (centralizado, acima da bottom nav)
- Quando hover sobre a lixeira: lixeira muda para cor `error` (vermelho)

**Confirmação**:
- Soltar sobre lixeira → `ConfirmDialog` ("Remover este item?")
- Confirmar → `onDeleteItem(item.id)` → snackbar "Item removido"
- Cancelar / soltar fora → item volta à posição original (transição `transform 200ms ease`)

---

### ConfirmDialog (compartilhado)

```
Props:
  open: boolean
  title: string
  message: string
  confirmLabel?: string  (default: "Confirmar")
  cancelLabel?: string   (default: "Cancelar")
  severity?: 'error' | 'warning'  (default: 'warning')
  onConfirm: () => void
  onCancel: () => void
```

Substitui todos os `window.confirm()` em:
- `ListItem.tsx` (delete item)
- `BackupRestore.tsx` (restore backup + clear all data — dupla confirmação → dois diálogos em sequência)
- `App.tsx` (criar nova lista quando já existe uma ativa)

---

### Tema / Dark Mode

`ThemeContext` fornece `themeMode: 'light' | 'dark'` e `toggleTheme()` para toda a árvore.  
`ThemeToggle.tsx` lê do context e chama `toggleTheme()`.  
`App.tsx` (ou `main.tsx`) envolve a árvore com `ThemeProvider` usando o tema criado a partir do `themeMode` do context.  
O modo é persistido via `storageService.setTheme()` / `storageService.getTheme()` — sem alteração no service.

---

### Snackbar (substituição do useToast)

Um único `<Snackbar>` controlado em `App.tsx` via estado `snackbar: { message, severity } | null`.  
Componentes filhos chamam uma função `showSnackbar(message, severity)` passada via props.

---

## Complexity Tracking

*Sem violações da Constitution — tabela não aplicável.*
