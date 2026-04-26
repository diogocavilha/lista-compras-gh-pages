import { useRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import { useTheme } from '@mui/material/styles'
import { ListItem as ListItemType } from '../types/index'

interface ListItemProps {
    item: ListItemType
    index: number
    onToggleItem: (itemId: string) => void
    onDeleteItem: (itemId: string) => void
    onDragStart: (index: number, clientY: number) => void
    onEditItem?: (itemId: string) => void
    swipeable?: boolean
}

function ListItem({ item, index, onToggleItem, onDeleteItem, onDragStart, onEditItem, swipeable = true }: ListItemProps) {
    const theme = useTheme()
    const cardRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLDivElement>(null)
    const gestureRef = useRef<{
        startX: number
        startY: number
        startTime: number
        axis: 'horizontal' | 'vertical' | null
        active: boolean
    }>({ startX: 0, startY: 0, startTime: 0, axis: null, active: false })

    const removeListeners = (onMove: EventListener, onUp: EventListener) => {
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('touchend', onUp)
        document.removeEventListener('mouseup', onUp)
    }

    const handlePointerDown = (startX: number, startY: number) => {
        if (!swipeable) return
        gestureRef.current = { startX, startY, startTime: Date.now(), axis: null, active: true }

        const onMove = (e: Event) => {
            const te = e as TouchEvent | MouseEvent
            if (!gestureRef.current.active) return
            const clientX = 'touches' in te ? te.touches[0].clientX : te.clientX
            const clientY = 'touches' in te ? te.touches[0].clientY : te.clientY
            const dx = clientX - gestureRef.current.startX
            const dy = clientY - gestureRef.current.startY

            if (!gestureRef.current.axis) {
                if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
                gestureRef.current.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
            }

            if (gestureRef.current.axis === 'vertical') {
                gestureRef.current.active = false
                removeListeners(onMove, onUp)
                onDragStart(index, clientY)
                return
            }

            // Horizontal swipe
            te.preventDefault()
            if (cardRef.current) {
                cardRef.current.style.transform = `translateX(${dx}px)`
                cardRef.current.style.transition = 'none'
            }
            if (bgRef.current) {
                bgRef.current.style.display = 'flex'
                bgRef.current.style.backgroundColor = dx < 0 ? '#ffcdd2' : '#c8e6c9'
                bgRef.current.style.justifyContent = dx < 0 ? 'flex-end' : 'flex-start'
            }
        }

        const onUp = (e: Event) => {
            const te = e as TouchEvent | MouseEvent
            const touchDuration = Date.now() - gestureRef.current.startTime
            if (!gestureRef.current.active) {
                gestureRef.current.active = false
                removeListeners(onMove, onUp)
                return
            }
            if (gestureRef.current.axis !== 'horizontal') {
                gestureRef.current.active = false
                removeListeners(onMove, onUp)
                if (touchDuration < 200 && onEditItem) {
                    onEditItem(item.id)
                }
                return
            }
            const clientX = 'changedTouches' in te ? te.changedTouches[0].clientX : te.clientX
            const dx = clientX - gestureRef.current.startX
            const cardWidth = cardRef.current?.offsetWidth ?? 300
            const threshold = cardWidth * 0.4

            if (cardRef.current) {
                cardRef.current.style.transition = 'transform 0.2s ease'
                cardRef.current.style.transform = ''
            }
            if (bgRef.current) {
                bgRef.current.style.display = 'none'
            }

            if (dx < -threshold) {
                onDeleteItem(item.id)
            } else if (dx > threshold) {
                onToggleItem(item.id)
            }

            gestureRef.current.active = false
            removeListeners(onMove, onUp)
        }

        document.addEventListener('touchmove', onMove, { passive: false })
        document.addEventListener('mousemove', onMove)
        document.addEventListener('touchend', onUp)
        document.addEventListener('mouseup', onUp)
    }

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', mb: 1, borderRadius: 2 }}>
            {/* Swipe background reveal */}
            <Box
                ref={bgRef}
                sx={{
                    display: 'none',
                    position: 'absolute',
                    inset: 0,
                    alignItems: 'center',
                    px: 2,
                    borderRadius: 2,
                    pointerEvents: 'none',
                }}
            />
            {/* Card */}
            <Card
                ref={cardRef}
                elevation={1}
                sx={{
                    borderRadius: 2,
                    bgcolor: item.deleted ? 'error.main' : item.completed ? 'success.main' : theme.palette.background.paper,
                    userSelect: 'none',
                    touchAction: swipeable ? 'pan-y' : 'auto',
                }}
                onTouchStart={e => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
                onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
            >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                flex: 1,
                                opacity: item.completed ? 0.8 : 1,
                                wordBreak: 'break-word',
                            }}
                        >
                            {item.title}
                        </Typography>
                        {item.completed && (
                            <CheckIcon sx={{ color: 'success.dark', flexShrink: 0 }} />
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ListItem
