import { useRef, useCallback } from 'react'

interface LongPressOptions {
    threshold?: number
    moveThreshold?: number
}

interface LongPressHandlers {
    onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void
    onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void
    onTouchEnd: () => void
    onMouseDown: (e: React.TouchEvent | React.MouseEvent) => void
    onMouseMove: (e: React.TouchEvent | React.MouseEvent) => void
    onMouseUp: () => void
    onMouseLeave: () => void
}

export function useLongPress(
    onLongPress: () => void,
    { threshold = 1000, moveThreshold = 5 }: LongPressOptions = {}
): LongPressHandlers {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const startPosRef = useRef<{ x: number; y: number } | null>(null)
    const firedRef = useRef(false)

    const getCoords = (e: React.TouchEvent | React.MouseEvent) => {
        if ('touches' in e) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        return { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY }
    }

    const start = useCallback(
        (e: React.TouchEvent | React.MouseEvent) => {
            firedRef.current = false
            startPosRef.current = getCoords(e)
            timerRef.current = setTimeout(() => {
                firedRef.current = true
                onLongPress()
            }, threshold)
        },
        [onLongPress, threshold]
    )

    const move = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!startPosRef.current || firedRef.current) return
        const { x, y } = getCoords(e)
        const dx = Math.abs(x - startPosRef.current.x)
        const dy = Math.abs(y - startPosRef.current.y)
        if (dx > moveThreshold || dy > moveThreshold) {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [moveThreshold])

    const cancel = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        startPosRef.current = null
    }, [])

    return {
        onTouchStart: start,
        onTouchMove: move,
        onTouchEnd: cancel,
        onMouseDown: start,
        onMouseMove: move,
        onMouseUp: cancel,
        onMouseLeave: cancel,
    }
}
