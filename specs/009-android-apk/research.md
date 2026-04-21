# Research: Android APK Build

## Decision 1: Ferramenta de empacotamento — Capacitor

- **Decision**: Usar **Capacitor 7** (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
- **Rationale**: Capacitor envolve o app web existente (React/Vite) numa WebView nativa Android sem reescrever nenhum código. É mantido pela Ionic, tem suporte de primeira classe a Vite, e é a abordagem padrão do mercado para este cenário exato. Não requer Android Studio — pode gerar APK via linha de comando com o Gradle Wrapper incluído.
- **Alternatives considered**:
  - **Cordova**: Mais antigo, menos mantido, CLI mais complexo. Descartado.
  - **React Native**: Exigiria reescrita completa da UI. Muito fora do escopo.
  - **PWA/TWA (Trusted Web Activity)**: Não gera APK standalone, depende do Chrome instalado. Não cumpre o requisito de "app nativo instalável".

## Decision 2: Compatibilidade do `localStorage`

- **Decision**: `storageService.ts` permanece **sem alterações**.
- **Rationale**: A WebView do Android (baseada em Chromium) suporta `localStorage` nativamente. Os dados são persistidos na sandbox do app no dispositivo. Nenhuma migração para `@capacitor/preferences` é necessária.

## Decision 3: Ajuste do `base` path do Vite

- **Decision**: Adicionar variável de ambiente `BUILD_TARGET=android` que troca o `base` de `/lista-compras-gh-pages/` para `/` no `vite.config.ts`. Adicionar script `build:android` no `package.json`.
- **Rationale**: Capacitor serve os arquivos estáticos via `file://` ou `http://localhost`, e o path base `/lista-compras-gh-pages/` quebraria o carregamento dos assets. A troca via env var preserva o deploy existente no GitHub Pages sem duplicar config.
- **Alternatives considered**:
  - Arquivo `vite.config.android.ts` separado: mais arquivos sem ganho real.
  - Hardcode `base: '/'`: quebraria o deploy no GitHub Pages.

## Decision 4: Ícone do app — shopping cart

- **Decision**: Criar imagem fonte `assets/icon/icon.png` (1024×1024) com ícone de carrinho de supermercado desenhado via SVG exportado para PNG. Usar `@capacitor/assets` para gerar automaticamente todos os tamanhos Android necessários (mipmap-mdpi até mipmap-xxxhdpi) e o adaptive icon.
- **Rationale**: `@capacitor/assets` é a ferramenta oficial do Capacitor para geração de ícones. Evita criar manualmente 10+ arquivos PNG em tamanhos diferentes. Requer apenas uma imagem fonte de 1024×1024.
- **Alternatives considered**:
  - ImageMagick manual: mais passos, mais propenso a erro.
  - Usar ícone padrão do Capacitor: não atende o requisito do usuário.

## Decision 5: Assinatura do APK

- **Decision**: APK assinado com **chave de debug** gerada automaticamente pelo Gradle.
- **Rationale**: Para instalação direta (sideload) com "fontes desconhecidas" habilitadas, a assinatura de debug é suficiente. Sem necessidade de keystore de produção.

## Decision 6: Versão mínima do Android

- **Decision**: `minSdkVersion = 26` (Android 8.0).
- **Rationale**: Cobre ~95% dos dispositivos Android em uso. É o padrão mínimo recomendado pelo Capacitor 7. Abaixo disso haveria problemas com suporte à WebView moderna.

## Decision 7: Pré-requisitos do ambiente de build

- **Decision**: Documentar como pré-requisito obrigatório a instalação do **Android SDK** (via Android Studio ou via SDK standalone) com `ANDROID_HOME` configurado.
- **Rationale**: O Gradle Wrapper do Capacitor precisa encontrar o SDK para compilar o APK. Sem ele, o build falha. Documentar claramente evita confusão.
- **JDK**: Java 17+ requerido pelo Gradle 8.

## Decision 8: Estrutura de diretórios

- **Decision**: O diretório `android/` gerado pelo Capacitor fica na raiz do repositório. Não criar subprojeto separado.
- **Rationale**: Padrão do Capacitor. Mantém simplicidade (constituição: escopo pequeno).
