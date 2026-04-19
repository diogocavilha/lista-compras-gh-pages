# Feature Specification: Otimização da Interface para Mobile

**Feature Branch**: `006-mobile-ui-optimization`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "A interface visual deve ser alterada. Atualmente a interface não está otimizada para mobile."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegação por Abas em Dispositivos Móveis (Priority: P1)

Um usuário acessando o aplicativo em um smartphone deve conseguir navegar entre as abas (Compras, Painel, Configurações) sem que o layout quebre ou os elementos se sobreponham. A barra de navegação deve ser legível, acessível com o polegar e centralizada.

**Why this priority**: A navegação é o ponto de entrada de toda interação com o app. Se ela falhar em mobile, o usuário não consegue usar nenhuma funcionalidade.

**Independent Test**: Acessar o app em um dispositivo com tela de 375px de largura e verificar que as abas e o botão de tema estão visíveis, clicáveis e não se sobrepõem.

**Acceptance Scenarios**:

1. **Given** um usuário acessa o app em um smartphone com tela de 375px, **When** a página carrega, **Then** as três abas e o botão de alternância de tema são todos visíveis sem necessidade de rolar horizontalmente.
2. **Given** o usuário está em um dispositivo móvel, **When** toca em qualquer aba, **Then** o conteúdo correspondente é exibido corretamente sem elementos cortados ou sobrepostos.

---

### User Story 2 - Adição de Itens à Lista em Mobile (Priority: P1)

Um usuário mobile deve conseguir digitar o nome de um produto no campo de texto e adicioná-lo à lista com facilidade, sem que o teclado virtual oculte o botão de adicionar ou cause problemas de layout.

**Why this priority**: Adicionar itens é a ação principal do app. Falhas nessa interação em mobile tornam o app inutilizável no cenário de uso mais comum (usuário no supermercado com o celular na mão).

**Independent Test**: Em um dispositivo móvel, abrir o campo de texto, digitar um item e pressionar o botão de adicionar — o item deve aparecer na lista sem problemas de layout.

**Acceptance Scenarios**:

1. **Given** uma lista ativa, **When** o usuário toca no campo de entrada em um smartphone, **Then** o teclado virtual aparece e o campo e o botão de adicionar permanecem visíveis e acessíveis.
2. **Given** o usuário digitou um nome de produto, **When** toca no botão de adicionar, **Then** o item é adicionado e o campo é limpo sem redirecionamento ou perda de foco problemático.
3. **Given** o usuário está com o teclado aberto, **When** pressiona "Enter" no teclado virtual, **Then** o item é adicionado à lista.

---

### User Story 3 - Visualização e Interação com Itens da Lista em Mobile (Priority: P2)

Um usuário mobile deve conseguir visualizar todos os itens da lista, marcar itens como concluídos e remover itens com gestos naturais para toque, sem que os textos fiquem cortados ou os botões sejam muito pequenos para tocar.

**Why this priority**: Depois de adicionar itens, a interação principal é marcar e remover itens enquanto faz compras. Elementos de toque inadequados degradam gravemente a experiência no ponto de uso.

**Independent Test**: Com uma lista contendo itens de nomes variados (curtos e longos), verificar em mobile que todos os checkboxes e botões de exclusão são clicáveis e os textos são legíveis.

**Acceptance Scenarios**:

1. **Given** uma lista com itens de nomes longos, **When** visualizada em um smartphone, **Then** os nomes são exibidos completos ou truncados de forma elegante, sem ultrapassar os limites da tela.
2. **Given** um item na lista, **When** o usuário toca na área do checkbox em mobile, **Then** o item é marcado/desmarcado sem ativar acidentalmente o botão de exclusão.
3. **Given** um item na lista, **When** o usuário toca no botão de exclusão, **Then** uma confirmação é solicitada de forma adequada para mobile (não usando alert nativo do browser que tem aparência inconsistente em mobile).

---

### User Story 4 - Visualização do Painel (Dashboard) em Mobile (Priority: P3)

Um usuário mobile deve conseguir visualizar o painel de estatísticas de forma legível, com gráficos e métricas adaptados à largura da tela do smartphone.

**Why this priority**: O painel é uma funcionalidade secundária. A experiência pode ser melhorada sem bloquear as funcionalidades principais.

**Independent Test**: Navegar para a aba "Painel" em um smartphone e verificar que todas as informações são legíveis sem rolagem horizontal.

**Acceptance Scenarios**:

1. **Given** o usuário navega para a aba "Painel" em mobile, **When** a aba é exibida, **Then** todos os gráficos e textos estão dentro dos limites da tela e são legíveis.
2. **Given** não há listas concluídas, **When** o painel é exibido em mobile, **Then** a mensagem de estado vazio é clara e bem formatada.

---

### Edge Cases

- O que acontece quando o nome do item é muito longo (próximo de 200 caracteres) e precisa ser exibido em uma tela estreita?
- Como o layout se comporta em dispositivos com telas muito pequenas (menos de 320px)?
- Como a interface se adapta quando o dispositivo é rotacionado de retrato para paisagem?
- O que acontece quando o usuário amplia o texto nas configurações de acessibilidade do dispositivo?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A interface DEVE ser utilizável em telas com largura mínima de 320px sem rolagem horizontal.
- **FR-002**: Todos os elementos interativos (botões, checkboxes, campos de texto) DEVEM ter área de toque mínima de 44x44 pontos CSS para facilitar o uso em telas sensíveis ao toque.
- **FR-003**: A barra de navegação com abas e o botão de alternância de tema DEVEM ser exibidos de forma que não se sobreponham ou sejam cortados em telas menores que 400px.
- **FR-004**: O formulário de adição de itens DEVE permanecer visível e funcional quando o teclado virtual do dispositivo está ativo.
- **FR-005**: Nomes de itens longos DEVEM ser exibidos de forma que não ultrapassem os limites da tela, seja com quebra de linha ou truncamento com reticências.
- **FR-006**: As confirmações de ações destrutivas (excluir item, criar nova lista) DEVEM utilizar componentes de diálogo nativos do app, adequados para interação por toque, em substituição aos alertas nativos do navegador.
- **FR-007**: O conteúdo do painel DEVE ser adaptado para caber na largura da tela em modo retrato (portrait) em dispositivos móveis.
- **FR-008**: A interface DEVE se adaptar corretamente quando o dispositivo é rotacionado entre os modos retrato e paisagem.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário consegue completar o fluxo completo (criar lista → adicionar 3 itens → marcar todos como concluídos) em um smartphone com tela de 375px em menos de 2 minutos, sem encontrar elementos cortados ou inacessíveis.
- **SC-002**: Todos os elementos interativos da interface principal possuem área de toque de no mínimo 44x44 pontos CSS.
- **SC-003**: Nenhum conteúdo principal da interface requer rolagem horizontal em telas com largura mínima de 320px.
- **SC-004**: A interface funciona corretamente nas orientações retrato e paisagem em dispositivos com telas entre 320px e 768px de largura.
- **SC-005**: As confirmações de ações destrutivas são apresentadas via componentes visuais do app, não via `window.confirm()` ou `window.alert()`.

## Assumptions

- O aplicativo é utilizado principalmente em modo retrato (portrait) no celular, sendo a orientação paisagem um cenário secundário mas suportado.
- Os usuários utilizam navegadores modernos com suporte a CSS Flexbox e Grid, que são os padrões atuais em dispositivos móveis.
- A breakpoint principal para mobile é 375px (iPhone SE/padrão), com suporte mínimo de 320px.
- A otimização para tablet (768px+) está fora do escopo desta feature; o foco é exclusivamente em smartphones.
- O sistema de design atual (Chakra UI) será mantido; a otimização se dará através de ajustes de configuração e propriedades responsivas já disponíveis no sistema.
- As funcionalidades existentes (adicionar, marcar, excluir itens; backup/restauração) não serão alteradas em comportamento, apenas em apresentação visual.
