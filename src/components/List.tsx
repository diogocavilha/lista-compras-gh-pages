import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fab from '@mui/material/Fab'
import MuiList from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { ListItem as ListItemType, ShoppingList } from '../types/index'
import { formatListDate } from '../services/analyticsService'
import ListItem from './ListItem'

interface DragState {
    draggingItemId: string | null
    isOverTrash: boolean
}

interface ListProps {
    list: ShoppingList | null
    onAddItem: (title: string) => void
    onToggleItem: (itemId: string) => void
    onDeleteItem: (itemId: string) => void
    onCreateNewList: () => void
    showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void
}

function List({ list, onAddItem, onToggleItem, onDeleteItem, onCreateNewList, showSnackbar }: ListProps) {
    const [addItemOpen, setAddItemOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [dragState, setDragState] = useState<DragState>({ draggingItemId: null, isOverTrash: false })

    const handleAddItem = () => {
        const trimmed = inputValue.trim()
        if (!trimmed) {
            showSnackbar('Por favor, insira um nome do produto', 'error')
            return
        }
        if (trimmed.length > 200) {
            showSnackbar('Nome do produto muito longo (máximo 200 caracteres)', 'error')
            return
        }
        if (list?.items.some(item => item.title.toLowerCase() === trimmed.toLowerCase())) {
            showSnackbar('Este item já está em sua lista', 'error')
            return
        }
        onAddItem(trimmed)
        setInputValue('')
        setAddItemOpen(false)
        showSnackbar('Item adicionado')
    }

    const handleDialogKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddItem()
        }
    }

    const handleDragStart = (itemId: string) => {
        setDragState({ draggingItemId: itemId, isOverTrash: false })
    }

    const handleDragEnd = (isOverTrash: boolean) => {
        if (isOverTrash && dragState.draggingItemId) {
            const itemId = dragState.draggingItemId
            setDragState({ draggingItemId: null, isOverTrash: false })
            onDeleteItem(itemId)
        } else {
            setDragState({ draggingItemId: null, isOverTrash: false })
        }
    }

    const handleTrashEnter = () => setDragState(prev => ({ ...prev, isOverTrash: true }))
    const handleTrashLeave = () => setDragState(prev => ({ ...prev, isOverTrash: false }))

    if (!list) {
        return (
            <Container maxWidth="sm" sx={{ pt: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                        Nenhuma lista encontrada
                    </Typography>
                    <Typography color="text.secondary">
                        Você pode criar uma nova lista quando estiver pronto
                    </Typography>
                    <Button variant="contained" size="large" sx={{ borderRadius: 8 }} onClick={onCreateNewList}>
                        Criar lista
                    </Button>
                </Box>
            </Container>
        )
    }

    const completedCount = list.items.filter(item => item.completed).length
    const isDragging = dragState.draggingItemId !== null

    return (
        <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
            {/* List metadata */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Lista de compras</Typography>
                <Typography variant="caption" color="text.secondary">
                    Criada: {formatListDate(list.createdAt)} · {list.items.length} itens, {completedCount} concluídos
                </Typography>
            </Box>

            {/* Items */}
            {list.items.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Nenhum item ainda. Toque no botão + para adicionar!
                    </Typography>
                </Box>
            ) : (
                <MuiList disablePadding sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                    {[...list.items].reverse().map((item: ListItemType, index: number) => (
                        <MuiListItem
                            key={item.id}
                            disablePadding
                            sx={{
                                borderBottom: index < list.items.length - 1 ? 1 : 0,
                                borderColor: 'divider',
                                bgcolor: item.completed ? 'action.hover' : 'background.paper',
                            }}
                        >
                            <ListItem
                                item={item}
                                onToggleItem={onToggleItem}
                                onDeleteItem={onDeleteItem}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onTrashEnter={handleTrashEnter}
                                onTrashLeave={handleTrashLeave}
                                trashVisible={isDragging}
                            />
                        </MuiListItem>
                    ))}
                </MuiList>
            )}

            {/* Floating trash zone — appears when dragging */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 72,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1300,
                    opacity: isDragging ? 1 : 0,
                    pointerEvents: isDragging ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease',
                }}
            >
                <Fab
                    data-trash-zone=""
                    color={dragState.isOverTrash ? 'error' : 'default'}
                    size="large"
                    sx={{ transition: 'background-color 0.15s ease' }}
                    onTouchStart={handleTrashEnter}
                    onTouchEnd={() => handleDragEnd(true)}
                    onMouseEnter={handleTrashEnter}
                    onMouseLeave={handleTrashLeave}
                    onMouseUp={() => handleDragEnd(true)}
                >
                    <DeleteIcon />
                </Fab>
            </Box>

            {/* FAB — add item */}
            <Fab
                color="primary"
                aria-label="Adicionar item"
                sx={{ position: 'fixed', bottom: 72, right: 16, zIndex: 1200 }}
                onClick={() => setAddItemOpen(true)}
            >
                <AddIcon />
            </Fab>

            {/* Add item dialog */}
            <Dialog
                open={addItemOpen}
                onClose={() => { setAddItemOpen(false); setInputValue('') }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Adicionar item</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Nome do produto"
                        placeholder="Ex: Leite, Pão, Ovos..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleDialogKeyDown}
                        slotProps={{ htmlInput: { maxLength: 200 } }}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setAddItemOpen(false); setInputValue('') }}>Cancelar</Button>
                    <Button onClick={handleAddItem} variant="contained">Adicionar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default List
