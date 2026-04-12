import { ShoppingList, CompletedList, StorageSchema } from '../types/index'

const STORAGE_KEY = 'shopping-list-data'

const DEFAULT_STORAGE: StorageSchema = {
    activeList: null,
    completedLists: [],
    theme: 'light',
}

/**
 * Load all data from localStorage, with fallback to defaults
 */
function getStorageData(): StorageSchema {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (!data) return DEFAULT_STORAGE
        return JSON.parse(data) as StorageSchema
    } catch (error) {
        console.error('Failed to parse storage data:', error)
        return DEFAULT_STORAGE
    }
}

/**
 * Save all data to localStorage
 */
function saveStorageData(data: StorageSchema): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
        console.error('Failed to save storage data:', error)
    }
}

/**
 * Get the currently active shopping list
 */
export function getActiveList(): ShoppingList | null {
    const data = getStorageData()
    return data.activeList
}

/**
 * Set the active shopping list (or null to clear)
 */
export function setActiveList(list: ShoppingList | null): void {
    const data = getStorageData()
    data.activeList = list
    saveStorageData(data)
}

/**
 * Get all completed shopping lists (history)
 */
export function getCompletedLists(): CompletedList[] {
    const data = getStorageData()
    return data.completedLists
}

/**
 * Add a completed list to history
 */
export function addCompletedList(list: CompletedList): void {
    const data = getStorageData()
    data.completedLists.push(list)
    saveStorageData(data)
}

/**
 * Delete a completed list by ID
 */
export function deleteCompletedList(id: string): void {
    const data = getStorageData()
    data.completedLists = data.completedLists.filter(list => list.id !== id)
    saveStorageData(data)
}

/**
 * Get saved theme preference
 */
export function getTheme(): 'light' | 'dark' {
    const data = getStorageData()
    return data.theme
}

/**
 * Save theme preference
 */
export function setTheme(theme: 'light' | 'dark'): void {
    const data = getStorageData()
    data.theme = theme
    saveStorageData(data)
}

/**
 * Clear all data from storage
 */
export function clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY)
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): { used: number; total: number; percent: number } {
    try {
        const data = JSON.stringify(getStorageData())
        const used = new Blob([data]).size
        const total = 5 * 1024 * 1024  // ~5MB typical allocation
        return {
            used,
            total,
            percent: Math.round((used / total) * 100),
        }
    } catch (error) {
        console.error('Failed to calculate storage usage:', error)
        return { used: 0, total: 5 * 1024 * 1024, percent: 0 }
    }
}
