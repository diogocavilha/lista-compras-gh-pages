# Quickstart: Gerar APK Android

## Pré-requisitos

Apenas **Node.js 20+** e **Docker** são necessários. Java e Android SDK rodam dentro do container.

1. **Node.js 20+** — `node --version`
2. **Docker** — `docker --version`

---

## Gerar APK (modo recomendado — Docker)

```bash
npm run apk
```

O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

> **Primeira execução**: faz download da imagem base + Android SDK (~1.5GB), leva ~5–10 min.
> Execuções seguintes usam cache Docker e levam ~1 min.

---

## Pré-requisitos (modo sem Docker)

Se preferir buildar sem Docker, instale:

1. **Java 21+** — `java -version`
2. **Android SDK** com `ANDROID_HOME` configurado:
   - Instale via [Android Studio](https://developer.android.com/studio)
   - No Android Studio: SDK Manager → instale "Android 16 (API 36)"
   - Configure: `export ANDROID_HOME=$HOME/Android/Sdk`
   - Adicione ao PATH: `export PATH=$PATH:$ANDROID_HOME/platform-tools`
3. **Verificar setup**: `npx cap doctor`

---

## Setup inicial (primeira vez apenas)

```bash
# 1. Instalar dependências do Capacitor
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli @capacitor/assets

# 2. Criar o ícone fonte (carrinho de supermercado)
mkdir -p assets/icon
# → Coloque o arquivo icon.png (1024×1024) em assets/icon/icon.png
# → Veja a seção "Criando o ícone" abaixo

# 3. Criar capacitor.config.ts na raiz (veja conteúdo abaixo)

# 4. Build web para Android
npm run build:android

# 5. Adicionar plataforma Android
npx cap add android

# 6. Gerar ícones automaticamente
npx capacitor-assets generate --android

# 7. Sincronizar assets web com o projeto Android
npx cap sync android
```

---

## Gerando o APK

```bash
# Build web (necessário antes de cada geração de APK)
npm run build:android

# Sincronizar com o projeto Android
npx cap sync android

# Gerar APK de debug
cd android
./gradlew assembleDebug

# O APK estará em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Instalando no dispositivo

**Via ADB (dispositivo conectado via USB com depuração USB ativada):**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Via transferência manual:**
1. Copie `app-debug.apk` para o celular (via cabo, Google Drive, WhatsApp, etc.)
2. No Android: Configurações → Segurança → ativar "Fontes desconhecidas" (ou "Instalar apps desconhecidos")
3. Abra o arquivo APK no gerenciador de arquivos e instale

---

## Criando o ícone (carrinho de supermercado)

Salve o SVG abaixo como `assets/icon/icon.svg` e converta para PNG 1024×1024:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" rx="200" fill="#4CAF50"/>
  <path fill="white" d="M200 256h80l120 400h360l80-280H380l-20-72H200zm160 460a60 60 0 1 0 120 0 60 60 0 0 0-120 0zm300 0a60 60 0 1 0 120 0 60 60 0 0 0-120 0z"/>
</svg>
```

**Conversão SVG → PNG com Inkscape:**
```bash
inkscape assets/icon/icon.svg --export-png=assets/icon/icon.png --export-width=1024 --export-height=1024
```

**Ou com ImageMagick:**
```bash
convert -background none assets/icon/icon.svg -resize 1024x1024 assets/icon/icon.png
```

---

## Conteúdo do `capacitor.config.ts`

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diogocavilha.listacompras',
  appName: 'Lista de Compras',
  webDir: 'build',
};

export default config;
```

---

## Comandos úteis

| Comando | Descrição |
|---------|-----------|
| `npx cap doctor` | Verifica se o ambiente está configurado corretamente |
| `npx cap sync android` | Sincroniza web assets para o Android (após cada build web) |
| `npx cap open android` | Abre o projeto no Android Studio |
| `./gradlew assembleDebug` | Gera APK de debug (em `android/`) |
| `./gradlew assembleRelease` | Gera APK de release (requer keystore) |
| `adb devices` | Lista dispositivos Android conectados |
| `adb install app-debug.apk` | Instala APK via ADB |

---

## Fluxo de atualização (após mudanças no código)

```bash
npm run build:android   # Rebuild web
npx cap sync android    # Sincronizar com Android
cd android && ./gradlew assembleDebug   # Gerar novo APK
```
