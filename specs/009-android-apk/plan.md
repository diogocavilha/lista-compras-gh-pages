# Implementation Plan: Android APK Build

**Branch**: `009-android-apk` | **Date**: 2026-04-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-android-apk/spec.md`

## Summary

Empacotar a aplicação React/TypeScript/Vite existente como APK Android nativo usando **Capacitor 7**, sem reescrever código. O `storageService` baseado em `localStorage` funciona sem alterações na WebView Android. O ícone do app será um carrinho de supermercado gerado via `@capacitor/assets`. O resultado final é um arquivo `app-debug.apk` instalável diretamente em dispositivos Android 8.0+.

## Technical Context

**Language/Version**: TypeScript 5.1 / Node.js 20+ (tooling de build)
**Primary Dependencies**: Capacitor 7 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`), `@capacitor/assets`, React 18.2, MUI v9, Vite 5
**Storage**: `localStorage` via WebView Android — sem alterações no `storageService.ts`
**Testing**: Manual — instalar APK em dispositivo/emulador e verificar funcionalidades (per constitution)
**Target Platform**: Android 8.0+ (API 26+), empacotado via Capacitor WebView
**Project Type**: Mobile app (app web existente empacotado como APK nativo)
**Performance Goals**: App startup < 5s (cold launch)
**Constraints**: Offline-capable, sem servidor externo, APK instalável via sideload
**Scale/Scope**: App single-user, dados locais no dispositivo

## Constitution Check

| Princípio | Status | Observação |
|-----------|--------|------------|
| I. Clean Code | ✅ PASS | Capacitor é integrado via config mínima; código da aplicação não é alterado |
| II. Small & Clear Scope | ✅ PASS | Escopo claramente delimitado: empacotar o existente, sem novas features |
| III. No Over-Engineering | ✅ PASS | Capacitor é a solução padrão do mercado para este caso exato; sem abstrações desnecessárias |
| IV. Manual Verification | ✅ PASS | APK verificado manualmente em dispositivo/emulador |

**Gate**: PASSED — pode prosseguir para implementação.

## Project Structure

### Documentation (this feature)

```text
specs/009-android-apk/
├── plan.md          ← este arquivo
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── tasks.md         ← gerado por /speckit-tasks
```

### Source Code (repository root)

```text
/ (raiz do projeto)
├── src/                          (sem alterações)
├── android/                      (gerado por: npx cap add android)
│   ├── app/
│   │   ├── build.gradle          (minSdk=26, targetSdk=34)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── assets/public/    (sync'd por: npx cap sync)
│   │       └── res/
│   │           ├── mipmap-mdpi/
│   │           ├── mipmap-hdpi/
│   │           ├── mipmap-xhdpi/
│   │           ├── mipmap-xxhdpi/
│   │           └── mipmap-xxxhdpi/
│   ├── build.gradle
│   └── gradlew
├── assets/
│   └── icon/
│       └── icon.png              (1024×1024, carrinho de supermercado)
├── capacitor.config.ts           (novo)
├── vite.config.ts                (ajuste: base path por env var)
└── package.json                  (novo script: build:android)
```

**Structure Decision**: Estrutura de projeto único (Option 1). O diretório `android/` gerado pelo Capacitor fica na raiz, padrão da ferramenta.

## Complexity Tracking

> Nenhuma violação identificada na Constitution Check.

## Implementation Steps

### Passo 1 — Instalar Capacitor e ferramentas

```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli @capacitor/assets
```

### Passo 2 — Criar `capacitor.config.ts`

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diogocavilha.listacompras',
  appName: 'Lista de Compras',
  webDir: 'build',
};

export default config;
```

### Passo 3 — Ajustar `vite.config.ts` (base path)

Alterar a linha `base` para:
```typescript
base: process.env.BUILD_TARGET === 'android' ? '/' : '/lista-compras-gh-pages/',
```

### Passo 4 — Adicionar script no `package.json`

```json
"build:android": "BUILD_TARGET=android tsc && vite build"
```

### Passo 5 — Criar ícone do app (carrinho de supermercado)

- Criar `assets/icon/icon.png` (1024×1024) com carrinho de supermercado
- Fundo: verde `#4CAF50`, ícone: branco
- Ver SVG de referência em `quickstart.md`

### Passo 6 — Build inicial e adicionar plataforma Android

```bash
npm run build:android
npx cap add android
```

### Passo 7 — Gerar ícones e sincronizar

```bash
npx capacitor-assets generate --android
npx cap sync android
```

### Passo 8 — Gerar APK

```bash
cd android && ./gradlew assembleDebug
# Saída: android/app/build/outputs/apk/debug/app-debug.apk
```

### Passo 9 — Verificação manual

- Instalar APK em dispositivo Android ou emulador
- Verificar: app abre, ícone de carrinho aparece, listas funcionam, dados persistem após reiniciar app

## Artifacts

| Arquivo | Tipo | Status |
|---------|------|--------|
| [research.md](research.md) | Pesquisa técnica | ✅ Completo |
| [data-model.md](data-model.md) | Modelo de dados e estrutura | ✅ Completo |
| [quickstart.md](quickstart.md) | Guia passo a passo | ✅ Completo |
| tasks.md | Tarefas de implementação | ⏳ Aguarda `/speckit-tasks` |
