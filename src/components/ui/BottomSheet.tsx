import { Drawer } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import { useBottomSheetState } from '../../hooks/useBottomSheetState';
import type { DrawerProps } from '@mantine/core';

interface BottomSheetProps extends Omit<DrawerProps, 'position'> {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({
  opened,
  onClose,
  title,
  children,
  ...props
}: BottomSheetProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { openBottomSheet, closeBottomSheet } = useBottomSheetState();

  // Synchronizuj stan z globalnym store
  useEffect(() => {
    if (opened) {
      openBottomSheet();
    } else {
      closeBottomSheet();
    }
  }, [opened, openBottomSheet, closeBottomSheet]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position={isMobile ? "bottom" : "right"}
      title={title}
      size={isMobile ? '90%' : '40%'}
      overlayProps={{ opacity: 0.5, blur: 4 }}
      closeOnClickOutside={true}
      closeOnEscape={true}
      withCloseButton={true}
      styles={{
        root: {
          zIndex: 1000,
        },
        content: {
          borderTopLeftRadius: isMobile ? '16px' : '0',
          borderTopRightRadius: isMobile ? '16px' : '0',
          borderBottomLeftRadius: isMobile ? '0' : '16px',
          borderBottomRightRadius: isMobile ? '0' : '16px',
        },
        header: {
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          paddingBottom: 'var(--mantine-spacing-md)',
        },
        body: {
          paddingTop: 'var(--mantine-spacing-md)',
          paddingBottom: isMobile ? '100px' : 'var(--mantine-spacing-md)',
        },
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
} 