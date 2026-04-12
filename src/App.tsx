import { useState, useEffect } from 'react'
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from '@chakra-ui/react'
import { ShoppingList, ListItem as ListItemType, CompletedList } from './types/index'
import * as storageService from './services/storageService'
import * as analyticsService from './services/analyticsService'
import List from './components/List'
import Dashboard from './components/Dashboard'
import ThemeToggle from './components/ThemeToggle'
import BackupRestore from './components/BackupRestore'

function App() {
    const [activeList, setActiveList] = useState<ShoppingList | null>(null)
    const [completedLists, setCompletedLists] = useState<CompletedList[]>([])
    const toast = useToast()

    // Load data from localStorage on mount
    useEffect(() => {
        const list = storageService.getActiveList()
        const lists = storageService.getCompletedLists()
        setActiveList(list)
        setCompletedLists(lists)
    }, [])

    // Simple UUID generator (crypto.randomUUID fallback)
    const generateUUID = (): string => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    const handleCreateNewList = () => {
        if (activeList) {
            const confirm = window.confirm(
                'You have an active list. Creating a new list will replace it. Continue?'
            )
            if (!confirm) return
        }

        const newList: ShoppingList = {
            createdAt: new Date().toISOString(),
            items: [],
            status: 'active',
        }

        setActiveList(newList)
        storageService.setActiveList(newList)
        toast({
            title: 'Lista criada com sucesso',
            status: 'success',
            duration: 2000,
            isClosable: true,
        })
    }

    const handleAddItem = (title: string) => {
        if (!activeList) return

        const newItem: ListItemType = {
            id: generateUUID(),
            title,
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString(),
        }

        const updatedList = {
            ...activeList,
            items: [...activeList.items, newItem],
        }

        setActiveList(updatedList)
        storageService.setActiveList(updatedList)
    }

    const handleToggleItem = (itemId: string) => {
        if (!activeList) return

        const updatedItems = activeList.items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    completed: !item.completed,
                    completedAt: !item.completed ? new Date().toISOString() : null,
                }
            }
            return item
        })

        const updatedList = { ...activeList, items: updatedItems }

        // Check if all items are completed
        const allCompleted = updatedItems.every(item => item.completed)
        if (allCompleted && updatedItems.length > 0) {
            archiveCompletedList(updatedList)
        } else {
            setActiveList(updatedList)
            storageService.setActiveList(updatedList)
        }
    }

    const archiveCompletedList = (list: ShoppingList) => {
        const lastItemCompletedAt = list.items
            .filter(item => item.completedAt)
            .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0]

        if (!lastItemCompletedAt) return

        const durationMs = analyticsService.calculateListDuration(
            list.createdAt,
            lastItemCompletedAt.completedAt!
        )

        const completedList: CompletedList = {
            id: generateUUID(),
            createdAt: list.createdAt,
            completedAt: lastItemCompletedAt.completedAt!,
            durationMs,
            itemCount: list.items.length,
        }

        setCompletedLists([...completedLists, completedList])
        storageService.addCompletedList(completedList)
        storageService.setActiveList(null)
        setActiveList(null)

        const formattedDuration = analyticsService.formatDuration(durationMs)
        toast({
            title: 'Lista concluída!',
            description: `Viagem de compras: ${formattedDuration}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    const handleDeleteItem = (itemId: string) => {
        if (!activeList) return

        const updatedList = {
            ...activeList,
            items: activeList.items.filter(item => item.id !== itemId),
        }

        setActiveList(updatedList)
        storageService.setActiveList(updatedList)
    }

    return (
        <Box minH="100vh" bg="white" _dark={{ bg: 'gray.900' }}>
            <Tabs variant="soft-rounded" colorScheme="blue" p={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <TabList>
                        <Tab>Compras</Tab>
                        <Tab>Dashboard</Tab>
                        <Tab>Configurações</Tab>
                    </TabList>
                    <ThemeToggle />
                </Box>

                <TabPanels>
                    <TabPanel>
                        <List
                            list={activeList}
                            onAddItem={handleAddItem}
                            onToggleItem={handleToggleItem}
                            onDeleteItem={handleDeleteItem}
                            onCreateNewList={handleCreateNewList}
                        />
                    </TabPanel>

                    <TabPanel>
                        <Dashboard activeList={activeList} completedLists={completedLists} />
                    </TabPanel>

                    <TabPanel>
                        <BackupRestore
                            onRestoreComplete={() => {
                                const list = storageService.getActiveList()
                                const lists = storageService.getCompletedLists()
                                setActiveList(list)
                                setCompletedLists(lists)
                            }}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default App
