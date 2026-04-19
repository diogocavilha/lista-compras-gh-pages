import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fab from '@mui/material/Fab'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { ListItem as ListItemType, ShoppingList } from '../types/index'
import { formatListDate } from '../services/analyticsService'
import ListItem from './ListItem'

interface ListProps {
    list: ShoppingList | null
    onAddItem: (title: string) => void
    onToggleItem: (itemId: string) => void
    onDeleteItem: (itemId: string) => void
    onReorderItems: (from: number, to: number) => void
    onCreateNewList: () => void
    showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void
}

function List({ list, onAddItem, onToggleItem, onDeleteItem, onReorderItems, onCreateNewList, showSnackbar }: ListProps) {
    const [addItemOpen, setAddItemOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const dragRef = useRef<{
        dragIndex: number | null
        hoverIndex: number | null
        startY: number
        originalRects: DOMRect[]
    }>({ dragIndex: null, hoverIndex: null, startY: 0, originalRects: [] })

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

    const handleDragStart = (index: number, clientY: number) => {
        const activeEls = itemRefs.current.filter(Boolean)
        const rects = itemRefs.current.map(el => el ? el.getBoundingClientRect() : new DOMRect())
        dragRef.current = { dragIndex: index, hoverIndex: index, startY: clientY, originalRects: rects }

        const draggedEl = itemRefs.current[index]
        if (draggedEl) {
            draggedEl.style.transition = 'none'
            draggedEl.style.zIndex = '100'
            draggedEl.style.position = 'relative'
            draggedEl.style.opacity = '0.85'
        }
        activeEls.forEach((el, i) => {
            if (el && i !== index) el.style.transition = 'transform 0.15s ease'
        })

        const onMove = (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            const clientYNow = 'touches' in e ? e.touches[0].clientY : e.clientY
            const { dragIndex, startY, originalRects } = dragRef.current
            if (dragIndex === null) return

            const deltaY = clientYNow - startY
            const el = itemRefs.current[dragIndex]
            if (!el) return
            el.style.transform = `translateY(${deltaY}px)`

            const draggedRect = originalRects[dragIndex]
            const draggedCenterY = draggedRect.top + draggedRect.height / 2 + deltaY
            const cardHeight = draggedRect.height

            let newHoverIndex = dragIndex
            for (let i = 0; i < itemRefs.current.length; i++) {
                if (i === dragIndex) continue
                const cardEl = itemRefs.current[i]
                if (!cardEl || !originalRects[i]) continue
                const cardCenterY = originalRects[i].top + originalRects[i].height / 2
                if (i < dragIndex && draggedCenterY < cardCenterY) {
                    cardEl.style.transform = `translateY(${cardHeight}px)`
                    newHoverIndex = Math.min(newHoverIndex, i)
                } else if (i > dragIndex && draggedCenterY > cardCenterY) {
                    cardEl.style.transform = `translateY(-${cardHeight}px)`
                    newHoverIndex = Math.max(newHoverIndex, i)
                } else {
                    cardEl.style.transform = ''
                }
            }
            dragRef.current.hoverIndex = newHoverIndex
        }

        const onEnd = () => {
            const { dragIndex, hoverIndex } = dragRef.current
            itemRefs.current.forEach(el => {
                if (el) {
                    el.style.transform = ''
                    el.style.transition = ''
                    el.style.zIndex = ''
                    el.style.position = ''
                    el.style.opacity = ''
                }
            })
            if (dragIndex !== null && hoverIndex !== null && hoverIndex !== dragIndex) {
                onReorderItems(dragIndex, hoverIndex)
            }
            dragRef.current = { dragIndex: null, hoverIndex: null, startY: 0, originalRects: [] }
            document.removeEventListener('touchmove', onMove)
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('touchend', onEnd)
            document.removeEventListener('mouseup', onEnd)
        }

        document.addEventListener('touchmove', onMove, { passive: false })
        document.addEventListener('mousemove', onMove)
        document.addEventListener('touchend', onEnd)
        document.addEventListener('mouseup', onEnd)
    }

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

    const activeItems = list.items.filter(i => !(i.deleted ?? false))
    const deletedItems = list.items.filter(i => i.deleted ?? false)
    const completedCount = activeItems.filter(item => item.completed).length

    return (
        <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
            {/* List metadata */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Lista de compras</Typography>
                <Typography variant="caption" color="text.secondary">
                    Criada: {formatListDate(list.createdAt)} · {activeItems.length} itens, {completedCount} concluídos
                </Typography>
            </Box>

            {/* Active items */}
            {activeItems.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Nenhum item ainda. Toque no botão + para adicionar!
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {activeItems.map((item: ListItemType, index: number) => (
                        <Box
                            key={item.id}
                            ref={(el: HTMLDivElement | null) => { itemRefs.current[index] = el }}
                        >
                            <ListItem
                                item={item}
                                index={index}
                                onToggleItem={onToggleItem}
                                onDeleteItem={onDeleteItem}
                                onDragStart={handleDragStart}
                            />
                        </Box>
                    ))}
                </Box>
            )}

            {/* Deleted items section */}
            {deletedItems.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Excluídos
                    </Typography>
                    {deletedItems.map((item: ListItemType) => (
                        <Box key={item.id} sx={{ bgcolor: 'error.light', borderRadius: 2, mb: 1 }}>
                            <ListItem
                                item={item}
                                index={-1}
                                swipeable={false}
                                onToggleItem={onToggleItem}
                                onDeleteItem={onDeleteItem}
                                onDragStart={() => {}}
                            />
                        </Box>
                    ))}
                </Box>
            )}

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
