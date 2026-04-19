# Quickstart: Trip Item History

**Feature**: `008-trip-item-history`  
**Date**: 2026-04-19

---

## Comandos de Desenvolvimento

```bash
npm run dev          # Servidor local em http://localhost:5173
npm run type-check   # Verificação TypeScript (sem emitir arquivos)
npm run build        # Build de produção
npm run deploy       # Deploy para GitHub Pages
```

---

## Mapa de Arquivos

### Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/types/index.ts` | Adicionar `purchasedItems?: string[]` à interface `CompletedList` |
| `src/App.tsx` | Atualizar `archiveCompletedList` para salvar `purchasedItems` |
| `src/components/Dashboard.tsx` | Tornar cards de viagem clicáveis; adicionar estado e Dialog de detalhe |
| `src/components/ListItem.tsx` | Incluir `item.deleted` na lógica de cor de fundo do Card |
| `src/components/List.tsx` | Remover `bgcolor: 'error.light'` do Box wrapper dos itens excluídos |

### Criados

| Arquivo | Propósito |
|---------|-----------|
| `src/components/TripDetailDialog.tsx` | Dialog read-only com itens comprados de uma viagem |

---

## Checklist de Verificação Manual

### US1 — Ver itens comprados por viagem (Dialog de Detalhe)

**Setup**: Concluir uma lista com 3 itens nomeados (ex: Leite, Pão, Ovos)

- [ ] Ao acessar a aba "Painel", os cards de viagem são visivelmente tocáveis (cursor pointer no desktop)
- [ ] Ao tocar em um card de viagem recente, um Dialog abre com o título da viagem
- [ ] O Dialog exibe todos os nomes dos itens comprados naquela viagem
- [ ] O Dialog é somente leitura — nenhuma ação além de fechar está disponível
- [ ] Ao fechar o Dialog (botão ou toque fora), o painel volta ao estado normal
- [ ] Viagens antigas (sem `purchasedItems`) exibem mensagem "Detalhes não disponíveis para esta viagem"
- [ ] Itens excluídos antes da conclusão da viagem NÃO aparecem no Dialog

### US2 — Fundo vermelho para itens excluídos

**Setup**: Ter uma lista com pelo menos um item excluído (deslize para a esquerda)

- [ ] Itens na seção "Excluídos" têm fundo visivelmente vermelho (`error.light`)
- [ ] A cor vermelha está no próprio card (não apenas no container externo)
- [ ] A cor persiste ao recarregar o aplicativo (F5 ou fechar/abrir)
- [ ] Itens ativos continuam com fundo branco/padrão
- [ ] Itens concluídos continuam com fundo verde (`success.light`)

### Regressão

- [ ] A funcionalidade de swipe (esquerda/direita) nos itens ativos continua funcionando
- [ ] O arrastar para reordenar continua funcionando
- [ ] As estatísticas no painel continuam corretas
- [ ] A lista vazia exibe a mensagem padrão corretamente
- [ ] Criar nova lista e adicionar itens continua funcionando
