# Data Model: Android APK Build

## Entidades existentes (sem alteração)

Todas as entidades de domínio da aplicação permanecem intactas. O empacotamento Android não altera o modelo de dados.

| Entidade | Armazenamento | Observação |
|----------|--------------|------------|
| `ShoppingList` | `localStorage` (WebView) | Inalterada |
| `ListItem` | `localStorage` (WebView) | Inalterada |
| `CompletedList` | `localStorage` (WebView) | Inalterada |
| `StorageSchema` | `localStorage` (WebView) | Chave: `shopping-list-data` |

## Novos artefatos de configuração

### `capacitor.config.ts` (raiz do projeto)

```
appId:       "com.diogocavilha.listacompras"
appName:     "Lista de Compras"
webDir:      "build"
server.url:  (ausente — usa assets locais, modo offline)
```

### `android/` (gerado por Capacitor)

```
android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml   — permissões, minSdkVersion=26, targetSdk=34
│   │   ├── assets/public/        — cópia do build Vite (sync'd por cap sync)
│   │   └── res/
│   │       ├── mipmap-mdpi/      — ic_launcher.png (48px), ic_launcher_round.png
│   │       ├── mipmap-hdpi/      — ic_launcher.png (72px)
│   │       ├── mipmap-xhdpi/     — ic_launcher.png (96px)
│   │       ├── mipmap-xxhdpi/    — ic_launcher.png (144px)
│   │       └── mipmap-xxxhdpi/   — ic_launcher.png (192px)
│   └── build.gradle              — minSdk=26, targetSdk=34, versionCode/Name
├── build.gradle
├── gradle/
└── gradlew                       — Gradle Wrapper (não requer instalação do Gradle)
```

### `assets/icon/` (criado manualmente)

```
assets/
└── icon/
    └── icon.png    — 1024×1024px, shopping cart, fundo verde (#4CAF50), ícone branco
```

Gerado por `@capacitor/assets` a partir de `icon.png`:
- Todos os tamanhos de `mipmap-*`
- `ic_launcher_foreground.png` (adaptive icon foreground)
- `ic_launcher_background.xml` (adaptive icon background color)

## Mudanças em arquivos existentes

| Arquivo | Mudança |
|---------|---------|
| `vite.config.ts` | Adicionar leitura de `process.env.BUILD_TARGET`: se `android`, `base = '/'`; senão `base = '/lista-compras-gh-pages/'` |
| `package.json` | Adicionar script `"build:android": "BUILD_TARGET=android tsc && vite build"` |

## O que NÃO muda

- `src/` inteiro — zero alterações no código da aplicação
- `src/services/storageService.ts` — `localStorage` funciona nativamente na WebView Android
- `src/types/index.ts` — entidades de domínio inalteradas
- Deploy para GitHub Pages — continua funcionando com `npm run build`
