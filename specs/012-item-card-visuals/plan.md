# Implementation Plan: Item Card Visuals - Light Theme

**Branch**: `012-item-card-visuals` | **Date**: 2026-04-26 | **Spec**: [spec.md](specs/012-item-card-visuals/spec.md)
**Input**: Feature specification from `/speckit.specify` command

## Summary

Alterar a cor dos cards de itens no tema claro. Os cards são brancos atualmente e devem ficar mais escuros para contrastar com o fundo do app. A solução é adicionar uma cor de background customizada no theme MUI.

## Technical Context

**Language/Version**: TypeScript 5.1.6  
**Primary Dependencies**: React 18.2.0, MUI 9.0.0  
**Storage**: N/A  
**Testing**: N/A (projeto não usa testes automatizados)  
**Target Platform**: Web  
**Project Type**: Web application (SPA)  
**Performance Goals**: N/A (mudança visual apenas)  
**Constraints**: Suporte a tema claro e escuro  
**Scale/Scope**: App Simples

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **G1 - No Automated Tests**: OK (projeto segue constituição)
- **G2 - Clean Code**: OK (mudança simples, sem over-engineering)

## Project Structure

### Documentation (this feature)

```
specs/012-item-card-visuals/
├── plan.md              # This file
├── spec.md             # Feature specification
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```
src/
├── context/
│   └── ThemeContext.tsx    # ← ThemeProvider com createTheme
└── components/
    └── ListItem.tsx        # ← Card component
```

**Structure Decision**: ThemeProvider em ThemeContext.tsx usa createTheme com palette.mode. A cor do card pode ser configurada via theme ou diretamente no componente ListItem.

## Phase 0: Outline & Research

### Análise Técnica

O ThemeProvider atual usa `createTheme({ palette: { mode: themeMode } })` sem configurações customizadas.

Opções para implementar:
1. **Theme-based**: Adicionar `palette.background.default` no theme para light mode
2. **Direct in component**: Usar theme em ListItem.tsx para obter cor

A opção 1 é mais limpa e segue o padrão MUI.

### Solução Proposta

Em ThemeContext.tsx, modificar createTheme para incluir:
```js
createTheme({
  palette: {
    mode: themeMode,
    background: {
      default: themeMode === 'light' ? '#f5f5f5' : '#121212',
      paper: themeMode === 'light' ? '#e0e0e0' : '#1e1e1e'
    }
  }
})
```

Em ListItem.tsx, usar `theme.palette.background.paper` para o Card em vez de hardcoded colors:
- `bgcolor: theme.palette.background.paper` (não mais `'background.paper'`)

## Phase 1: Design & Contracts

### Data Model

Não requer modificação. Card já existe.

### Interface Contracts

Não requer novos contratos.

### Agent Context

A actualizar em AGENTS.md.

## Phase 2: Próximos Passos

Após `/speckit.plan`, proceder para `/speckit.tasks`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |