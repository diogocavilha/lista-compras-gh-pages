# Phase 0 Research: Shopping List Dashboard

**Date**: 2026-04-12  
**Purpose**: Resolve technical clarifications and establish best practices

## Technology Decisions

### TypeScript + React Stack

**Decision**: Use TypeScript 5.x + React 18.x with Vite as build tool  
**Rationale**: 
- TypeScript provides type safety without over-engineering (strongly typed localStorage service)
- React 18 offers hooks-based simplicity and excellent mobile support
- Vite provides fast builds and zero-config GitHub Pages deployment
- Minimal learning curve, excellent developer experience

**Alternatives Considered**:
- Vue 3: Similar capability, chosen React for broader ecosystem
- Next.js: Over-engineered for client-side SPA, doesn't fit "no over-engineering" principle
- Plain JavaScript: Loses type safety, harder to maintain

**Risk Mitigation**: Vite's GitHub Pages setup is well-documented; vite.config.ts includes base path configuration

---

### Chakra UI for Responsive UI

**Decision**: Use Chakra UI v2.x for component library and responsive design  
**Rationale**:
- Built-in responsive design (mobile-first): `flexDir={{ base: 'column', md: 'row' }}`
- Light/dark theme support native via `useColorMode()` hook
- Accessibility (a11y) baked in, reducing manual work
- Small bundle size compared to Material-UI or Bootstrap
- Minimal configuration needed

**Alternatives Considered**:
- Material-UI: Heavier bundle, more components than needed
- Tailwind CSS: Requires more manual configuration, less built-in theme support
- Plain CSS: Verbose, harder to maintain responsive design rules

**Implementation**: Wrap App with `ChakraProvider`, use `useColorMode` hook for theme toggle button, Chakra Box/Stack components for layout

---

### localStorage for Data Persistence

**Decision**: Use browser localStorage API directly via typed service wrapper  
**Rationale**:
- No backend required, fully offline-capable
- Sufficient capacity: ~5-10MB in most browsers (stores dozens of lists)
- Native browser API, zero dependencies
- Adequate performance for analytics calculations
- Simple JSON serialization/deserialization

**Alternatives Considered**:
- IndexedDB: Overkill for this app's data volume, increased complexity
- Web Workers: Not needed, calculations <100ms
- Service Workers/PWA: Possible future enhancement, not MVP

**Risk Mitigation**: 
- Implement storage quota check before saving
- Clear old data option in UI if approaching limit
- Backup/restore feature provides safety net

---

### GitHub Pages Deployment

**Decision**: Build static files with Vite, deploy to GitHub Pages  
**Rationale**:
- No server cost, automatic deployment via GitHub Actions workflow
- Supports custom domain (optional)
- Vite build: `npm run build` produces static files ready for GH Pages
- Fast CDN delivery

**Build Process**:
```
vite.config.ts:
- base: '/shopping-list/' (if deploying to org/repo path)
- build: { outDir: 'dist' }
npm run build outputs to dist/
GitHub Actions: Deploy dist/ to gh-pages branch
```

**Alternatives Considered**:
- Netlify: More features than needed, adds platform lock-in
- Vercel: Same as Netlify
- Self-hosted: Manual deployment, more ops burden

---

### Manual Testing vs Automated Tests

**Decision**: No automated testing frameworks per project constitution  
**Rationale**: Constitution explicitly forbids automated testing; focus on:
- Code review before merge (peer verification)
- Manual testing of critical paths (creating list, checking items, viewing dashboard)
- Documentation of edge cases in code comments
- Logical simplicity reduces bug surface area

**Testing Approach**:
1. Reviewer manually tests: create list → add items → check items → view dashboard
2. Verify localStorage persistence across refresh
3. Verify backup/restore works end-to-end
4. Verify theme toggle persists across sessions
5. Manual responsive design testing on mobile devices

---

### Light/Dark Theme Implementation

**Decision**: Use Chakra UI's `useColorMode()` hook with localStorage persistence  
**Rationale**:
- Chakra handles CSS variables and media query defaults (prefers-color-scheme)
- `useColorMode` hook returns `{ colorMode, toggleColorMode }`
- Persist choice to localStorage so theme survives page reload
- Minimal code: ~5 lines in component

**Implementation**:
```typescript
const { colorMode, toggleColorMode } = useColorMode();
localStorage.setItem('chakra-ui-color-mode', colorMode);
```

---

## Build & Deployment

### Vite Configuration for GitHub Pages

```typescript
// vite.config.ts
export default {
  base: '/shopping-list/',  // Adjust if deploying to custom path
  build: {
    outDir: 'dist',
    minify: 'terser'
  }
}
```

**GitHub Actions workflow** (`.github/workflows/deploy.yml`):
- Trigger: Push to main branch
- Steps: `npm install` → `npm run build` → Deploy `dist/` to gh-pages branch

---

## Performance Baseline

- **Page Load**: <1s (Vite's instant module replacement + small bundle)
- **Dashboard Metrics**: <500ms (array calculations on ~50 lists max)
- **localStorage Access**: ~1-5ms (native API)
- **Animations**: 60fps (CSS-in-JS via Chakra)

---

## Dependencies Summary

**Minimal Stack** (per constitution requirement):
- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `@chakra-ui/react`: ^2.x
- `@emotion/react`: ^11.x (Chakra dependency)
- `@emotion/styled`: ^11.x (Chakra dependency)
- `typescript`: ^5.x
- `vite`: ^5.x

**Dev Dependencies**:
- `@vitejs/plugin-react`: Fast refresh
- `typescript`: Type checking

**Total bundle size (gzipped)**: ~100-150KB (acceptable for SPA)

---

## Data Persistence Strategy

**localStorage Schema** (JSON serialized):
```json
{
  "activeList": {
    "createdAt": "2026-04-12T10:30:00Z",
    "items": [
      { "id": "uuid", "title": "Milk", "completed": true, "completedAt": "2026-04-12T10:45:00Z" },
      { "id": "uuid", "title": "Bread", "completed": false, "completedAt": null }
    ]
  },
  "completedLists": [
    {
      "createdAt": "2026-04-11T09:00:00Z",
      "completedAt": "2026-04-11T09:45:00Z",
      "durationMs": 2700000,
      "itemCount": 12
    }
  ]
}
```

**Total storage per session**: ~50 completed lists × 5KB avg per list = 250KB (well under 5MB limit)

---

## Conclusion

All clarifications resolved. Stack is minimal, focused, and aligns with constitution principles:
- ✅ Clean code (TypeScript + React best practices)
- ✅ No over-engineering (Chakra + localStorage only, no Redux/GraphQL/etc)
- ✅ Small scope (single SPA, single tab)
- ✅ Manual testing (no automated test frameworks)

Ready for Phase 1: Data Model & Design.
