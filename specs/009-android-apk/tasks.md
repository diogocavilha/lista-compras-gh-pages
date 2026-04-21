# Tasks: Android APK Build

**Input**: Design documents from `/specs/009-android-apk/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organização**: Tarefas agrupadas por user story para entrega incremental e verificação independente.

## Formato: `[ID] [P?] [Story?] Descrição com caminho do arquivo`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: User story correspondente (US1, US2, US3)

---

## Phase 1: Setup (Inicialização do projeto Capacitor)

**Propósito**: Instalar dependências e criar arquivos de configuração base do Capacitor.

- [x] T001 Instalar dependências do Capacitor: `npm install @capacitor/core @capacitor/android` e `npm install -D @capacitor/cli @capacitor/assets`
- [x] T002 [P] Criar `capacitor.config.ts` na raiz do projeto (appId: `com.diogocavilha.listacompras`, appName: `Lista de Compras`, webDir: `build`)
- [x] T003 [P] Ajustar `vite.config.ts`: alterar linha `base` para `process.env.BUILD_TARGET === 'android' ? '/' : '/lista-compras-gh-pages/'`
- [x] T004 [P] Adicionar script `"build:android": "BUILD_TARGET=android tsc && vite build"` no `package.json`

---

## Phase 2: Foundational (Pré-requisitos bloqueantes)

**Propósito**: Criar o ícone, gerar o build web Android e inicializar a plataforma Android. DEVE estar completo antes das user stories.

**⚠️ CRÍTICO**: Nenhuma user story pode ser iniciada antes desta fase.

- [x] T005 Criar `assets/icon/icon.svg` com o ícone de carrinho de supermercado (fundo verde `#4CAF50`, carrinho branco — usar SVG de referência em `quickstart.md`)
- [x] T006 Converter `assets/icon/icon.svg` para `assets/icon/icon.png` (1024×1024px) usando Inkscape ou ImageMagick (ver comando em `quickstart.md`)
- [x] T007 Executar `npm run build:android` para gerar o build web com base path `/` em `build/`
- [x] T008 Executar `npx cap add android` para adicionar a plataforma Android (cria diretório `android/` na raiz)
- [x] T009 Executar `npx capacitor-assets generate --android` para gerar todos os tamanhos de ícone nos diretórios `android/app/src/main/res/mipmap-*/`
- [x] T010 Executar `npx cap sync android` para copiar os assets web para `android/app/src/main/assets/public/`

**Checkpoint**: Plataforma Android inicializada, ícones gerados, assets sincronizados — user stories podem começar.

---

## Phase 3: User Story 1 — Instalar o app no Android (Priority: P1) 🎯 MVP

**Goal**: Gerar um APK funcional instalável em dispositivos Android 8.0+, com o ícone de carrinho de supermercado.

**Independent Test**: Instalar `android/app/build/outputs/apk/debug/app-debug.apk` em um dispositivo/emulador Android e verificar que o app abre e exibe a tela principal da lista de compras.

- [x] T011 [US1] Executar `cd android && ./gradlew assembleDebug` para compilar o APK de debug
- [x] T012 [US1] Verificar que o arquivo `android/app/build/outputs/apk/debug/app-debug.apk` foi gerado com sucesso
- [ ] T013 [US1] Instalar o APK em dispositivo ou emulador Android (`adb install app-debug.apk` ou transferência manual) e confirmar que o app abre sem erro
- [ ] T014 [US1] Verificar que o ícone do carrinho de supermercado aparece corretamente na tela inicial e na lista de apps do Android
- [ ] T015 [US1] Verificar que todas as telas da aplicação (lista ativa, dashboard, histórico) carregam corretamente no dispositivo

**Checkpoint**: APK gerado, instalado e com ícone correto — US1 completa. MVP entregável.

---

## Phase 4: User Story 2 — Dados persistidos localmente (Priority: P2)

**Goal**: Confirmar que os dados (listas, itens, histórico) sobrevivem ao fechamento e reabertura do app, e que o app funciona offline.

**Independent Test**: Criar uma lista com itens no Android, forçar o fechamento do app, reabrir e confirmar que os dados ainda estão presentes.

- [ ] T016 [US2] Criar uma lista de compras com pelo menos 3 itens no app Android, fechar o app completamente e reabrir — verificar que os dados persistem
- [ ] T017 [US2] Marcar itens como comprados, fechar o app, reabrir e verificar que o estado dos itens persiste
- [ ] T018 [US2] Desativar Wi-Fi e dados móveis no dispositivo Android e verificar que todas as operações (criar lista, adicionar item, marcar comprado) funcionam normalmente offline
- [ ] T019 [US2] Concluir uma lista de compras (arquivar), fechar o app, reabrir e verificar que o histórico exibe a viagem arquivada corretamente

**Checkpoint**: Persistência e operação offline confirmadas — US2 completa.

---

## Phase 5: User Story 3 — Experiência visual adaptada para mobile (Priority: P3)

**Goal**: Confirmar que a interface é usável em diferentes tamanhos de tela Android sem elementos cortados ou sobrepostos.

**Independent Test**: Abrir o app em emulador com tela pequena (5") e verificar que todos os elementos são visíveis e tocáveis.

- [ ] T020 [US3] Testar o app em emulador Android com resolução de tela pequena (5", ex: Pixel 4a) — verificar que botões, listas e textos são visíveis e tocáveis sem zoom
- [ ] T021 [US3] Testar o app em emulador Android com resolução de tela grande (6.5"+, ex: Pixel 7 Pro) — verificar que o layout aproveita o espaço sem distorções
- [ ] T022 [US3] Verificar que gestos de swipe para deletar itens (feature existente) funcionam corretamente no Android
- [ ] T023 [US3] Verificar que o toggle de tema claro/escuro funciona e persiste no Android

**Checkpoint**: Experiência visual validada em diferentes tamanhos — US3 completa.

---

## Phase Final: Polish & Encerramento

**Propósito**: Verificações finais e documentação.

- [ ] T024 [P] Verificar que o deploy para GitHub Pages ainda funciona corretamente (`npm run build` sem `BUILD_TARGET=android`)
- [ ] T025 [P] Adicionar `android/` ao `.gitignore` se não for desejável versionar o projeto Android gerado pelo Capacitor (decisão do desenvolvedor)
- [ ] T026 Atualizar `specs/009-android-apk/quickstart.md` com quaisquer correções encontradas durante a implementação (versões exatas, comandos ajustados, etc.)

---

## Dependencies & Execution Order

### Dependências entre fases

- **Phase 1 (Setup)**: Sem dependências — começar imediatamente
- **Phase 2 (Foundational)**: Depende de Phase 1 completa — bloqueia todas as user stories
  - T005/T006 (ícone) dependem de T001 (npm install)
  - T007 (build:android) depende de T003 e T004
  - T008 (cap add) depende de T001 e T007
  - T009 (icons) depende de T006 e T008
  - T010 (cap sync) depende de T007, T008 e T009
- **Phase 3 (US1)**: Depende de Phase 2 completa — é o MVP
- **Phase 4 (US2)**: Depende de Phase 3 (precisa do APK instalado)
- **Phase 5 (US3)**: Depende de Phase 3 (precisa do APK instalado); pode rodar em paralelo com US2
- **Phase Final**: Depende das user stories desejadas estarem completas

### Dentro da Phase 1

- T002, T003, T004 podem rodar em paralelo (arquivos diferentes)
- T001 deve ser o primeiro

### Dentro da Phase 2

- T005 → T006 (converter SVG para PNG)
- T007 pode rodar em paralelo com T005/T006
- T008 depende de T001 e T007
- T009 depende de T006 e T008
- T010 depende de T007, T008 e T009

### Oportunidades de paralelismo

- T002, T003, T004 em paralelo (Phase 1)
- T005/T006 em paralelo com T007 (Phase 2, mas T008 precisa de ambos)
- US2 e US3 podem começar em paralelo assim que US1 estiver completa (APK instalado)
- T024 e T025 em paralelo (Phase Final)

---

## Parallel Example: Phase 1

```bash
# Após T001 (npm install), executar em paralelo:
Task T002: "Criar capacitor.config.ts na raiz do projeto"
Task T003: "Ajustar vite.config.ts — base path por env var"
Task T004: "Adicionar script build:android em package.json"
```

## Parallel Example: Phase 2 (início)

```bash
# Podem começar em paralelo:
Task T005+T006: "Criar e converter ícone SVG → PNG"
Task T007:      "npm run build:android — gerar build web Android"
# T008 aguarda ambos finalizarem
```

---

## Implementation Strategy

### MVP (User Story 1 apenas)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational) — crítico
3. Completar Phase 3 (US1) — APK gerado e instalado
4. **PARAR e VALIDAR**: APK funciona? Ícone correto? App abre?
5. Compartilhar `app-debug.apk` — entrega do MVP

### Entrega Incremental

1. Phase 1 + Phase 2 → ambiente Android pronto
2. Phase 3 (US1) → APK instalável com ícone ✅ (MVP!)
3. Phase 4 (US2) → persistência e offline confirmados ✅
4. Phase 5 (US3) → visual em múltiplas telas confirmado ✅

---

## Notes

- [P] = arquivos diferentes, sem dependências entre si
- Tarefas de Phase 3–5 são verificações manuais (per constitution: sem testes automatizados)
- O APK gerado é de **debug** — assinado automaticamente pelo Gradle, instalável via sideload
- Para atualizar o APK após mudanças: `npm run build:android && npx cap sync android && cd android && ./gradlew assembleDebug`
- `android/` gerado pelo Capacitor pode ser volumoso (~50MB) — avaliar inclusão no `.gitignore`
