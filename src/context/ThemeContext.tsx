import { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import * as storageService from '../services/storageService'

interface ThemeContextValue {
    themeMode: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
        () => (storageService.getTheme() as 'light' | 'dark') ?? 'light'
    )

    const theme = useMemo(
        () => createTheme({
            palette: {
                mode: themeMode,
                ...(themeMode === 'light' ? {
                    background: {
                        default: '#f5f5f5',
                        paper: '#e8e8e8',
                    },
                } : {
                    background: {
                        default: '#121212',
                        paper: '#1e1e1e',
                    },
                }),
            },
        }),
        [themeMode]
    )

    const toggleTheme = () => {
        setThemeMode(prev => {
            const next = prev === 'light' ? 'dark' : 'light'
            storageService.setTheme(next)
            return next
        })
    }

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider')
    return ctx
}
