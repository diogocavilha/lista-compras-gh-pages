# Implementation Plan: Long Press Edit

**Branch**: `013-long-press-edit` | **Date**: 2026-04-26 | **Spec**: [spec.md](specs/013-long-press-edit/spec.md)
**Input**: Feature specification from `/speckit.specify` command

## Summary

Modificar o comportamento de edição de short tap (200ms) para long press (1 segundo). O edit popup abrirá após segurar o item por 1000ms, não mais com toque rápido.

## Technical Context

**Language/Version**: TypeScript 5.1.6  
**Primary Dependencies**: React 18.2.0, MUI 9.0.0  
**Storage**: N/A  
**Testing**: N/A (projeto não usa testes automatizados)  
**Target Platform**: Web  
**Project Type**: Web application (SPA)  
**Performance Goals**: N/A  
**Constraints**: Suporte a touch e mouse  
**Scale/Scope**: App Simples

## Constitution Check

*GATE: Must pass before Phase 0 research.*

- **G1 - No Automated Tests**: OK (projeto segue constituição)
- **G2 - Clean Code**: OK (mudança simples)

## Project Structure

### Source Code

```
src/components/
└── ListItem.tsx    # ← arquivo com lógica de gesture
```

## Análise Técnica

O código atual em `ListItem.tsx`:

- Linha 42: `startTime: Date.now()` - registra início do toque
- Linha 79: `touchDuration = Date.now() - gestureRef.current.startTime` - calcula duração
- Linha 88: `if (touchDuration < 200 && onEditItem)` - short tap < 200ms

**Mudança necessária**: Alterar o threshold de 200ms para 1000ms.

A lógica atual só dispara edit quando `axis === null` (sem swipe detectado) E `touchDuration < 200`.

Para long press, precisamos:
- Manter a detecção de swipe (horizontal/vertical)
- Quando não há swipe, verificar se duration >= 1000ms para long press

## Solução

Modificar linha 88 em `ListItem.tsx`:
- De: `if (touchDuration < 200 && onEditItem)`
- Para: `if (touchDuration >= 1000 && onEditItem)`

Isso altera o comportamento de "short tap abre edit" para "long press abre edit".

## Fase 2: Próximos Passos

Após `/speckit.plan`, proceder para `/speckit.tasks`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |