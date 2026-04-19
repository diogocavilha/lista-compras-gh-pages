# Feature Specification: Cards com Gestos de Swipe e Seção de Excluídos

**Feature Branch**: `007-card-swipe-gestures`
**Created**: 2026-04-19
**Status**: Draft
**Input**: User description: "Cada item da lista deve se parecer com um card simples. Os itens podem ser reordenados ao serem tocados e arrastados. Ao arrastar um item para a esquerda, ele deve ser removido da lista. Ao arrastar um item para a direita, ele deve ser concluído. A lista deve se dividir em duas sessões quando um ou mais itens são excluídos. Os itens excluídos devem aparecer em uma segunda lista abaixo da lista principal."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reordenar Itens por Arrasto Vertical (Priority: P1)

O usuário toca e arrasta qualquer card verticalmente para reorganizar a ordem dos itens na lista. A nova ordem é preservada quando o app é fechado e reaberto.

**Why this priority**: Reordenação é a funcionalidade de organização mais fundamental e usada no dia a dia de compras. Sem ela, o usuário não consegue priorizar itens.

**Independent Test**: Abrir uma lista com 3+ itens, arrastar o primeiro card para baixo e verificar que a ordem muda visualmente e persiste após recarregar.

**Acceptance Scenarios**:

1. **Given** uma lista com 3 ou mais itens, **When** o usuário toca e arrasta um card verticalmente, **Then** o card segue o toque e os demais cards abrem espaço para indicar a nova posição.
2. **Given** o usuário solta o card em uma nova posição, **When** o gesto termina, **Then** o item ocupa permanentemente a nova posição e a ordem é salva.
3. **Given** o usuário abre o app novamente após reordenar, **When** a lista carrega, **Then** os itens aparecem na última ordem definida pelo usuário.

---

### User Story 2 - Excluir Item por Swipe para a Esquerda (Priority: P1)

O usuário desliza um card horizontalmente para a esquerda para removê-lo da lista. O card excluído aparece imediatamente em uma seção separada abaixo da lista principal.

**Why this priority**: Exclusão por gesto é intuitiva em apps mobile e elimina a necessidade de botões de ação visíveis, mantendo o visual limpo.

**Independent Test**: Com uma lista de 2+ itens, deslizar um card para a esquerda e verificar que ele sai da lista principal e aparece na seção de excluídos abaixo.

**Acceptance Scenarios**:

1. **Given** uma lista com pelo menos 1 item, **When** o usuário desliza o card para a esquerda além de 40% da largura do card, **Then** o item é removido da lista principal com animação de saída.
2. **Given** um item foi excluído, **When** a tela atualiza, **Then** a lista se divide em duas seções: a lista ativa acima e a seção "Excluídos" abaixo.
3. **Given** a seção de excluídos existe, **When** o usuário exclui outro item, **Then** o novo item é adicionado à seção de excluídos.
4. **Given** um swipe para esquerda não atingiu o limiar, **When** o usuário solta o card, **Then** o card retorna à posição original com animação.

---

### User Story 3 - Concluir Item por Swipe para a Direita (Priority: P2)

O usuário desliza um card horizontalmente para a direita para marcar o item como concluído. O card recebe feedback visual diferenciado e permanece na lista principal.

**Why this priority**: Complementa o swipe de exclusão criando uma linguagem gestual consistente. É uma forma rápida de registrar que o produto foi pego no mercado.

**Independent Test**: Com 1+ itens, deslizar um card para a direita e verificar que o item recebe marcação visual de "concluído" e permanece na lista principal.

**Acceptance Scenarios**:

1. **Given** uma lista com itens não concluídos, **When** o usuário desliza um card para a direita além de 40% da largura do card, **Then** o item é marcado como concluído com feedback visual (texto riscado e opacidade reduzida).
2. **Given** um item já concluído, **When** o usuário desliza para a direita novamente, **Then** o item é desmarcado (toggle).
3. **Given** um swipe para direita não atingiu o limiar, **When** o usuário solta o card, **Then** o card retorna à posição original.

---

### Edge Cases

- O que acontece se a lista tem apenas 1 item e ele é excluído? A seção de excluídos aparece e a lista principal exibe mensagem de lista vazia.
- O que acontece se todos os itens forem excluídos? Apenas a seção de excluídos é exibida; a área da lista ativa mostra mensagem de vazia.
- O que acontece se o usuário tentar reordenar um item excluído? Itens na seção de excluídos não são reordenáveis.
- O swipe horizontal conflita com o arrasto vertical de reordenação? A direção dominante nos primeiros pixels de movimento determina o gesto: horizontal ativa swipe, vertical ativa reordenação.
- O que acontece com itens excluídos ao recarregar o app? Itens excluídos são persistidos e continuam na seção de excluídos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada item da lista DEVE ser exibido como um card independente contendo apenas o nome do produto.
- **FR-002**: O usuário DEVE poder reordenar itens arrastando um card verticalmente para uma nova posição na lista ativa.
- **FR-003**: A nova ordem dos itens DEVE ser persistida entre sessões do app.
- **FR-004**: O usuário DEVE poder excluir um item deslizando o card para a esquerda além de 40% da largura do card.
- **FR-005**: Itens excluídos DEVEM aparecer em uma seção separada intitulada "Excluídos" abaixo da lista principal, visível somente quando houver ao menos 1 item excluído.
- **FR-006**: O usuário DEVE poder marcar/desmarcar um item como concluído deslizando o card para a direita além de 40% da largura do card.
- **FR-007**: Itens concluídos DEVEM receber feedback visual diferenciado (texto riscado e opacidade reduzida) mantendo-se na lista principal.
- **FR-008**: Cards que não atingirem o limiar de swipe DEVEM retornar à posição original com animação.
- **FR-009**: O estado de itens excluídos DEVE ser persistido entre sessões do app.
- **FR-010**: Itens na seção de excluídos NÃO DEVEM ser reordenáveis ou ativáveis por swipe.

### Key Entities

- **Item Ativo**: Item visível na lista principal; pode ser reordenado, excluído (swipe esquerda) ou concluído (swipe direita).
- **Item Excluído**: Item removido da lista principal por swipe; aparece na seção "Excluídos"; preservado entre sessões.
- **Item Concluído**: Item ativo com status de conclusão; exibido na lista principal com aparência diferenciada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue excluir um item com um único gesto de swipe em menos de 2 segundos.
- **SC-002**: O usuário consegue reordenar itens com gesto de arrasto em menos de 3 segundos.
- **SC-003**: A seção de excluídos aparece automaticamente sem ação adicional após o primeiro item ser excluído.
- **SC-004**: Gestos de swipe horizontal que ultrapassam o limiar resultam na ação correta sem conflito com arrasto vertical.
- **SC-005**: A ordem dos itens ativos e os itens excluídos são preservados após fechar e reabrir o app.

## Assumptions

- O app já exibe itens em formato de lista; esta feature substitui a apresentação por cards e adiciona os gestos de swipe.
- Itens excluídos podem ser vistos na seção de excluídos mas não podem ser restaurados nesta versão.
- A seção de excluídos não tem limite de itens exibidos.
- O gesto de reordenação é iniciado por arrasto predominantemente vertical desde o início do toque, não conflitando com swipe horizontal.
- Itens excluídos são armazenados no mesmo mecanismo de persistência local já existente no app.
- Ao concluir todos os itens ativos (sem exclusões), o comportamento de arquivamento da lista existente é mantido.
