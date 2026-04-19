# Quickstart: Cards com Gestos de Swipe e Seção de Excluídos

## Dependências

Nenhuma instalação adicional necessária. `@mui/material` e `@mui/icons-material` já instalados.

## Comandos de Desenvolvimento

```bash
npm run dev        # servidor local em http://localhost:5173/lista-compras-gh-pages/
npm run type-check # verificar TypeScript sem erros
npm run build      # build de produção
npm run deploy     # publicar no GitHub Pages
```

## Mapa de Arquivos: Escopo da Feature

| Arquivo | Tipo de Mudança | O que muda |
|---------|----------------|------------|
| `src/types/index.ts` | Alteração | Adicionar `deleted: boolean`, `deletedAt: string \| null` a `ListItem` |
| `src/App.tsx` | Alteração | `handleDeleteItem` → soft delete; adicionar `handleReorderItems`; atualizar `handleAddItem` e `handleToggleItem` |
| `src/components/List.tsx` | Reescrita | Remover trash zone; drag-to-reorder vertical; renderizar seção "Excluídos" |
| `src/components/ListItem.tsx` | Reescrita | Card sem checkbox; swipe horizontal (esq=delete, dir=toggle); visual por estado; handoff de gesto vertical |
| `src/hooks/useLongPress.ts` | Remoção | Não usado mais |

## Layout do Card (por estado)

```
Item ativo, não concluído (fundo branco/paper):
┌─────────────────────────────────────────┐
│ Nome do produto                         │
└─────────────────────────────────────────┘

Item ativo, concluído (fundo verde):
┌─────────────────────────────────────────┐
│ ~~Nome do produto~~                 ✓  │
└─────────────────────────────────────────┘

Item excluído — seção "Excluídos" (fundo vermelho):
┌─────────────────────────────────────────┐
│ Nome do produto                         │
└─────────────────────────────────────────┘
```

## Verificação Manual (checklist)

### US1 — Reordenação Vertical

- [ ] Lista com 3+ itens: arrastar o 1º card para baixo muda a ordem
- [ ] Card segue o toque verticalmente; outros cards cedem espaço
- [ ] Soltar confirma nova posição; ordem persiste após recarregar o app
- [ ] Itens da seção "Excluídos" NÃO são reordenáveis

### US2 — Swipe Esquerda (Excluir)

- [ ] Deslizar card >40% da largura para a esquerda remove o item da lista principal
- [ ] Fundo vermelho é revelado durante o swipe para a esquerda
- [ ] Item excluído aparece na seção "Excluídos" abaixo
- [ ] Swipe abaixo do threshold retorna o card à posição original com animação
- [ ] Seção "Excluídos" aparece automaticamente após o primeiro item excluído
- [ ] Itens excluídos persistem após fechar e reabrir o app

### US3 — Swipe Direita (Concluir)

- [ ] Deslizar card >40% da largura para a direita marca item como concluído
- [ ] Fundo verde é revelado durante o swipe para a direita
- [ ] Card concluído exibe fundo verde + CheckIcon à direita + nome riscado
- [ ] Swipe direita em item já concluído o desmarca (toggle)
- [ ] Swipe abaixo do threshold retorna o card

### Qualidade Geral

- [ ] Swipe horizontal não conflita com arrasto vertical (eixo dominante correto)
- [ ] Checkbox removido de todos os cards
- [ ] Nenhum erro de TypeScript (`npm run type-check` passa)
- [ ] Build de produção sem erros (`npm run build`)
