// Shopping List entities and storage schema

export interface ListItem {
    id: string;  // UUID v4
    title: string;  // Product name, 1-200 chars
    completed: boolean;
    completedAt: string | null;  // ISO 8601 timestamp or null
    createdAt: string;  // ISO 8601 timestamp
    deleted: boolean;
    deletedAt: string | null;  // ISO 8601 timestamp or null
}

export interface ShoppingList {
    createdAt: string;  // ISO 8601, also serves as list identifier
    items: ListItem[];
    status: 'active' | 'completed';  // Computed from items
}

export interface CompletedList {
    id: string;  // UUID v4
    createdAt: string;  // ISO 8601, when shopping trip started
    completedAt: string;  // ISO 8601, when last item was checked
    durationMs: number;  // Duration in milliseconds
    itemCount: number;  // Total items in list
    purchasedItems?: string[];  // titles of completed items at archive time; absent for old trips
}

export interface StorageSchema {
    activeList: ShoppingList | null;
    completedLists: CompletedList[];
    theme: 'light' | 'dark';
}

export interface DashboardStats {
    totalTrips: number;
    averageDuration: number;
    averageDurationFormatted: string;
    shortestTrip: CompletedList | null;
    longestTrip: CompletedList | null;
    totalItemsShipped: number;
}
