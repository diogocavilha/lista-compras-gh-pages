# Implementation Plan: Fix Item Edit Inconsistency

**Branch**: `011-fix-item-edit` | **Date**: 2026-04-26 | **Spec**: [spec.md](specs/011-fix-item-edit/spec.md)
**Input**: Feature specification from `/speckit.specify` command

## Summary

Corrigir comportamento inconsistente na edição de itens. O problema está no gestures system do componente ListItem.tsx, onde o evento de "tap" para editar compete com o event handling de swipe. O sistema de gestures tem um threshold de 5px para detectar direção, mas a lógica de "tap" só funciona quando axis permanece null, levando a comportamentos imprevisíveis quando há micro-movimentos.

## Technical Context

**Language/Version**: TypeScript 5.1.6  
**Primary Dependencies**: React 18.2.0, MUI 9.0.0  
**Storage**: N/A (local storage via storageService)  
**Testing**: N/A (projeto não usa testes automatizados - verificação manual)  
**Target Platform**: Web (browser mobile/desktop)  
**Project Type**: Web application (SPA)  
**Performance Goals**: UI responsiva, interaction instantânea  
**Constraints**: Suporte a touch e mouse  
**Scale/Scope**: App Simples (single-page app)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **G1 - No Automated Tests**: Constitution establece que "This project does NOT use automated testing frameworks" - OK (projeto segue este princípio)
- **G2 - Clean Code**: Proposta de fix é simples e focada, sem over-engineering - OK

## Project Structure

### Documentation (this feature)

```
specs/011-fix-item-edit/
├── plan.md              # This file
├── spec.md             # Feature specification
├── research.md        # N/A (fix simples sem necessidade de pesquisa)
├── data-model.md       # Entidades já existentes (não precisa modificação)
└── quickstart.md      # N/A (funcionalidade existente)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── ListItem.tsx    # ← arquivo com bug a corrigir
│   ├── List.tsx        # edit dialog handler
│   └── ...
├── services/
│   └── storageService.ts
├── types/
│   └── index.ts
└── App.tsx
```

**Structure Decision**: Estrutura existente mantida. Código fonte em src/, componente com bug: src/components/ListItem.tsx.

## Phase 0: Outline & Research

### Análise Técnica

O bug está na lógica de gesture handling no `ListItem.tsx`:

1. **Threshold inconsistente**: O código usa 5px para detectar axis (linha 50) mas 10px para tap (linha 84)
2. **Lógica competitiva**: Tap só dispara quando `axis === null`, mas qualquer micro-movimento >5px seta axis, bloqueando tap
3. **Race condition**: Eventos touchmove podem ser disparados antes de `onUp`, alterando axis

### Solução Proposta

Simplificar a lógica de tap:
- Usar debounce ou timeout para distinguir tap de drag
- Separar logicamente tap detection do gesture tracking
- Garantir que taps curtos (<200ms) sempre disparem edit

## Phase 1: Design & Contracts

### Data Model

Não requer modificação. Entidades existentes:
- **ShoppingItem**: { id, title, completed, deleted } (já definido em types/index.ts)
- **EditDialog**: Controlled via List.tsx state

### Interface Contracts

Não requer novos contratos. Interface existente (props):
- `onEditItem?: (itemId: string) => void` no componente ListItem

### Agent Context

A actualizar em `AGENTS.md` para apontar para este plano.

## Phase 2: Próximos Passos

Após `/speckit.plan`, proceder para `/speckit.tasks` para criar lista de tarefas.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Notes

- Fix simples mas requer atenção aos edge cases de gesture
- Importante testar em device real para verificar touch behavior
- Manter compatibilidade com swipe-to-delete e swipe-to-complete