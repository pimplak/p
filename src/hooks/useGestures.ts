import { useEffect, useRef, useCallback } from 'react';

interface GestureConfig {
    minSwipeDistance?: number;
    maxSwipeTime?: number;
    enableDrawer?: boolean;
    onDrawerOpen?: () => void;
    onDrawerClose?: () => void;
    onDrawerProgress?: (progress: number) => void;
    onDrawerStateChange?: (isOpen: boolean) => void;
    isDrawerOpen?: boolean;
}

interface TouchPoint {
    x: number;
    y: number;
    timestamp: number;
}

export function useGestures(config: GestureConfig = {}) {
    const {
        minSwipeDistance = 50,
        maxSwipeTime = 300,
        enableDrawer = true,
        onDrawerOpen,
        onDrawerClose,
        onDrawerProgress,
        onDrawerStateChange,
        isDrawerOpen: externalIsDrawerOpen,
    } = config;

    const touchStart = useRef<TouchPoint | null>(null);
    const touchEnd = useRef<TouchPoint | null>(null);
    const isDrawerOpen = useRef(false);
    const isDragging = useRef(false);

    useEffect(() => {
        if (externalIsDrawerOpen !== undefined) {
            isDrawerOpen.current = externalIsDrawerOpen;
        }
    }, [externalIsDrawerOpen]);

    const onTouchStart = useCallback((e: TouchEvent) => {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            timestamp: Date.now(),
        };
        isDragging.current = false;
    }, []);

    const onTouchMove = useCallback((e: TouchEvent) => {
        if (!touchStart.current) return;

        const currentX = e.touches[0].clientX;
        const startX = touchStart.current.x;
        const deltaX = currentX - startX;

        // Sprawdź czy to swipe z lewej krawędzi
        if (enableDrawer && startX < 50 && deltaX > 20) {
            isDragging.current = true;
            document.body.style.overflow = 'hidden';

            // Oblicz progress dla wizualnego feedbacku
            const progress = Math.min(deltaX / 150, 1); // 150px = pełny swipe
            onDrawerProgress?.(progress);
        }
    }, [enableDrawer, onDrawerProgress]);

    const onTouchEnd = useCallback((e: TouchEvent) => {
        if (!touchStart.current) return;

        touchEnd.current = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
            timestamp: Date.now(),
        };

        const start = touchStart.current;
        const end = touchEnd.current;
        const deltaX = end.x - start.x;
        const deltaTime = end.timestamp - start.timestamp;

        // Sprawdź czy to swipe (nie tap)
        if (deltaTime > maxSwipeTime) {
            touchStart.current = null;
            touchEnd.current = null;
            document.body.style.overflow = '';
            return;
        }

        // Drawer gesture - swipe z lewej krawędzi
        if (enableDrawer && start.x < 50 && deltaX > minSwipeDistance) {
            if (!isDrawerOpen.current) {
                isDrawerOpen.current = true;
                onDrawerStateChange?.(true);
                onDrawerOpen?.();
            }
        }
        // Zamknij drawer - swipe w prawo na otwartym drawerze
        else if (enableDrawer && isDrawerOpen.current && deltaX < -minSwipeDistance) {
            isDrawerOpen.current = false;
            onDrawerStateChange?.(false);
            onDrawerClose?.();
        }

        touchStart.current = null;
        touchEnd.current = null;
        document.body.style.overflow = '';
        isDragging.current = false;
        onDrawerProgress?.(0); // Reset progress
    }, [minSwipeDistance, maxSwipeTime, enableDrawer, onDrawerOpen, onDrawerClose, onDrawerProgress, onDrawerStateChange]);

    useEffect(() => {
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove', onTouchMove, { passive: true });
        document.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            document.body.style.overflow = '';
        };
    }, [onTouchStart, onTouchMove, onTouchEnd]);

    return {
        isDrawerOpen: isDrawerOpen.current,
        isDragging: isDragging.current,
    };
} 