import { StorageSchema } from '../types/index'
import * as storageService from './storageService'

/**
 * Export all data as JSON string
 */
export function exportBackup(): string {
  const activeList = storageService.getActiveList()
  const completedLists = storageService.getCompletedLists()
  const theme = storageService.getTheme()
  
  const data: StorageSchema = {
    activeList,
    completedLists,
    theme,
  }
  
  return JSON.stringify(data, null, 2)
}

/**
 * Parse backup JSON and validate structure
 */
export function importBackup(jsonString: string): StorageSchema {
  try {
    const data = JSON.parse(jsonString) as StorageSchema
    
    // Validate required fields
    if (!Array.isArray(data.completedLists)) {
      throw new Error('Invalid backup: completedLists must be an array')
    }
    
    if (data.activeList && typeof data.activeList !== 'object') {
      throw new Error('Invalid backup: activeList must be an object or null')
    }
    
    if (data.theme !== 'light' && data.theme !== 'dark') {
      data.theme = 'light'  // Default to light if invalid
    }
    
    return data
  } catch (error) {
    throw new Error(`Failed to parse backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Trigger browser download of backup file
 */
export function downloadBackupFile(data: string): void {
  const element = document.createElement('a')
  const file = new Blob([data], { type: 'application/json' })
  element.href = URL.createObjectURL(file)
  
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]  // YYYY-MM-DD
  element.download = `shopping-list-backup-${dateStr}.json`
  
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  URL.revokeObjectURL(element.href)
}

/**
 * Parse uploaded backup file
 */
export async function parseBackupFile(file: File): Promise<StorageSchema> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = importBackup(content)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * Restore full backup (overwrites current data)
 */
export function restoreBackup(data: StorageSchema): void {
  if (data.activeList) {
    storageService.setActiveList(data.activeList)
  } else {
    storageService.setActiveList(null)
  }
  
  // Clear existing completed lists and restore from backup
  const currentCompleted = storageService.getCompletedLists()
  currentCompleted.forEach(list => {
    storageService.deleteCompletedList(list.id)
  })
  
  // Add all restored completed lists
  data.completedLists.forEach(list => {
    storageService.addCompletedList(list)
  })
  
  storageService.setTheme(data.theme)
}
