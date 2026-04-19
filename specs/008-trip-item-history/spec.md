# Feature Specification: Trip Item History

**Feature Branch**: `008-trip-item-history`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "Os itens excluídos devem ter a cor de fundo vermelha. Deve ser possível verificar quais itens foram comprados em cada viagem."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver Itens Comprados por Viagem (Priority: P1)

O usuário abre o painel de histórico (Dashboard) e consegue ver, para cada viagem concluída, a lista dos itens que foram comprados naquela viagem — incluindo o nome de cada produto.

**Why this priority**: Atualmente o histórico mostra apenas a quantidade de itens por viagem. Sem os nomes dos produtos, o histórico tem valor limitado — o usuário não consegue lembrar o que comprou em cada ocasião.

**Independent Test**: Pode ser testado de forma independente: concluir uma lista de compras com 3 itens nomeados, acessar o painel e verificar que a viagem exibe os nomes dos 3 produtos comprados.

**Acceptance Scenarios**:

1. **Given** o usuário possui viagens concluídas no histórico, **When** ele acessa o painel de histórico, **Then** cada viagem exibe a lista de nomes dos itens comprados naquela viagem.
2. **Given** uma viagem com 5 itens comprados, **When** o usuário visualiza essa viagem no histórico, **Then** todos os 5 nomes de produtos aparecem listados.
3. **Given** viagens realizadas antes desta funcionalidade (sem dados de itens salvos), **When** o usuário visualiza essas viagens antigas no histórico, **Then** é exibida uma mensagem indicando que os detalhes de itens não estão disponíveis para essa viagem.
4. **Given** uma viagem concluída, **When** o usuário visualiza os itens dessa viagem, **Then** apenas os itens efetivamente comprados (concluídos) aparecem — itens que foram excluídos da lista antes do término da viagem não aparecem.

---

### User Story 2 - Fundo Vermelho para Itens Excluídos (Priority: P2)

Ao excluir um item da lista ativa (deslizando para a esquerda), o card do item na seção "Excluídos" deve ter cor de fundo vermelha claramente visível, tornando visualmente óbvio que o item foi removido.

**Why this priority**: O feedback visual de exclusão já existe parcialmente (seção "Excluídos"), mas a cor vermelha precisa ser clara e consistente para que o usuário identifique imediatamente o estado do item sem ambiguidade.

**Independent Test**: Pode ser testado de forma independente: excluir um item da lista, verificar que ele aparece na seção "Excluídos" com fundo visivelmente vermelho.

**Acceptance Scenarios**:

1. **Given** uma lista com itens ativos, **When** o usuário exclui um item (deslizando para a esquerda), **Then** o item aparece na seção "Excluídos" com cor de fundo vermelha.
2. **Given** múltiplos itens excluídos na seção "Excluídos", **When** o usuário visualiza a lista, **Then** todos os itens excluídos têm fundo vermelho.
3. **Given** um item excluído na seção "Excluídos", **When** o usuário recarrega o aplicativo, **Then** o fundo vermelho do item persiste.

---

### Edge Cases

- O que acontece quando o usuário tenta ver os itens de uma viagem realizada antes da funcionalidade ser implementada (dados históricos sem itens salvos)?
- O que acontece quando todos os itens de uma lista foram excluídos antes de qualquer conclusão — a viagem pode ser concluída? (Assumido: não, pois não há itens concluídos)
- O que acontece quando uma lista tem muitos itens (20+) — a visualização no histórico permanece legível?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE salvar os nomes dos itens comprados (concluídos) no momento em que uma lista é arquivada como viagem concluída.
- **FR-002**: O painel de histórico DEVE exibir, para cada viagem concluída, a lista de nomes dos produtos comprados naquela viagem.
- **FR-003**: Para viagens antigas sem dados de itens, o sistema DEVE exibir uma indicação de que os detalhes não estão disponíveis.
- **FR-004**: Os itens excluídos (seção "Excluídos" na lista ativa) DEVEM ter cor de fundo vermelha claramente visível.
- **FR-005**: A cor vermelha dos itens excluídos DEVE persistir entre sessões (ao recarregar o aplicativo).
- **FR-006**: Apenas itens efetivamente comprados (marcados como concluídos) DEVEM aparecer no histórico de itens da viagem — itens excluídos antes da conclusão da viagem NÃO devem aparecer.

### Key Entities

- **Viagem Concluída (CompletedList)**: Representa uma viagem de compras finalizada. Atualmente armazena data de início, data de conclusão, duração e quantidade de itens. Precisa armazenar também a lista de nomes dos produtos comprados.
- **Item de Viagem**: O nome de um produto comprado em uma viagem específica. Pertence a uma única viagem concluída.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue visualizar os nomes de todos os produtos comprados em uma viagem em menos de 2 toques/cliques a partir da tela principal.
- **SC-002**: 100% das viagens realizadas após a implementação exibem a lista completa de itens comprados.
- **SC-003**: Viagens antigas (sem dados de itens) exibem uma mensagem informativa em vez de dados incorretos ou ausência de explicação.
- **SC-004**: A cor vermelha dos itens excluídos é reconhecível imediatamente como indicação de exclusão por 100% dos usuários (sem necessidade de explicação).

## Assumptions

- O histórico de itens é somente leitura — o usuário não pode editar ou remover itens do histórico de viagens passadas.
- Apenas o nome do produto é armazenado no histórico (sem quantidade, preço ou outras informações).
- Viagens realizadas antes desta funcionalidade não têm dados de itens — isso é esperado e comunicado ao usuário com uma mensagem amigável.
- A lista de itens de uma viagem pode ser exibida inline no painel de histórico (sem necessidade de tela separada).
- A quantidade máxima de itens por viagem não impõe restrição na exibição — todos os itens são listados.
- O aplicativo é usado por um único usuário (sem autenticação ou separação de dados por usuário).
