# Implementation Tasks: Shopping List Dashboard

**Feature**: Shopping List Dashboard | **Branch**: `001-shopping-list-dashboard`  
**Date Generated**: 2026-04-12 | **Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

**Estimated Implementation**: 9-10 hours  
**Bundle Size**: 1-1.5K lines of TypeScript/TSX

---

## Phase Overview

| Phase | Focus | User Stories | Estimated Time |
|-------|-------|--------------|-----------------|
| **Phase 1** | Setup & Project Init | - | 30 min |
| **Phase 2** | Foundational (Core Data & Services) | - | 2 hours |
| **Phase 3** | US1: Create & Manage List | P1 | 1.5 hours |
| **Phase 4** | US2: Mark Items Complete | P1 | 1.5 hours |
| **Phase 5** | US3: View Analytics Dashboard | P1 | 2 hours |
| **Phase 6** | US4: Backup & Restore | P2 | 1 hour |
| **Phase 7** | Polish: Theme & Responsive | - | 1 hour |
| **Phase 8** | Polish: GitHub Pages Deployment | - | 1 hour |

---

## Phase 1: Setup & Project Initialization

**Goal**: Establish project structure, install dependencies, configure build tools  
**Independent Test**: `npm install` succeeds, `npm run dev` starts dev server, `npm run build` generates dist/

### Tasks

- [ ] T001 Create `package.json` with React 18, Chakra UI, TypeScript 5, Vite dependencies
- [ ] T002 Create `tsconfig.json` with strict mode enabled, React JSX configuration
- [ ] T003 Create `vite.config.ts` with base path for GitHub Pages (`/shopping-list-dashboard/`)
- [ ] T004 [P] Create `.gitignore` with node_modules/, dist/, .env
- [ ] T005 [P] Create `public/index.html` HTML entry point with meta tags and app root div
- [ ] T006 Run `npm install` to fetch all dependencies
- [ ] T007 Create `src/index.tsx` React entry point rendering App component to root element
- [ ] T008 [P] Create `.env.example` with any environment variables (if needed)
- [ ] T009 Create initial `src/App.tsx` stub component to verify setup works
- [ ] T010 Test: `npm run dev` launches dev server on http://localhost:5173/ with App component
- [ ] T011 Test: `npm run build` generates dist/ directory with minified assets
- [ ] T012 [P] Create `src/App.css` with minimal global styles (Chakra handles component styling)

---

## Phase 2: Foundational Infrastructure

**Goal**: Core data types, Chakra UI setup, storage and analytics services  
**Independent Test**: TypeScript compiles cleanly, storageService CRUD works, analytics calculations verified in console

### Tasks

- [ ] T013 [P] Create `src/types/index.ts` with TypeScript interfaces:
  - ListItem (id, title, completed, completedAt, createdAt)
  - ShoppingList (createdAt, items, status)
  - CompletedList (id, createdAt, completedAt, durationMs, itemCount)
  - StorageSchema (activeList, completedLists, theme)

- [ ] T014 Create `src/services/storageService.ts` with functions:
  - getActiveList() → ShoppingList | null
  - setActiveList(list: ShoppingList | null) → void
  - getCompletedLists() → CompletedList[]
  - addCompletedList(list: CompletedList) → void
  - deleteCompletedList(id: string) → void
  - getTheme() → 'light' | 'dark'
  - setTheme(theme: 'light' | 'dark') → void
  - All using localStorage key `shopping-list-data`

- [ ] T015 Create `src/services/analyticsService.ts` with functions:
  - calculateListDuration(startTime: string, endTime: string) → number (ms)
  - formatDuration(durationMs: number) → string ("15 minutes", "1 hour 20 min")
  - calculateAverageDuration(lists: CompletedList[]) → number
  - calculateCompletionPercent(items: ListItem[]) → number (0-100)
  - getRecentTrips(lists: CompletedList[], limit: number) → CompletedList[]
  - getDashboardStats(lists: CompletedList[]) → DashboardStats object

- [ ] T016 Create `src/services/backupService.ts` with functions:
  - exportBackup() → JSON string of full StorageSchema
  - importBackup(jsonString: string) → StorageSchema (with validation)
  - downloadBackupFile(data: string) → triggers browser download as shopping-list-backup-YYYY-MM-DD.json
  - parseBackupFile(file: File) → Promise<StorageSchema> (file input parsing)

- [ ] T017 Set up Chakra UI in `src/main.tsx` or `src/App.tsx`:
  - Import ChakraProvider
  - Wrap App component in ChakraProvider
  - Test: Colors are available, theme mode provider is active

- [ ] T018 Create `src/components/index.ts` barrel export for all components (for cleaner imports)

- [ ] T019 Test: TypeScript compilation passes without errors
- [ ] T020 Test: All service functions are type-safe and callable from App
- [ ] T021 [P] Create `tsconfig.strict.json` for development type checking if needed

---

## Phase 3: User Story 1 - Create & Manage Shopping List (P1)

**Goal**: Users can create a shopping list, add items, and persistence works  
**Independent Test**: Create list → add 3 items → refresh page → verify all items appear

### Acceptance Scenarios Met

1. **Given** no active list exists, **When** user opens app, **Then** see "Create New Shopping List" button
2. **Given** active list, **When** user enters product name and adds item, **Then** item appears immediately
3. **Given** list with items, **When** user refreshes page, **Then** all items persist
4. **Given** active list, **When** user views list, **Then** item shows title, unchecked checkbox, no completion time

### Tasks

- [ ] T022 [US1] [P] Create `src/components/List.tsx` component:
  - Props: list (ShoppingList | null), onAddItem, onToggleItem, onDeleteItem, onCreateNewList callbacks
  - Render: Empty state with "Create New Shopping List" button if no list
  - Render: List metadata (created date in "Today, 10:30 AM" format)
  - Render: Item count ("X items, Y completed")
  - Render: Text input for product name + "Add Item" button
  - Render: Item list with checkboxes (via ListItem component)

- [ ] T023 [US1] [P] Create `src/components/ListItem.tsx` component:
  - Props: item (ListItem), onToggleItem, onDeleteItem callbacks
  - Render: Checkbox (left aligned)
  - Render: Product title
  - Render: Completion timestamp if completed (e.g., "10:35 AM")
  - Render: Delete button (trash icon, Chakra IconButton)
  - Styling: Strikethrough if completed, fade effect

- [ ] T024 [US1] Create `src/App.tsx` main app component:
  - State: activeList (from localStorage via storageService)
  - State: completedLists (from localStorage via storageService)
  - Event handlers: handleCreateNewList, handleAddItem, handleToggleItem, handleDeleteItem
  - Render: List component with all props passed

- [ ] T025 [US1] Implement `handleCreateNewList()`:
  - If activeList exists: Show confirmation dialog "Replace current list?"
  - Create new ShoppingList with createdAt = now, items = [], status = 'active'
  - Call setActiveList(newList) to persist
  - Update component state

- [ ] T026 [US1] Implement `handleAddItem(title: string)`:
  - Validate: title non-empty, ≤200 chars
  - Validate: title not duplicate in current list (show error toast if duplicate)
  - Create ListItem with generated UUID, title, completed=false, createdAt=now
  - Add to activeList.items array
  - Call setActiveList(updatedList) to persist
  - Clear input field, keep focus in input for next item

- [ ] T027 [US1] Implement `handleDeleteItem(itemId: string)`:
  - Show confirmation dialog "Remove this item?"
  - Remove item from activeList.items
  - Call setActiveList(updatedList) to persist
  - If all items deleted, list remains but shows empty state (no auto-delete list)

- [ ] T028 [US1] [P] Integrate storageService:
  - On App mount: Load activeList from getActiveList(), load completedLists from getCompletedLists()
  - On activeList change: Save to localStorage via setActiveList()
  - On completedList change: Save to localStorage via addCompletedList()

- [ ] T029 [US1] [P] Style List component with Chakra UI:
  - Use Box, VStack, HStack for layout
  - Use Input for text field (placeholder: "Enter product name...")
  - Use Button for "Add Item"
  - Use Heading for list metadata
  - Responsive: Full width on mobile, max-width 600px on desktop

- [ ] T030 [US1] [P] Style ListItem component with Chakra UI:
  - Use HStack for item row layout
  - Use Checkbox (native HTML or Chakra)
  - Use Text for title (with strikethrough if completed)
  - Use IconButton for delete (trash icon from @chakra-ui/icons)
  - Show completion time next to title

- [ ] T031 [US1] Test: Create new list → see empty state with button
- [ ] T032 [US1] Test: Click "Add Item" → enter "Milk" → press Enter → item appears in list
- [ ] T033 [US1] Test: Add 5 items → refresh page → all 5 items still there with same titles
- [ ] T034 [US1] Test: Delete middle item → item disappears, list auto-saves
- [ ] T035 [US1] Test: Try adding duplicate item → see error message
- [ ] T036 [US1] Test: Try adding empty item → see error message
- [ ] T037 [US1] Test: Input field stays focused after adding item (UX enhancement)

---

## Phase 4: User Story 2 - Mark Items Complete with Timestamps (P1)

**Goal**: Users can check items off and see completion times; lists auto-archive when complete  
**Independent Test**: Create list → check all items → verify list archives with duration calculated

### Acceptance Scenarios Met

1. **Given** item in list, **When** click checkbox, **Then** marked completed with exact date/time showing
2. **Given** completed item, **When** uncheck, **Then** completion status removed, timestamp cleared
3. **Given** items completed at different times, **When** all checked, **Then** final completion time is last item's timestamp

### Tasks

- [ ] T038 [US2] Implement `handleToggleItem(itemId: string)`:
  - Find item in activeList.items
  - Toggle completed flag: completed = !item.completed
  - If completed becomes true: Set completedAt = now (ISO string)
  - If completed becomes false: Set completedAt = null
  - Call setActiveList(updatedList) to persist
  - Check if all items now completed: if so, call archiveCompletedList()

- [ ] T039 [US2] Implement `archiveCompletedList()`:
  - Calculate durationMs = Date.parse(lastItemCompletedAt) - Date.parse(list.createdAt)
  - Create CompletedList with id=UUID, createdAt, completedAt=lastItemTime, durationMs, itemCount
  - Call addCompletedList(completedList) to archive
  - Clear activeList: setActiveList(null)
  - Show toast: "List complete! Shopping trip: 45 minutes" (use analytics service to format)

- [ ] T040 [US2] Update List component to display completion times:
  - In ListItem: Show formatted completion time if item.completedAt exists
  - Format time: Just HH:MM AM/PM or full datetime depending on UI space
  - Show next to title or in separate column

- [ ] T041 [US2] [P] Add visual feedback for completion:
  - Item title: Strikethrough or fade color when completed
  - Checkbox: Show checked state
  - Item row: Subtle background color change

- [ ] T042 [US2] [P] Add toast notifications:
  - On item completion: "Item completed at 10:35 AM"
  - On list completion: "List complete! Shopping trip: 45 minutes"
  - Use Chakra useToast hook

- [ ] T043 [US2] Test: Create list, add 3 items → check 1st item → timestamp appears
- [ ] T044 [US2] Test: Uncheck item → timestamp disappears
- [ ] T045 [US2] Test: Check all 3 items → list archives, toast shows duration, new empty List state appears
- [ ] T046 [US2] Test: Check items slowly (1 sec apart) → verify each has correct timestamp
- [ ] T047 [US2] Test: Rapidly click checkbox → verify only final state matters (no duplicate timestamps)

---

## Phase 5: User Story 3 - View Shopping Time Analytics (P1)

**Goal**: Users see dashboard with trip durations, averages, and current progress  
**Independent Test**: Complete 2 lists with different durations → Dashboard shows both plus average

### Acceptance Scenarios Met

1. **Given** completed list, **When** navigate to dashboard, **Then** see list's start date + total time
2. **Given** multiple completed lists, **When** view dashboard, **Then** see average time across all trips
3. **Given** incomplete active list, **When** view dashboard, **Then** shows in-progress (doesn't count toward average)

### Tasks

- [ ] T048 [US3] [P] Create `src/components/Dashboard.tsx` component:
  - Props: activeList (ShoppingList | null), completedLists (CompletedList[])
  - Render: Tab or section layout via Chakra Tabs component
  - Sections: "Current Trip", "Recent Trips", "Statistics"

- [ ] T049 [US3] [P] Implement "Current Trip" section in Dashboard:
  - If no activeList: Show "No trip in progress"
  - If activeList: Show
    - Start date/time (e.g., "Today, 10:30 AM")
    - Items count and completion %
    - Current elapsed time (updates every second)
    - Chakra Progress Bar showing completion %

- [ ] T050 [US3] [P] Implement "Recent Trips" section in Dashboard:
  - Use getRecentTrips(completedLists, 5) to get 5 most recent
  - Render table or list:
    - Date started (e.g., "April 11, 9:00 AM")
    - Duration (e.g., "45 minutes", "1 hour 20 min")
    - Items count
    - [Optional] Click to expand details

- [ ] T051 [US3] [P] Implement "Statistics" section in Dashboard:
  - Use getDashboardStats(completedLists)
  - Display:
    - Total trips: X
    - Average duration: formatDuration(avg)
    - Shortest trip: formatDuration + date
    - Longest trip: formatDuration + date
    - Average items per trip: Y

- [ ] T052 [US3] Create main app navigation (tabs or buttons):
  - Tab 1: "Shopping" → List component
  - Tab 2: "Dashboard" → Dashboard component
  - Tab 3: "Settings" → [Placeholder for Theme Toggle + Backup/Restore]

- [ ] T053 [US3] [P] Style Dashboard with Chakra UI:
  - Use Tabs component with tab panels
  - Use Card component for trip entries
  - Use VStack/HStack for layout
  - Use Stat component for statistics (if available in Chakra)
  - Responsive: Stack vertically on mobile, side-by-side on desktop

- [ ] T054 [US3] Test: Complete 1 list (1 hour), then complete another (30 min) → Dashboard shows avg 45 min
- [ ] T055 [US3] Test: View Dashboard with 5+ completed lists → Recent Trips shows all
- [ ] T056 [US3] Test: Create new list → Current Trip shows elapsed time updating
- [ ] T057 [US3] Test: Delete active list (create new) → Current Trip updates to new list
- [ ] T058 [US3] Test: Time formatting works correctly:
  - 30 seconds → "30 seconds"
  - 15 minutes → "15 minutes"
  - 1 hour 20 minutes → "1 hour 20 minutes"

---

## Phase 6: User Story 4 - Backup & Restore Data (P2)

**Goal**: Users can export backup and restore from file  
**Independent Test**: Export data → Clear localStorage → Import file → Data fully restored

### Acceptance Scenarios Met

1. **Given** lists in localStorage, **When** click "Backup", **Then** download backup file
2. **Given** backup file, **When** click "Restore" and select file, **Then** all lists restored
3. **Given** existing lists, **When** restore backup, **Then** prompted to confirm (prevent overwrite)

### Tasks

- [ ] T059 [US4] [P] Create `src/components/BackupRestore.tsx` component:
  - Place in Settings section (Tab 3)
  - Render: Two sections - "Backup" and "Restore"
  - Backup: Button "Download Backup"
  - Restore: File input + "Restore Data" button

- [ ] T059a [US4] Implement backup download:
  - Call exportBackup() from backupService
  - Get full StorageSchema as JSON string
  - Call downloadBackupFile(data) to trigger browser download
  - File name: `shopping-list-backup-2026-04-12.json`
  - Show toast: "Backup downloaded"

- [ ] T060 [US4] Implement restore upload:
  - File input onChange event → get File object
  - Call parseBackupFile(file) from backupService
  - Validate JSON and structure
  - If activeList exists: Show confirmation "This will replace your current data. Continue?"
  - On confirmation: Merge or replace based on option
  - Call setActiveList() and addCompletedList for all in backup
  - Show toast: "Data restored successfully"

- [ ] T061 [US4] [P] Handle restore edge cases:
  - Invalid JSON → Show error toast
  - Missing required fields → Show error toast
  - If file parse fails → Show "Invalid backup file"

- [ ] T062 [US4] [P] Style BackupRestore with Chakra UI:
  - Use Box for container
  - Use Button for "Download Backup" and "Restore"
  - Use Input type="file" for file upload
  - Use Alert or Modal for confirmation dialog

- [ ] T063 [US4] Test: Export backup → file downloads with correct name
- [ ] T064 [US4] Test: Import backup → data fully restored (lists, items, timestamps all present)
- [ ] T065 [US4] Test: Try importing invalid JSON → error message shown
- [ ] T066 [US4] Test: Import with existing data → confirmation dialog appears
- [ ] T067 [US4] Test: Cancel confirmation → data unchanged

---

## Phase 7: Polish - Light/Dark Theme & Responsive Design

**Goal**: Theme toggle works and persists; all components responsive 320px-1920px  
**Independent Test**: Toggle theme → refresh page → theme persists; view on mobile and desktop

### Tasks

- [ ] T068 [P] Create `src/components/ThemeToggle.tsx` component:
  - Use Chakra useColorMode hook
  - Button with moon/sun icon (from @chakra-ui/icons)
  - onClick: toggleColorMode()
  - Save preference to localStorage via storageService.setTheme()

- [ ] T069 [P] Integrate ThemeToggle into App or Settings:
  - Place in top-right corner or Settings tab
  - Position: Fixed or in header

- [ ] T070 On App mount: Load saved theme from storageService.getTheme()

- [ ] T071 [P] Ensure all components responsive:
  - Mobile (320px): Single column, full-width inputs, large touch targets (44px+)
  - Tablet (768px): More breathing room, two-column layouts where appropriate
  - Desktop (1024px+): Max-width containers (600px for List), multi-column views
  - Use Chakra responsive props: `flexDir={{ base: 'column', md: 'row' }}`

- [ ] T072 [P] Test responsive design:
  - Mobile (iPhone 12 - 390px width)
  - Tablet (iPad - 768px width)
  - Desktop (1920px width)
  - Verify all text readable, inputs usable, buttons clickable on mobile

- [ ] T073 Test: Toggle theme light ↔ dark → Chakra updates colors
- [ ] T074 Test: Toggle theme → refresh page → theme persists (dark or light)
- [ ] T075 Test: Create list on mobile → add items → check items → responsive layout works
- [ ] T076 Test: View Dashboard on mobile → statistics readable, no overflow

---

## Phase 8: Polish - GitHub Pages Deployment

**Goal**: Automatic deployment configured, production build tested locally  
**Independent Test**: Build locally, preview, then deploy to GitHub Pages

### Tasks

- [ ] T077 Create `.github/workflows/deploy.yml` GitHub Actions workflow:
  ```yaml
  name: Deploy to GitHub Pages
  on:
    push:
      branches: [main]
    workflow_dispatch:
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'
        - run: npm ci
        - run: npm run build
        - uses: actions/upload-pages-artifact@v3
          with:
            path: './dist'
        - uses: actions/deploy-pages@v2
  ```

- [ ] T078 [P] Verify `vite.config.ts` has correct base path:
  - `base: '/shopping-list-dashboard/'` (adjust if using custom domain)
  - `build: { outDir: 'dist' }`

- [ ] T079 Test local production build:
  - Run `npm run build`
  - Verify `dist/` directory created with assets
  - Run `npm run preview`
  - Open http://localhost:4173/ and verify app works

- [ ] T080 Create GitHub Pages settings in repo:
  - Settings → Pages → Source: GitHub Actions
  - Save

- [ ] T081 Deploy to GitHub Pages:
  - Push to main branch
  - GitHub Actions runs workflow
  - Check Actions tab for deployment status
  - Verify site accessible at https://YOUR_ORG.github.io/shopping-list-dashboard

- [ ] T082 Test production deployment:
  - Open live site
  - Create list → add items → check items → verify works
  - Refresh page → verify data persists
  - Toggle theme → verify persists
  - Export/import backup → verify works

---

## Phase 9: Final Polish & Cross-Cutting Concerns

**Goal**: Code quality check, manual testing verification, documentation complete  
**Independent Test**: Code review pass, manual test suite pass, documentation up-to-date

### Tasks

- [ ] T083 Create comprehensive test checklist in `docs/TESTING.md`:
  - List creation & item management (10 test cases)
  - Item completion & timestamps (8 test cases)
  - Dashboard analytics (6 test cases)
  - Backup/restore (5 test cases)
  - Theme toggle (3 test cases)
  - Responsive design (4 test cases)

- [ ] T084 [P] Implement manual testing suite:
  - Test all 36 test cases from checklist
  - Document results (pass/fail)
  - Report any bugs

- [ ] T085 [P] Code review checklist:
  - [ ] All TypeScript types are correct (run `tsc --noEmit`)
  - [ ] Components follow React hooks best practices
  - [ ] No console errors or warnings (clean DevTools)
  - [ ] Accessibility: Keyboard navigation works, focus visible, semantic HTML
  - [ ] Performance: Page loads <1s, dashboard updates <500ms
  - [ ] Responsive design verified on 3+ screen sizes

- [ ] T086 [P] Documentation review:
  - [spec.md](spec.md) matches implementation ✓
  - [plan.md](plan.md) matches implementation ✓
  - [data-model.md](data-model.md) matches implementation ✓
  - [quickstart.md](quickstart.md) is accurate ✓
  - README.md exists with feature overview (optional)

- [ ] T087 [P] Performance validation:
  - Page load time <1s (Lighthouse score >90)
  - Dashboard metrics render <500ms
  - localStorage operations <5ms each
  - Smooth 60fps animations (no jank)

- [ ] T088 [P] Accessibility audit:
  - Run axe DevTools or WAVE in browser on all tabs
  - Fix any critical issues (contrast, labels, keyboard)
  - Test with screen reader (NVDA/JAWS)

- [ ] T089 [P] Cleanup & optimization:
  - Remove any `console.log` statements (dev only)
  - Optimize bundle size (should be <200KB gzipped)
  - Remove unused imports/exports

- [ ] T090 [P] Final commit & deployment:
  - All code committed to `001-shopping-list-dashboard` branch
  - PR created and reviewed
  - Merge to main
  - GitHub Actions deploys automatically

- [ ] T091 Test: Load app in fresh incognito browser → no cached data, clean slate
- [ ] T092 Test: Simulate poor network (DevTools throttling) → app still functional
- [ ] T093 Test: Clear localStorage manually → app gracefully handles missing data

---

## Dependencies & Parallel Opportunities

### Parallel Execution (Independent Tasks)

**Can be done in parallel (same time)**:
- T003 & T004 & T005 & T008 (config files)
- T013 & T014 & T015 & T016 (all services)
- T022 & T023 & T029 & T030 (List & ListItem components)
- T031 & T032 & T033 & T034 (Phase 3 tests)
- T038 & T039 & T040 & T041 (Phase 4 implementations)
- T048 & T049 & T050 & T051 (Dashboard sections)
- T068 & T069 & T071 (Theme & responsive)

### Blocking Dependencies

- Phase 1 → all other phases (project must init first)
- Phase 2 → Phase 3-6 (types & services needed before components)
- Phase 3 → Phase 4 (List UI must exist before toggle handler)
- Phase 4 → Phase 5 (Completed lists archived before dashboard displays)
- Phase 6 independent (can be done after Phase 3)
- Phase 7 independent (can be done after Phase 5 or in parallel)
- Phase 8 → final deployment (must test locally first)

---

## Success Criteria

✅ **Phase 1**: npm run dev launches, npm run build succeeds  
✅ **Phase 2**: TypeScript compiles, all services callable  
✅ **Phase 3**: Create list, add items, refresh → items persist  
✅ **Phase 4**: Check items → timestamps record, list archives when complete  
✅ **Phase 5**: Dashboard shows trip durations, averages, current progress  
✅ **Phase 6**: Export backup → clear storage → import → restore works  
✅ **Phase 7**: Theme toggles and persists, app responsive 320-1920px  
✅ **Phase 8**: Production build works, deployed to GitHub Pages  
✅ **Phase 9**: All tests pass, code reviewed, documentation complete, 0 console errors  

---

## Acceptance Criteria (per Spec)

### User Story 1 ✅
- [ ] User can create new list with today's date reference
- [ ] User can add items with product names
- [ ] Items display immediately after adding
- [ ] Data persists across page refresh

### User Story 2 ✅
- [ ] User can check items and see completion timestamps (HH:MM)
- [ ] Unchecking clears timestamp
- [ ] When all items checked, list is archived with total duration recorded
- [ ] Completion time is last item's timestamp

### User Story 3 ✅
- [ ] Dashboard shows current trip with elapsed time
- [ ] Dashboard shows completed trip history with durations
- [ ] Dashboard shows average time across all completed trips
- [ ] In-progress lists don't count toward average

### User Story 4 ✅
- [ ] Users can download backup JSON file
- [ ] Users can upload and restore backup
- [ ] Confirmation dialog prevents accidental overwrite
- [ ] All data (lists, items, timestamps) restore correctly

---

## Manual Testing (No Automated Tests)

Per project constitution: **No automated testing frameworks**. All quality assurance via:
1. Code review (peer verification before merge)
2. Manual testing (36 test cases per TESTING.md checklist)
3. Developer testing (each implementer tests during dev)
4. Documentation (edge cases commented in code)

---

## Notes

- Code style: Follow React + TypeScript best practices
- Component pattern: Functional components with hooks
- State management: React useState + props callbacks (no Redux/Context)
- Styling: Chakra UI components (no custom CSS except globals)
- Build: Vite (no Webpack config needed)
- Deployment: GitHub Pages static hosting
- Browser support: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, mobile)
- Bundle size target: <200KB gzipped
- Performance targets: Load <1s, Dashboard <500ms, 60fps animations

---

## Implementation Checklist

Copy this into your IDE for tracking progress:

```
PHASE 1: SETUP (30 min)
[_] T001-T012

PHASE 2: FOUNDATIONAL (2 hours)
[_] T013-T021

PHASE 3: USER STORY 1 (1.5 hours)
[_] T022-T037

PHASE 4: USER STORY 2 (1.5 hours)
[_] T038-T047

PHASE 5: USER STORY 3 (2 hours)
[_] T048-T058

PHASE 6: USER STORY 4 (1 hour)
[_] T059-T067

PHASE 7: POLISH (1 hour)
[_] T068-T076

PHASE 8: DEPLOYMENT (1 hour)
[_] T077-T082

PHASE 9: FINAL POLISH (1 hour)
[_] T083-T093
```

**Total**: ~93 tasks | ~9-10 hours | MVP ready for launch after Phase 5
