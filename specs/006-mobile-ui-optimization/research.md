# Research: Otimização da Interface para Mobile (MUI Migration)

## Dependency Changes

### Decision: Replace Chakra UI with Material UI v6
- **Remove**: `@chakra-ui/react`, `@chakra-ui/icons` (devDep), `framer-motion`
- **Add**: `@mui/material`, `@mui/icons-material`
- **Keep**: `@emotion/react`, `@emotion/styled` (MUI v6 still uses Emotion)
- **Rationale**: MUI v6 is the latest stable release with first-class TypeScript support and comprehensive mobile-ready components. Emotion is already installed.

---

## Navigation

### Decision: Replace Tab bar with MUI `BottomNavigation`
- **Rationale**: `Tabs` positioned at the top of the screen is a desktop pattern. `BottomNavigation` is the Material Design standard for mobile apps with 3–5 sections. It keeps navigation within thumb reach and leaves the top clear for content.
- **Alternatives considered**: Keeping top tabs (rejected — poor mobile ergonomics), Drawer/hamburger (rejected — hides navigation, increases interaction cost for primary flows).
- **Structure**: `BottomNavigation` fixed at bottom; page content fills the remaining viewport height with `padding-bottom` to avoid overlap.

---

## Primary Action: Add Item

### Decision: FAB (`Fab`) fixed bottom-right + `Dialog` popup
- **Rationale**: The Floating Action Button is the Material Design canonical pattern for the primary action in a screen. A `Dialog` with a `TextField` provides a focused input experience that correctly handles mobile virtual keyboard (the Dialog scrolls/repositions automatically).
- **Alternatives considered**: Inline form always visible (rejected — wastes screen space, pushes list down), Bottom sheet (more complex, not needed for a single input field).

---

## Long Press → Drag to Trash

### Decision: Custom `useLongPress` hook + touch-based drag with floating trash zone
- **Rationale**: No additional dependency. The constitution explicitly requires no over-engineering and no unnecessary libraries.
- **Implementation approach**:
  1. `useLongPress(callback, { threshold: 1000 })` — fires after 1 second hold via `setTimeout` on `touchstart`/`mousedown`. Cancels on move or release.
  2. On long press: item enters "drag mode" (visual cue — slight scale + shadow elevation). A floating trash zone (`Fab` with `DeleteIcon`, positioned bottom-center) fades into view.
  3. During drag (`touchmove`/`mousemove`): item follows the pointer via CSS `transform: translate()` on the DOM element.
  4. On release (`touchend`/`mouseup`): check if pointer is over the trash zone (via `getBoundingClientRect` hit test). If yes → show MUI `Dialog` confirmation → delete item. If no → animate item back to original position.
- **Alternatives considered**: React DnD or `@dnd-kit` library (rejected — adds 20–40kB for a single gesture), Swipe-to-delete (rejected — user explicitly requested long-press + drag to trash).

---

## Theme / Dark Mode

### Decision: MUI `ThemeProvider` + `createTheme` with `mode` in state, persisted to localStorage
- **Rationale**: Replaces Chakra's `ChakraProvider` + `useColorMode`. MUI's theming system is configuration-based; the mode (`light`/`dark`) is passed to `createTheme({ palette: { mode } })`.
- **`ThemeToggle` component**: Reads persisted mode from `storageService`, toggles state → re-creates theme → `ThemeProvider` re-renders tree with new palette.
- **`CssBaseline`**: MUI's equivalent of a CSS reset; replaces Chakra's style injection.

---

## Confirm Dialogs

### Decision: Replace all `window.confirm()` with MUI `Dialog`
- **Scope**: Three locations — `ListItem.tsx` (delete item), `BackupRestore.tsx` (restore backup, clear all data), `App.tsx` (create new list confirmation).
- **Pattern**: Shared `ConfirmDialog` component accepting `open`, `title`, `message`, `onConfirm`, `onCancel` props.

---

## Screen Layout

### Decision: Main screen shows only the shopping list (or empty state)
- App opens on the "Compras" tab by default.
- No tab headers visible in the content area — navigation lives exclusively in `BottomNavigation`.
- The list area fills the viewport height minus the bottom navigation bar (~56px).
- FAB is positioned `position: fixed; bottom: 72px; right: 16px` (above the bottom nav).

---

## Removed Patterns

- `maxW="600px" mx="auto"` container: replaced with `Container maxWidth="sm"` (MUI equivalent).
- `useToast` (Chakra): replaced with MUI `Snackbar` + `Alert`.
- Chakra `Box`, `VStack`, `HStack`, `Heading`, `Text`, `Button`, `Input`, `Checkbox`, `IconButton`, `Stat`, `Card`, `SimpleGrid` → all replaced with MUI equivalents.
