# Implementation Plan: Shopping List Dashboard

**Branch**: `001-shopping-list-dashboard` | **Date**: 2026-04-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-shopping-list-dashboard/spec.md`

## Summary

Shopping list management application (todo-style) with time-tracking analytics dashboard. Users create one active shopping list per session, add items with product names, check them off as completed (with automatic timestamps), and view historical analytics showing time spent per trip and average shopping duration. Fully offline with localStorage persistence and manual backup/restore.

**Tech Stack**: TypeScript + React with minimal dependencies, Chakra UI for responsive mobile-first UI, light/dark theme support, static build for GitHub Pages deployment. No automated tests per project constitution.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x
**Primary Dependencies**: React, React DOM, Chakra UI, TypeScript, Vite (build tool)
**Storage**: Browser localStorage (client-side only, offline-capable)
**Testing**: Manual verification via code review per constitution (no automated test frameworks)
**Target Platform**: Web browser (mobile-responsive), deployed to GitHub Pages as static site
**Project Type**: Single-page application (SPA) / web-app
**Performance Goals**: Page load <1s, dashboard metrics render <500ms, smooth animations at 60fps
**Constraints**: Client-side only (no backend), localStorage capacity ~5-10MB (sufficient for typical usage), full offline capability, zero external API dependencies
**Scale/Scope**: Single user per browser session, ~50 completed lists in typical storage footprint, responsive design from 320px (mobile) to 1920px (desktop)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Clean Code & Good Practices** — React components follow standard patterns, meaningful naming, small focused components
✅ **Small & Clear Scope** — Single-purpose app, no scope creep, localStorage only
✅ **No Over-Engineering** — Minimal dependencies (React, Chakra UI, TypeScript only), no Redux, no unnecessary abstraction layers
✅ **Manual Verification, No Automated Tests** — Project constitution forbids automated testing; manual testing and code review required before merge
✅ **Simplicity** — Mobile-first responsive design, straightforward time-tracking logic, clear localStorage schema

## Project Structure

### Documentation (this feature)

```text
specs/001-shopping-list-dashboard/
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 output - technology research & decisions
├── data-model.md        # Phase 1 output - data structures & schemas
├── quickstart.md        # Phase 1 output - setup & running guide
├── contracts/           # Phase 1 output - API/component contracts (if applicable)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── List.tsx              # Active shopping list component
│   ├── ListItem.tsx          # Individual item entry with checkbox
│   ├── Dashboard.tsx         # Analytics dashboard showing time metrics
│   ├── ThemeToggle.tsx       # Light/dark theme switcher
│   └── BackupRestore.tsx     # Backup export/import UI
├── services/
│   ├── storageService.ts     # localStorage CRUD operations
│   ├── analyticsService.ts   # Time calculations for dashboard
│   └── backupService.ts      # Backup/restore file handling
├── types/
│   └── index.ts              # TypeScript interfaces (ShoppingList, ListItem, etc.)
├── App.tsx                   # Main app component with routing (if needed)
├── App.css                   # Global styles (minimal)
└── index.tsx                 # React entry point

public/
├── index.html                # Single HTML entry point
└── manifest.json             # PWA manifest (optional)

package.json                  # Dependencies: React, Chakra UI, TypeScript, Vite
tsconfig.json                 # TypeScript configuration
vite.config.ts                # Vite build config for GitHub Pages
```

**Structure Decision**: Single-page application (SPA) with client-side routing via Chakra UI Tabs/navigation. No backend, no server-side rendering. All state persisted to localStorage. Build process: `npm run build` generates static files for GitHub Pages deployment. Components organized by domain (List, Dashboard, UI), services handle logic (storage, analytics, backup).

## Complexity Tracking

✅ **No violations** — Constitution requirements all met. Simple, focused scope with minimal dependencies.

---

## Phase 0 & Phase 1 Completion Summary

### Phase 0: Research ✅ COMPLETE

**Output**: [research.md](research.md)

**Resolved Clarifications**:
- ✅ Technology stack: TypeScript + React 18 + Chakra UI + Vite
- ✅ Deployment: GitHub Pages with static build
- ✅ Data persistence: localStorage with single JSON root
- ✅ Responsive design: Mobile-first Chakra UI components
- ✅ Theme support: Light/dark via Chakra useColorMode hook
- ✅ Testing approach: Manual verification per constitution (no automated tests)

**Key Decisions**:
- Chakra UI chosen for responsive design and native light/dark theme support
- Vite for rapid builds and zero-config GitHub Pages deployment
- No backend, full client-side offline operation
- localStorage wrapper service for type-safe persistence
- Analytics calculations via pure utility functions (<500ms performance)

---

### Phase 1: Design & Contracts ✅ COMPLETE

**Output Files**:
- [data-model.md](data-model.md) — Entity definitions, TypeScript interfaces, localStorage schema
- [quickstart.md](quickstart.md) — Development setup, build process, GitHub Pages deployment
- [contracts/storageService.md](contracts/storageService.md) — API contract for localStorage wrapper
- [contracts/analyticsService.md](contracts/analyticsService.md) — API contract for time calculations
- [contracts/ListComponent.md](contracts/ListComponent.md) — React component contract and behavior

**Design Artifacts**:

1. **Data Model**:
   - ShoppingList (active list, immutable createdAt as identifier)
   - ListItem (title, completed status, timestamp)
   - CompletedList (archive with pre-calculated duration)
   - StorageSchema (root object with activeList + completedLists arrays)

2. **Component Architecture**:
   - List: Main shopping interface (add/check items)
   - ListItem: Individual item display with checkbox
   - Dashboard: Analytics showing durations and averages
   - ThemeToggle: Light/dark theme button
   - BackupRestore: Export/import UI

3. **Service Layer**:
   - StorageService: typed localStorage get/set with quota management
   - AnalyticsService: duration calculations, formatting, statistics
   - BackupService: JSON export/import file handling

4. **Build & Deployment**:
   - Vite configuration with GitHub Pages base path
   - GitHub Actions workflow for auto-deploy on push to main
   - npm scripts: dev, build, preview

**Constitution Check (Re-evaluated)**:
- ✅ Clean Code: Typed components, named services, simple compositions
- ✅ Small Scope: Single-purpose SPA, no feature creep
- ✅ No Over-Engineering: React + Chakra only (no Redux, Router, etc.)
- ✅ Manual Testing: No test frameworks; code review + manual verification approach documented
- ✅ Simplicity: Clear data flow, localStorage-only persistence, <500ms metrics calculation

---

## Agent Context Update

Run the following to update AI agent context files with this design:

```bash
./.specify/integrations/copilot/scripts/update-context.sh copilot
```

**Context Added**:
- Technology: TypeScript 5.x, React 18.x, Chakra UI 2.x, Vite 5.x
- Architecture: Client-side SPA, localStorage persistence
- Key services: storageService, analyticsService, backupService
- Component structure: List, ListItem, Dashboard, ThemeToggle, BackupRestore
- Build target: GitHub Pages (static deployment)
- Testing approach: Manual only (no automated tests per constitution)

---

## Ready for Phase 2

All design decisions made. No blockers for implementation.

**Next Command**: `speckit.tasks` to generate actionable tasks from this plan.

**Estimated Implementation Timeline**:
- Setup & Project init: 30 minutes
- Core components (List, Dashboard): 4 hours
- Services (Storage, Analytics, Backup): 2 hours
- Responsive design & theme toggle: 2 hours
- GitHub Pages setup & build: 1 hour
- **Total**: ~9-10 hours of focused development

Total feature size: ~1-1.5K lines of TypeScript/TSX code (small, maintainable codebase)

