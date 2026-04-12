import { ListItem, CompletedList, DashboardStats } from '../types/index'

/**
 * Calculate duration in milliseconds between two ISO 8601 timestamps
 */
export function calculateListDuration(startTime: string, endTime: string): number {
  try {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    return Math.max(0, end - start)
  } catch {
    return 0
  }
}

/**
 * Format duration in milliseconds to human-readable string
 * Examples: "30 seconds", "15 minutes", "1 hour 20 minutes"
 */
export function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000)
  
  if (totalSeconds < 60) {
    return `${totalSeconds} second${totalSeconds !== 1 ? 's' : ''}`
  }
  
  const minutes = Math.floor(totalSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
}

/**
 * Calculate average duration across completed lists
 */
export function calculateAverageDuration(completedLists: CompletedList[]): number {
  if (completedLists.length === 0) return 0
  const total = completedLists.reduce((sum, list) => sum + list.durationMs, 0)
  return Math.round(total / completedLists.length)
}

/**
 * Calculate completion percentage (0-100)
 */
export function calculateCompletionPercent(items: ListItem[]): number {
  if (items.length === 0) return 0
  const completed = items.filter(item => item.completed).length
  return Math.round((completed / items.length) * 100)
}

/**
 * Get most recent completed lists
 */
export function getRecentTrips(completedLists: CompletedList[], limit: number = 5): CompletedList[] {
  return completedLists
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

/**
 * Get comprehensive dashboard statistics
 */
export function getDashboardStats(completedLists: CompletedList[]): DashboardStats {
  const totalTrips = completedLists.length
  const averageDuration = calculateAverageDuration(completedLists)
  const totalItemsShipped = completedLists.reduce((sum, list) => sum + list.itemCount, 0)
  
  let shortestTrip: CompletedList | null = null
  let longestTrip: CompletedList | null = null
  
  if (completedLists.length > 0) {
    shortestTrip = completedLists.reduce((shortest, list) =>
      list.durationMs < shortest.durationMs ? list : shortest
    )
    longestTrip = completedLists.reduce((longest, list) =>
      list.durationMs > longest.durationMs ? list : longest
    )
  }
  
  return {
    totalTrips,
    averageDuration,
    averageDurationFormatted: formatDuration(averageDuration),
    shortestTrip,
    longestTrip,
    totalItemsShipped,
  }
}

/**
 * Format a date as "Month Day, Time AM/PM" or "Today, Time AM/PM"
 */
export function formatListDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    const today = new Date()
    
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    
    if (isToday) {
      return `Today, ${timeFormatter.format(date)}`
    }
    
    return dateFormatter.format(date)
  } catch {
    return 'Unknown date'
  }
}

/**
 * Format time as HH:MM AM/PM
 */
export function formatTime(isoString: string | null): string {
  if (!isoString) return ''
  
  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  } catch {
    return ''
  }
}
