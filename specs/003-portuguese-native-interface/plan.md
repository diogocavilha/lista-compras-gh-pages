# Implementation Plan: Portuguese Native Interface

**Branch**: `003-portuguese-native-interface` | **Date**: 2026-04-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-portuguese-native-interface/spec.md`

## Summary

Transform the shopping list dashboard application to use Brazilian Portuguese (pt-BR) as the native interface language. Achieve this through direct string replacement in all user-facing components and services. No architectural changes, no new dependencies, no language switcher - only straightforward rewriting of all English strings to Portuguese equivalents while maintaining full application functionality.

## Technical Context

**Language/Version**: TypeScript 5.x with React 18.x  
**Primary Dependencies**: React, React DOM, Chakra UI 2.x, Vite 5.x  
**Storage**: localStorage (keys unchanged, only displayed values affected)  
**Testing**: Manual verification (per constitution: no automated testing frameworks)  
**Target Platform**: Web browser (GitHub Pages deployment)  
**Project Type**: Single-page React web application  
**Performance Goals**: Maintain current production build size ≤140 KB gzipped  
**Constraints**: No external i18n libraries; no browser locale detection required; Portuguese-only output  
**Scale/Scope**: 5 React components + 2 services; ~15 files containing hardcoded English strings

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Principle I: Clean Code & Good Practices** - PASS  
- Direct string replacement maintains code clarity and simplicity
- No additional abstractions or unnecessary patterns introduced
- Component structure remains unchanged and readable

✅ **Principle II: Small & Clear Scope** - PASS  
- Single responsibility: translate all user-visible strings to Portuguese
- No feature creep or scope expansion
- Focused on text replacement only

✅ **Principle III: No Over-Engineering** - PASS  
- Avoids heavyweight i18n libraries (no react-i18next, no context providers)
- Implements exactly what's needed: Portuguese strings replacing English
- Direct approach: find-and-replace in components and services

✅ **Principle IV: Manual Verification, No Automated Tests** - PASS  
- No test framework dependencies added
- Manual testing of UI in Portuguese covers all scenarios
- Clear, simple code changes reduce bug surface area

## Project Structure

### Documentation (this feature)

```text
specs/003-portuguese-native-interface/
├── plan.md                  # This file
├── spec.md                  # Feature specification
├── research.md              # Phase 0 - Completed as inline analysis (no unknowns)
├── data-model.md            # Phase 1 - String mapping and translation guide
├── quickstart.md            # Phase 1 - Implementation checklist
├── contracts/               # Phase 1 - N/A (no external interface changes)
└── checklists/
    └── requirements.md      # Quality checklist (already completed)
```

### Source Code (Web Application - React with Vite)

```text
src/
├── App.tsx                  # Main app component (English strings → Portuguese)
├── components/
│   ├── List.tsx             # Shopping list UI (English strings → Portuguese)
│   ├── ListItem.tsx         # Individual list item (English strings → Portuguese)
│   ├── Dashboard.tsx        # Analytics dashboard (English strings → Portuguese)
│   ├── BackupRestore.tsx    # Backup/restore feature (English strings → Portuguese)
│   └── ThemeToggle.tsx      # No user-visible strings (no translation needed)
├── services/
│   ├── storageService.ts    # localStorage interaction (no visible strings)
│   ├── backupService.ts     # JSON backup (comments/labels in English → Portuguese)
│   └── analyticsService.ts  # Statistics (formatter strings → Portuguese)
├── types/
│   └── index.ts             # TypeScript interfaces (no visible strings)
└── index.css                # Styling (no translation needed)

public/
├── index.html               # HTML structure (title, meta → Portuguese if visible)
└── vite.svg                 # Asset (no translation)

.github/
└── workflows/
    └── deploy.yml           # Deployment config (no visible strings)
```

**Structure Decision**: Single-page React application. Translation impacts only text content in components and services; architecture and file organization remain unchanged. Components are organized by feature (List, Dashboard, BackupRestore, etc.) and require systematic Portuguese string replacement in each.

## Phase 0: Research & Clarification

**Status**: ✅ COMPLETE - No unknowns identified

The user requirement is explicit: "apenas traduza tudo reescrevendo" (translate everything by rewriting). Technical approach is straightforward:
- Direct string replacement (no i18n library)
- Portuguese Brazilian locale conventions for dates/times/numbers
- No language switcher or language selection option
- Single, permanent locale: pt-BR

**Research findings integrated into Technical Context and Phase 1 planning below.**

## Phase 1: Design & Contracts

### Data Model: String Translation Mapping

The translation scope covers all user-visible strings across components and services:

**Core Components to Translate**:

| Component | Strings | Count | Notes |
|-----------|---------|-------|-------|
| App.tsx | Tab labels, toast notifications | ~8 | Main navigation: "Shopping", "Dashboard", "Settings" |
| List.tsx | Empty state, form labels, buttons, validation | ~12 | "No active list", form inputs, error messages |
| ListItem.tsx | Delete confirmation, timestamps | ~4 | Confirmation dialog, time displays |
| Dashboard.tsx | Section headings, stat labels | ~10 | "Current Trip", "Statistics", stat names |
| BackupRestore.tsx | Headings, buttons, descriptions, confirmations | ~15 | Export/import UI text |
| analyticsService.ts | Duration labels, date formatting | ~6 | "2 hours ago", month names, date patterns |

**Total scope**: ~55 discoverable English strings to replace with Portuguese equivalents

**Translation Strategy**:
1. Identify all hardcoded strings in components (function bodies, JSX)
2. Map to Portuguese equivalents (native speaker validation recommended)
3. Replace strings in-place (no abstraction layer needed)
4. Test all strings render correctly with Portuguese characters (ç, ã, õ, é, etc.)
5. Verify date/time formatting follows Brazilian conventions (DD/MM/YYYY, "12 de abril")
6. Confirm numeric formatting uses comma decimal separator

### Contracts

**N/A** - This feature does not expose new external interfaces or public APIs. All changes are internal UI text replacement.

### Quickstart: Implementation Checklist

**Files to modify per feature requirements**:

- [ ] `src/App.tsx` - Tab labels, notifications (8 strings)
- [ ] `src/components/List.tsx` - Form, empty state, validation (12 strings)
- [ ] `src/components/ListItem.tsx` - Dialog, timestamps (4 strings)
- [ ] `src/components/Dashboard.tsx` - Headings, stats (10 strings)
- [ ] `src/components/BackupRestore.tsx` - UI text (15 strings)
- [ ] `src/services/analyticsService.ts` - Duration, dates (6 strings)

**Testing checklist** (manual verification):

- [ ] Tab labels display in Portuguese
- [ ] Form placeholders and button labels are Portuguese
- [ ] Empty state messages are Portuguese
- [ ] Validation errors appear in Portuguese
- [ ] Toast notifications use Portuguese text
- [ ] Delete confirmation dialog is in Portuguese
- [ ] Dashboard stats and labels are Portuguese
- [ ] Backup/restore instructions are Portuguese
- [ ] Date/time displays follow Brazilian format
- [ ] All special characters (ç, ã, etc.) render correctly
- [ ] No English fallback text appears anywhere
- [ ] Sidebar still functions with Portuguese labels
- [ ] Navigation between tabs works with Portuguese labels

## Complexity Tracking

No constitution violations identified. All changes follow the four core principles:
- Clean, readable code with transparent English → Portuguese string replacement
- Single, focused scope: interface translation only
- No over-engineering: direct replacement without libraries
- Manual testing sufficient to verify Portuguese output
