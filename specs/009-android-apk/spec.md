# Feature Specification: Android APK Build

**Feature Branch**: `009-android-apk`
**Created**: 2026-04-21
**Status**: Draft
**Input**: User description: "Transforme essa aplicação em nativa para Android. No final quero um apk, para que seja possível instalar e utilizar em um Android."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instalar o app no Android (Priority: P1)

Um usuário recebe ou baixa o arquivo APK da lista de compras e o instala diretamente no seu celular Android, sem precisar publicar na Play Store. O app aparece na lista de aplicativos e pode ser aberto como qualquer outro app nativo.

**Why this priority**: É o objetivo central da feature — ter um APK instalável é o critério de sucesso mínimo e entrega valor imediato.

**Independent Test**: Pode ser testado de forma independente instalando o APK gerado em um dispositivo Android físico ou emulador e verificando que o app abre corretamente.

**Acceptance Scenarios**:

1. **Given** um arquivo APK gerado pelo processo de build, **When** o usuário transfere o arquivo para um Android e executa a instalação, **Then** o sistema operacional Android instala o app e o ícone aparece na tela inicial.
2. **Given** o app instalado no Android, **When** o usuário o abre, **Then** a tela principal da lista de compras é exibida corretamente.
3. **Given** o app instalado, **When** o usuário navega pelas funcionalidades (criar lista, adicionar itens, marcar como comprado), **Then** todas as funcionalidades funcionam conforme a versão web.

---

### User Story 2 - Dados persistidos localmente no dispositivo (Priority: P2)

O usuário utiliza o app Android e seus dados (listas, itens, histórico) são salvos no dispositivo, permanecendo disponíveis após fechar e reabrir o app, sem necessidade de conexão à internet.

**Why this priority**: A funcionalidade de persistência de dados é core para o app ser utilizável; sem ela, o app não tem utilidade prática.

**Independent Test**: Pode ser testado criando uma lista, fechando o app, reabrindo e verificando que os dados ainda estão lá.

**Acceptance Scenarios**:

1. **Given** o app aberto com listas criadas, **When** o usuário fecha o app e o reabre, **Then** todas as listas e itens criados anteriormente são exibidos.
2. **Given** o dispositivo sem conexão à internet, **When** o usuário cria e gerencia listas, **Then** todas as operações funcionam normalmente e os dados são salvos localmente.

---

### User Story 3 - Experiência visual adaptada para mobile (Priority: P3)

O app exibe a interface corretamente em diferentes tamanhos de tela de celulares Android (pequenos, médios e grandes), com elementos de toque adequados ao uso com os dedos.

**Why this priority**: Garante usabilidade satisfatória; embora o layout responsivo já exista na versão web, é importante validar que funciona bem empacotado como APK nativo.

**Independent Test**: Pode ser testado abrindo o app em diferentes resoluções de tela e verificando que não há elementos cortados ou sobrepostos.

**Acceptance Scenarios**:

1. **Given** o app instalado em um Android com tela pequena (5"), **When** o usuário navega pelas telas, **Then** todos os elementos são visíveis e tocáveis sem necessidade de zoom.
2. **Given** o app instalado em um Android com tela grande (6.5"+), **When** o usuário usa o app, **Then** o layout aproveita o espaço disponível sem distorções.

---

### Edge Cases

- O que acontece se o usuário tentar instalar o APK em uma versão do Android mais antiga do que a suportada?
- Como o app se comporta se o armazenamento local do dispositivo estiver cheio?
- O que acontece se o usuário desinstalar e reinstalar o app — os dados são perdidos?
- O app funciona corretamente em modo landscape (paisagem)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O processo de build DEVE gerar um arquivo APK assinado com assinatura de debug, instalável em dispositivos Android com "fontes desconhecidas" habilitadas.
- **FR-002**: O APK DEVE conter todas as funcionalidades existentes na versão web: criação/edição/exclusão de listas, adição/remoção de itens, marcação de itens como comprados, histórico de viagens.
- **FR-003**: O app DEVE persistir todos os dados localmente no dispositivo Android (equivalente ao `localStorage` da versão web), sem depender de servidor externo.
- **FR-004**: O app DEVE funcionar completamente offline, sem necessidade de conexão à internet para operação normal.
- **FR-005**: O APK DEVE ser compatível com Android 8.0 (API 26) ou superior, cobrindo a grande maioria dos dispositivos em uso.
- **FR-006**: O app DEVE exibir o ícone correto na tela inicial e na lista de apps do dispositivo.
- **FR-007**: O processo de geração do APK DEVE ser reproduzível localmente com um único comando de build.

### Key Entities

- **APK**: Arquivo de instalação Android contendo o app empacotado com todos os assets, lógica e configurações necessárias.
- **Armazenamento Local**: Mecanismo no dispositivo Android equivalente ao `localStorage` do navegador, para persistência dos dados das listas.
- **Versão mínima de Android**: Definição da versão mais antiga do Android suportada pelo app gerado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um arquivo APK é gerado com sucesso ao final do processo de build.
- **SC-002**: O APK pode ser instalado em um dispositivo Android (físico ou emulador) com Android 8.0+ sem erros.
- **SC-003**: 100% das funcionalidades presentes na versão web estão funcionais na versão Android empacotada.
- **SC-004**: Os dados persistem corretamente após fechar e reabrir o app em pelo menos 3 ciclos consecutivos.
- **SC-005**: O app inicia em menos de 5 segundos em dispositivos Android modernos (lançamento a frio).
- **SC-006**: O processo de build completo (do código-fonte ao APK) é concluído em menos de 15 minutos em uma máquina de desenvolvimento padrão.

## Assumptions

- O usuário sabe como habilitar a instalação de "fontes desconhecidas" no Android para instalar APKs fora da Play Store.
- Publicação na Google Play Store está fora do escopo desta feature; o objetivo é apenas gerar um APK instalável diretamente.
- A assinatura do APK será feita com chave de debug (não requer keystore de produção).
- O código fonte existente (React/TypeScript) será reaproveitado tal como está, sem reescrita nativa.
- Notificações push, câmera, GPS e outras permissões de hardware nativo não são necessárias para esta versão.
- O ambiente de desenvolvimento já possui Node.js instalado; ferramentas adicionais de build Android podem precisar ser instaladas.
