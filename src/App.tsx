import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import { ShoppingList, ListItem as ListItemType, CompletedList } from './types/index'
import * as storageService from './services/storageService'
import * as analyticsService from './services/analyticsService'
import List from './components/List'
import Dashboard from './components/Dashboard'
import ThemeToggle from './components/ThemeToggle'
import BackupRestore from './components/BackupRestore'
import ConfirmDialog from './components/ConfirmDialog'

interface SnackbarState {
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
}

interface ConfirmDialogState {
    title: string
    message: string
    onConfirm: () => void
}

const BOTTOM_NAV_HEIGHT = 56

function App() {
    const [activeTab, setActiveTab] = useState(0)
    const [activeList, setActiveList] = useState<ShoppingList | null>(null)
    const [completedLists, setCompletedLists] = useState<CompletedList[]>([])
    const [snackbar, setSnackbar] = useState<SnackbarState | null>(null)
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null)

    useEffect(() => {
        setActiveList(storageService.getActiveList())
        setCompletedLists(storageService.getCompletedLists())
    }, [])

    const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'success') => {
        setSnackbar({ message, severity })
    }

    const generateUUID = (): string =>
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })

    const handleCreateNewList = () => {
        if (activeList) {
            setConfirmDialog({
                title: 'Substituir lista',
                message: 'Você tem uma lista ativa. Criar uma nova lista irá substituí-la. Continuar?',
                onConfirm: () => {
                    setConfirmDialog(null)
                    createNewList()
                },
            })
            return
        }
        createNewList()
    }

    const createNewList = () => {
        const newList: ShoppingList = {
            createdAt: new Date().toISOString(),
            items: [],
            status: 'active',
        }
        setActiveList(newList)
        storageService.setActiveList(newList)
        showSnackbar('Lista criada com sucesso')
    }

    const handleAddItem = (title: string) => {
        if (!activeList) return
        const newItem: ListItemType = {
            id: generateUUID(),
            title,
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString(),
            deleted: false,
            deletedAt: null,
        }
        const updatedList = { ...activeList, items: [...activeList.items, newItem] }
        setActiveList(updatedList)
        storageService.setActiveList(updatedList)
    }

    const handleToggleItem = (itemId: string) => {
        if (!activeList) return
        const updatedItems = activeList.items.map(item =>
            item.id === itemId
                ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : null }
                : item
        )
        const updatedList = { ...activeList, items: updatedItems }
        const nonDeleted = updatedItems.filter(i => !(i.deleted ?? false))
        const allCompleted = nonDeleted.length > 0 && nonDeleted.every(i => i.completed)
        if (allCompleted) {
            archiveCompletedList(updatedList)
        } else {
            setActiveList(updatedList)
            storageService.setActiveList(updatedList)
        }
    }

    const archiveCompletedList = (list: ShoppingList) => {
        const lastItem = list.items
            .filter(item => item.completedAt)
            .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0]
        if (!lastItem) return

        const durationMs = analyticsService.calculateListDuration(list.createdAt, lastItem.completedAt!)
        const completedList: CompletedList = {
            id: generateUUID(),
            createdAt: list.createdAt,
            completedAt: lastItem.completedAt!,
            durationMs,
            itemCount: list.items.length,
        }
        setCompletedLists(prev => [...prev, completedList])
        storageService.addCompletedList(completedList)
        storageService.setActiveList(null)
        setActiveList(null)
        showSnackbar(`Lista concluída! Viagem: ${analyticsService.formatDuration(durationMs)}`)
    }

    const handleDeleteItem = (itemId: string) => {
        if (!activeList) return
        const updatedItems = activeList.items.map(item =>
            item.id === itemId
                ? { ...item, deleted: true, deletedAt: new Date().toISOString() }
                : item
        )
        const updatedList = { ...activeList, items: updatedItems }
        setActiveList(updatedList)
        storageService.setActiveList(updatedList)
        showSnackbar('Item removido', 'info')
    }

    const handleReorderItems = (fromIndex: number, toIndex: number) => {
        if (!activeList) return
        const activeItems = activeList.items.filter(i => !(i.deleted ?? false))
        const deletedItems = activeList.items.filter(i => i.deleted ?? false)
        const [moved] = activeItems.splice(fromIndex, 1)
        activeItems.splice(toIndex, 0, moved)
        const updatedList = { ...activeList, items: [...activeItems, ...deletedItems] }
        setActiveList(updatedList)
        storageService.setActiveList(updatedList)
    }

    return (
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Top bar with theme toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <ThemeToggle />
            </Box>

            {/* Tab content — fills remaining height above bottom nav */}
            <Box sx={{ flex: 1, overflow: 'auto', pb: `${BOTTOM_NAV_HEIGHT}px` }}>
                {activeTab === 0 && (
                    <List
                        list={activeList}
                        onAddItem={handleAddItem}
                        onToggleItem={handleToggleItem}
                        onDeleteItem={handleDeleteItem}
                        onReorderItems={handleReorderItems}
                        onCreateNewList={handleCreateNewList}
                        showSnackbar={showSnackbar}
                    />
                )}
                {activeTab === 1 && (
                    <Dashboard activeList={activeList} completedLists={completedLists} />
                )}
                {activeTab === 2 && (
                    <BackupRestore
                        onRestoreComplete={() => {
                            setActiveList(storageService.getActiveList())
                            setCompletedLists(storageService.getCompletedLists())
                        }}
                        showSnackbar={showSnackbar}
                    />
                )}
            </Box>

            {/* Bottom navigation */}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
                <BottomNavigation value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                    <BottomNavigationAction label="Compras" icon={<ShoppingCartIcon />} />
                    <BottomNavigationAction label="Painel" icon={<BarChartIcon />} />
                    <BottomNavigationAction label="Configurações" icon={<SettingsIcon />} />
                </BottomNavigation>
            </Paper>

            {/* Snackbar */}
            <Snackbar
                open={snackbar !== null}
                autoHideDuration={2500}
                onClose={() => setSnackbar(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar?.severity ?? 'success'} onClose={() => setSnackbar(null)} sx={{ width: '100%' }}>
                    {snackbar?.message}
                </Alert>
            </Snackbar>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmDialog !== null}
                title={confirmDialog?.title ?? ''}
                message={confirmDialog?.message ?? ''}
                onConfirm={confirmDialog?.onConfirm ?? (() => {})}
                onCancel={() => setConfirmDialog(null)}
            />
        </Box>
    )
}

export default App
