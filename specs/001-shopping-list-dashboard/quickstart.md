# Quickstart Guide: Shopping List Dashboard

**Purpose**: Setup, build, and run the application locally and on GitHub Pages

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- Browser with localStorage support (all modern browsers)
- GitHub account (for Pages deployment)

---

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_GITHUB_ORG/shopping-list-dashboard.git
cd shopping-list-dashboard
npm install
```

**Dependencies installed**:
- React 18.x + React DOM
- Chakra UI 2.x
- Emotion (CSS-in-JS, Chakra dependency)
- TypeScript 5.x
- Vite 5.x

### 2. Start Development Server

```bash
npm run dev
```

**Output**:
```
  VITE v5.x.x  ready in 100 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

**Hot Module Replacement (HMR)**: Changes to `.tsx` files reload instantly without losing app state.

---

## Project Structure

```
src/
├── components/
│   ├── List.tsx              # Active shopping list display
│   ├── ListItem.tsx          # Individual item row
│   ├── Dashboard.tsx         # Analytics dashboard
│   ├── ThemeToggle.tsx       # Light/dark theme button
│   └── BackupRestore.tsx     # Export/import UI
├── services/
│   ├── storageService.ts     # localStorage CRUD
│   ├── analyticsService.ts   # Time calculations
│   └── backupService.ts      # Backup/restore
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main app component
└── index.tsx                 # React entry point

public/
└── index.html                # HTML entry point

vite.config.ts                # Build configuration
package.json
tsconfig.json
```

---

## Key Commands

### Development

```bash
npm run dev          # Start Vite dev server (port 5173)
npm run type-check   # Run TypeScript type checking (optional)
```

### Production Build

```bash
npm run build        # Build static files to dist/
```

**Output** in `dist/`:
```
index.html           # Minified HTML
assets/
├── index-[hash].js  # Bundled + minified React app
└── index-[hash].css # Minified styles
```

### Preview Production Build Locally

```bash
npm run preview       # Serve dist/ locally (simulates GitHub Pages)
```

Open [http://localhost:4173/](http://localhost:4173/) to preview production build.

---

## GitHub Pages Deployment

### 1. Repository Setup

Create repository on GitHub: `YOUR_ORG/shopping-list-dashboard`

```bash
# In your local repo
git remote add origin https://github.com/YOUR_ORG/shopping-list-dashboard.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages Configuration

1. Go to repository **Settings → Pages**
2. **Source**: Select "GitHub Actions"
3. Save

### 3. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 4. Deploy

```bash
npm run build
git add .
git commit -m "build: production build"
git push origin main
```

**GitHub Actions** automatically deploys `dist/` to `https://YOUR_ORG.github.io/shopping-list-dashboard`

Check **Actions** tab to monitor deployment progress.

---

## Vite Configuration for GitHub Pages

**vite.config.ts**:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/shopping-list-dashboard/',  // Adjust if using custom domain
  build: {
    outDir: 'dist',
    minify: 'terser',
  },
})
```

**Note**: If deploying to custom domain, change `base` to `/` or your domain path.

---

## Usage

### Creating a Shopping List

1. Open app
2. Click **"New Shopping List"** or app shows empty state
3. Start typing product names
4. Press **Enter** or click **Add Item**
5. List auto-saves to localStorage

### Tracking Items

1. **Check item**: Click checkbox when you find product
2. **Completion time** auto-records with `HH:MM` timestamp
3. Uncheck to remove timestamp (if needed to fix mistake)

### Dashboard Analytics

1. Click **Dashboard** tab
2. View:
   - **Current Trip**: In-progress list with duration counting up
   - **Recent Trips**: Last 5 completed lists with durations
   - **Average Time**: Mean duration across all completed trips
3. Click any completed trip for details

### Theme Toggle

1. Click **💡 Light/Dark** button (top-right)
2. Theme preference saves to localStorage
3. Persists across sessions

### Backup & Restore

#### Export Backup

1. Click **Settings** → **Backup**
2. Click **Download Backup**
3. File saves as `shopping-list-backup-YYYY-MM-DD.json`

#### Restore from Backup

1. Click **Settings** → **Restore**
2. Click **Choose File** and select `.json` backup
3. Confirm: "This will replace your current data"
4. Data restores immediately

---

## Data Storage

All data stored locally in **browser localStorage**:

```javascript
// Inspect in browser DevTools
localStorage.getItem('shopping-list-data')
// Returns full JSON object
```

**Persistence**:
- Data survives page refresh
- Data survives browser restart
- Data cleared if user clears browser storage (use backup first!)
- Data NOT shared across devices (client-side only)

---

## Troubleshooting

### "List is frozen / can't add items"

- Check browser console for errors
- Verify localStorage is enabled
- Try refreshing page

### "Dark theme doesn't apply"

- Clear browser cache
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Check Chakra UI's color mode in DevTools: `window.__chakra_ui__`

### "Backup file won't restore"

- Verify file is valid JSON (open in text editor)
- Verify backup was created with this app version
- Try exporting a fresh backup and comparing structure

### "Storage full" warning

1. Export current backup
2. Create new list (don't worry, you can restore later)
3. Or delete old completed lists manually in DevTools

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feat/add-item-categories
```

### 2. Make Changes

Edit `.tsx` files in `src/`, save → HMR reloads automatically

### 3. Manual Testing

Test in browser:
- Create list → add items → check items
- View dashboard → check calculations
- Toggle theme → verify persistence
- Export/import backup → verify restore

### 4. Code Review & Commit

```bash
git add .
git commit -m "feat: add item categories to list"
```

Follow these recommendations:
- Keep commits focused on single feature
- Write clear commit messages (what + why)
- Test before submitting PR

### 5. Build & Deploy

```bash
npm run build
npm run preview    # Test production build locally
git push origin feat/add-item-categories
```

Open PR on GitHub, get code review approval, merge to `main`.

GitHub Actions auto-deploys to Pages.

---

## Type Checking

Before committing, verify TypeScript is clean:

```bash
npx tsc --noEmit
```

All `.ts` and `.tsx` files must pass strict mode type checking.

---

## Performance Notes

- **First page load**: ~1 second (small bundle, Vite optimization)
- **Dashboard calculations**: <500ms (array operations on ~50 lists)
- **localStorage access**: ~1-5ms (native browser API)
- **Animations**: 60fps (Chakra CSS-in-JS + browser optimization)

For slower connections, Vite's code splitting ensures critical JS loads first.

---

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers**: iOS Safari 14+, Android Chrome 90+

All modern browsers with localStorage support.

---

## Next Steps

1. **Local development**: `npm run dev`
2. **GitHub Pages**: Follow deployment steps above
3. **Feature development**: Create branches from `main`, follow PR workflow
4. **Monitoring**: Check GitHub Actions for build failures

Happy shopping! 🛒
