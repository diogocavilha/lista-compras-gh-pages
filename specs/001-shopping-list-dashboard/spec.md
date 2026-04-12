# Feature Specification: Shopping List Dashboard

**Feature Branch**: `001-shopping-list-dashboard`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Build shopping list management app for supermarket, todo-style with items (title, checkbox, completion time), dashboard with time analytics, single list at a time, localStorage persistence, backup/restore, no login"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Shopping List (Priority: P1)

As a shopper, I want to create a shopping list when I arrive at the supermarket and add items with product names, so I can track what I need to buy.

**Why this priority**: This is the core functionality that enables the entire application—without the ability to create and manage a list, no other features have value.

**Independent Test**: Can be fully tested by creating a new list, adding multiple items, and verifying the list persists. Delivers fundamental value of item tracking.

**Acceptance Scenarios**:

1. **Given** no active list exists, **When** user opens the app, **Then** they see an option to create a new list with today's date as reference
2. **Given** a list is active, **When** user enters a product name and adds an item, **Then** the item appears in the list immediately
3. **Given** a list with items, **When** user refreshes the page, **Then** all items persist and the list is still active
4. **Given** an active list, **When** user views the list, **Then** each item shows title, unchecked checkbox, and no completion time

---

### User Story 2 - Mark Items Complete with Timestamps (Priority: P1)

As a shopper, I want to check off items as I find them and see when I completed them, so I can track my shopping progress.

**Why this priority**: Marking completion is essential functionality that enables time-tracking analytics, which is the core value-add of this app over simple todo lists.

**Independent Test**: Can be tested by creating items and checking them off in sequence; completion timestamps must be accurate, enabling analytics.

**Acceptance Scenarios**:

1. **Given** an item in an active list, **When** user clicks the checkbox, **Then** the item is marked as completed and shows the exact date/time of completion
2. **Given** a completed item, **When** user unchecks it, **Then** the completion status is removed and timestamp is cleared
3. **Given** items completed at different times, **When** list completes (all items checked), **Then** final completion time is the timestamp of the last item checked

---

### User Story 3 - View Shopping Time Analytics (Priority: P1)

As a shopper, I want to see how long my shopping trips take and what the average time is, so I understand my shopping efficiency.

**Why this priority**: This is the primary differentiator from a basic todo app—the analytics dashboard is the core user value.

**Independent Test**: Can be tested with historical lists (from localStorage) showing time metrics; must compute and display duration and average accurately.

**Acceptance Scenarios**:

1. **Given** a completed list, **When** user navigates to the dashboard, **Then** they see the list's start date and total time spent (from first item to last item completion)
2. **Given** multiple completed lists in history, **When** user views the dashboard, **Then** they see average time across all completed lists
3. **Given** an incomplete active list, **When** user views the dashboard, **Then** it shows in-progress status and does NOT count toward average calculation

---

### User Story 4 - Backup and Restore Data (Priority: P2)

As a shopper, I want to back up my shopping history and restore it if needed, so I don't lose my data if I clear browser storage.

**Why this priority**: Protects user data and provides peace of mind; enables data portability but is secondary to core list functionality.

**Independent Test**: Can be tested independently by exporting data, clearing localStorage, reimporting, and verifying all lists and items restore correctly.

**Acceptance Scenarios**:

1. **Given** lists and items in localStorage, **When** user clicks "Backup", **Then** they can download a backup file with all data
2. **Given** a backup file, **When** user clicks "Restore" and selects the file, **Then** all lists and items are restored to localStorage
3. **Given** existing lists in storage, **When** user restores a backup, **Then** they are prompted to confirm (to prevent accidental overwrite)

---

### Edge Cases

- What happens when user completes all items? List should mark completion time as the final item's timestamp.
- How does the system handle rapid checkbox clicks? Each click should record its own timestamp; only the final state matters.
- What if user completes items in non-sequential order? Timestamps are independent; total time is from first item created to last item completed.
- What happens if user deletes all items from a list before completing any? List remains but shows 0% completion; if abandoned, it can be discarded when creating a new list.
- What if localStorage is full? User is informed they cannot add more items until data is backed up or cleared.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a new shopping list referenced by its creation date (day/month/year format)
- **FR-002**: System MUST allow only ONE active shopping list at a time; creating a new list replaces the previous active list (user is warned before replacement)
- **FR-003**: System MUST allow users to add items to the active list with a product name (title)
- **FR-004**: System MUST allow users to mark items as completed and automatically record the completion timestamp (date and time)
- **FR-005**: System MUST allow users to unmark completed items, clearing the completion timestamp
- **FR-006**: System MUST persist all list data (items, status, timestamps) to localStorage
- **FR-007**: System MUST calculate and display on a dashboard the total time spent for each completed list (from list creation to final item completion)
- **FR-008**: System MUST calculate and display the average time spent across all completed lists
- **FR-009**: System MUST allow users to export list data as a downloadable backup file in JSON format
- **FR-010**: System MUST allow users to import and restore data from a backup file, with confirmation to prevent accidental overwrite
- **FR-011**: System MUST NOT require user login or authentication
- **FR-012**: System MUST display the active list status (in-progress) and completed lists in the dashboard

### Key Entities

- **Shopping List**:
  - Creation date (references the list)
  - Status (active/completed)
  - Start timestamp (when first item was added, or list creation time)
  - End timestamp (when last item was completed)
  - Total duration (computed: end time - start time)

- **List Item**:
  - Title (product name)
  - Completed status (true/false)
  - Completion timestamp (date and time, null if not completed)
  - Created timestamp (optional, for ordering)

- **Dashboard State**:
  - List of all completed lists with durations
  - Current active list status
  - Average duration across completed lists

## Success Criteria *(mandatory)*

- Users can create and manage a shopping list in under 30 seconds
- Timestamps are recorded to within 1 second accuracy
- Dashboard metrics load and display in under 1 second
- All user data persists across browser sessions without data loss
- Backup file contains complete list history and restores identically
- Application works without internet or server connection (fully client-side)
- No authentication/login barriers—instant access on page load

## Assumptions

1. "Completion time" refers to the exact moment the user checked off the item, not when they physically retrieved the product.
2. List is "complete" only when ALL items are marked as completed.
3. Total time spent = timestamp of last completed item - creation time of the list, regardless of when individual items were added.
4. Users may have multiple completed lists in history; average time is across all completed lists.
5. Backup files are JSON format; users manage their own backup storage.
6. Browser localStorage has sufficient capacity for typical usage (dozens of lists with hundreds of items).

## Out of Scope

- Multi-list view or list templates
- Item categories or organization
- Sharing or collaboration features
- Mobile app (web-based only)
- Server-side synchronization
- User accounts or login
- Push notifications or reminders
- Item quantities or prices
