import { useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ListItem as ListItemType } from '../types/index'
import { formatTime } from '../services/analyticsService'
import { useLongPress } from '../hooks/useLongPress'

interface ListItemProps {
    item: ListItemType
    onToggleItem: (itemId: string) => void
    onDeleteItem: (itemId: string) => void
    onDragStart: (itemId: string) => void
    onDragEnd: (isOverTrash: boolean) => void
    onTrashEnter: () => void
    onTrashLeave: () => void
    trashVisible: boolean
}

function ListItem({ item, onToggleItem, onDragStart, onDragEnd, trashVisible }: ListItemProps) {
    const itemRef = useRef<HTMLDivElement>(null)
    const isDraggingRef = useRef(false)
    const originRef = useRef<{ x: number; y: number } | null>(null)
    const rafRef = useRef<number | null>(null)

    const TRASH_RADIUS = 44

    const getTrashCenter = (): { x: number; y: number } | null => {
        const trash = document.querySelector('[data-trash-zone]') as HTMLElement | null
        if (!trash) return null
        const r = trash.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }

    const isOverTrash = (clientX: number, clientY: number): boolean => {
        const center = getTrashCenter()
        if (!center) return false
        const dx = clientX - center.x
        const dy = clientY - center.y
        return Math.sqrt(dx * dx + dy * dy) < TRASH_RADIUS
    }

    const startDrag = useCallback(() => {
        isDraggingRef.current = true
        onDragStart(item.id)
        if (itemRef.current) {
            itemRef.current.style.transition = 'none'
            itemRef.current.style.opacity = '0.6'
            itemRef.current.style.zIndex = '1500'
            itemRef.current.style.position = 'relative'
        }
    }, [item.id, onDragStart])

    const endDrag = useCallback((clientX: number, clientY: number) => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        const over = isOverTrash(clientX, clientY)
        if (itemRef.current) {
            itemRef.current.style.transform = ''
            itemRef.current.style.opacity = ''
            itemRef.current.style.zIndex = ''
            itemRef.current.style.position = ''
            itemRef.current.style.transition = 'transform 0.2s ease'
        }
        originRef.current = null
        onDragEnd(over)
    }, [onDragEnd]) // eslint-disable-line react-hooks/exhaustive-deps

    const longPressHandlers = useLongPress(startDrag, { threshold: 1000 })

    const handleTouchMove = (e: React.TouchEvent) => {
        longPressHandlers.onTouchMove(e)
        if (!isDraggingRef.current) return
        const touch = e.touches[0]
        if (!originRef.current) originRef.current = { x: touch.clientX, y: touch.clientY }
        const dx = touch.clientX - originRef.current.x
        const dy = touch.clientY - originRef.current.y
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
            if (itemRef.current) itemRef.current.style.transform = `translate(${dx}px, ${dy}px)`
        })
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        longPressHandlers.onTouchEnd()
        if (!isDraggingRef.current) return
        const touch = e.changedTouches[0]
        endDrag(touch.clientX, touch.clientY)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        longPressHandlers.onMouseMove(e)
        if (!isDraggingRef.current) return
        if (!originRef.current) originRef.current = { x: e.clientX, y: e.clientY }
        const dx = e.clientX - originRef.current.x
        const dy = e.clientY - originRef.current.y
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
            if (itemRef.current) itemRef.current.style.transform = `translate(${dx}px, ${dy}px)`
        })
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        longPressHandlers.onMouseUp()
        if (!isDraggingRef.current) return
        endDrag(e.clientX, e.clientY)
    }

    return (
        <Box
            ref={itemRef}
            sx={{
                width: '100%',
                px: 1.5,
                py: 1,
                touchAction: 'none',
                userSelect: 'none',
                cursor: trashVisible ? 'grabbing' : 'default',
            }}
            onTouchStart={longPressHandlers.onTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={longPressHandlers.onMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={longPressHandlers.onMouseLeave}
        >
            <Stack direction="row" sx={{ alignItems: 'center', width: '100%', gap: 1 }}>
                <Checkbox
                    checked={item.completed}
                    onChange={() => onToggleItem(item.id)}
                    onMouseDown={e => e.stopPropagation()}
                    onTouchStart={e => e.stopPropagation()}
                    size="medium"
                    sx={{ p: 0.5, flexShrink: 0 }}
                />
                <Typography
                    variant="body1"
                    sx={{
                        flex: 1,
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? 'text.disabled' : 'text.primary',
                        wordBreak: 'break-word',
                    }}
                >
                    {item.title}
                </Typography>
                {item.completedAt && (
                    <Typography variant="caption" color="success.main" sx={{ flexShrink: 0, fontWeight: 500 }}>
                        {formatTime(item.completedAt)}
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}

export default ListItem
