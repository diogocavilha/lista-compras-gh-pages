# Quickstart: Otimização da Interface para Mobile

## Prerequisites

- Node.js 18+
- npm 9+
- Git (branch `006-mobile-ui-optimization`)

---

## Dependency Changes

### Remove Chakra UI and Framer Motion

```bash
npm uninstall @chakra-ui/react @chakra-ui/icons framer-motion
```

### Install Material UI

```bash
npm install @mui/material @mui/icons-material
```

`@emotion/react` and `@emotion/styled` are already installed and remain as-is.

---

## Dev Server

```bash
npm run dev
```

App runs at `http://localhost:5173` (or next available port).

---

## Build & Deploy

```bash
npm run build     # TypeScript compile + Vite bundle
npm run preview   # Preview production build locally
npm run deploy    # Build + push to gh-pages branch
```

---

## Type Check

```bash
npm run type-check
```

Run this after each component migration to catch import errors early.

---

## File Map: Migration Scope

Every file in this list must be migrated from Chakra UI to MUI:

| File | Chakra imports | Key MUI replacements |
|------|---------------|----------------------|
| `src/main.tsx` | `ChakraProvider` | `ThemeProvider`, `CssBaseline` |
| `src/App.tsx` | `Box`, `Tabs`, `Tab`, `TabList`, `TabPanels`, `TabPanel`, `useToast` | `Box`, `BottomNavigation`, `BottomNavigationAction`, `Snackbar`, `Alert` |
| `src/components/List.tsx` | `Box`, `VStack`, `HStack`, `Input`, `Button`, `Heading`, `Text`, `List`, `ListItem`, `IconButton` | `Box`, `Stack`, `TextField`, `Fab`, `Typography`, `List`, `ListItem`, `Dialog`, `IconButton` |
| `src/components/ListItem.tsx` | `HStack`, `Text`, `Checkbox`, `IconButton` | `Stack`, `Typography`, `Checkbox`, `IconButton` + long-press drag logic |
| `src/components/Dashboard.tsx` | `Box`, `Heading`, `VStack`, `Text`, `Card`, `CardBody`, `SimpleGrid`, `Stat` | `Box`, `Typography`, `Stack`, `Card`, `CardContent`, `Grid` |
| `src/components/ThemeToggle.tsx` | `IconButton`, `useColorMode` | `IconButton` + context-based theme toggle |
| `src/components/BackupRestore.tsx` | `VStack`, `Button`, `Input`, `Text`, `Card`, `CardBody`, `CardHeader`, `Heading`, `Divider` | `Stack`, `Button`, `TextField`, `Typography`, `Card`, `CardContent`, `CardHeader`, `Divider` |

### New files to create

| File | Purpose |
|------|---------|
| `src/components/ConfirmDialog.tsx` | Reusable MUI Dialog for all `window.confirm()` replacements |
| `src/hooks/useLongPress.ts` | Custom hook — fires callback after 1s hold, cancels on move/release |
| `src/context/ThemeContext.tsx` | React context providing `themeMode` + `toggleTheme` to the component tree |

---

## MUI Theme Setup (reference)

```tsx
// src/context/ThemeContext.tsx — structure only, not final code
const theme = createTheme({
  palette: {
    mode: themeMode, // 'light' | 'dark'
    primary: { main: '#1976d2' },
  },
})
```

`CssBaseline` from MUI replaces all global CSS resets previously handled by Chakra.

---

## Verification Checklist (manual, per constitution)

- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` completes without errors
- [ ] App opens on the Compras tab with the list (or empty state message)
- [ ] FAB is visible and tapping it opens the Add Item dialog
- [ ] Pressing Enter or the Add button in the dialog adds the item and closes the dialog
- [ ] Long-pressing an item for 1 second activates drag mode and shows the trash zone
- [ ] Dragging the item over the trash zone and releasing triggers a confirmation dialog
- [ ] Confirming deletion removes the item
- [ ] Bottom navigation switches between Compras, Painel, Configurações correctly
- [ ] Theme toggle switches between light and dark mode and persists on reload
- [ ] No `window.confirm()` or `window.alert()` calls remain in the codebase
- [ ] Layout is correct on 375px wide viewport (no horizontal scroll)
- [ ] All interactive elements have adequate touch target size
