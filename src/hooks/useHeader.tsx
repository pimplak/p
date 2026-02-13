import { useEffect } from 'react';
import { useHeaderStore } from '../stores/useHeaderStore';
import type { ReactNode } from 'react';

export interface UseHeaderOptions {
  title?: ReactNode;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

/**
 * Hook to set the dynamic header content for the current screen.
 * Resets to empty slots on unmount so the next screen can set its own header.
 */
export function useHeader(options: UseHeaderOptions) {
  const setHeader = useHeaderStore(s => s.setHeader);
  const resetHeader = useHeaderStore(s => s.resetHeader);

  useEffect(() => {
    setHeader({
      title: options.title ?? '',
      leftSlot: options.leftSlot ?? null,
      rightSlot: options.rightSlot ?? null,
    });
    return resetHeader;
  }, [options.title, options.leftSlot, options.rightSlot, setHeader, resetHeader]);
}
