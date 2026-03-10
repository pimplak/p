import { Drawer, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import { useBottomSheetState } from '../../hooks/useBottomSheetState';
import { useTheme } from '../../hooks/useTheme';
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
  const { currentPalette } = useTheme();

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
      title={title ? (
        <Text fw={700} size="lg" style={{ color: currentPalette.text }}>
          {title}
        </Text>
      ) : undefined}
      size={isMobile ? '90%' : '40%'}
      overlayProps={{ opacity: 0.5, blur: 4 }}
      closeOnClickOutside={true}
      closeOnEscape={true}
      withCloseButton={true}
      styles={{
        root: {
          zIndex: 3000,
        },
        content: {
          backgroundColor: currentPalette.background,
          borderTopLeftRadius: isMobile ? '16px' : '0',
          borderTopRightRadius: isMobile ? '16px' : '0',
          borderBottomLeftRadius: isMobile ? '0' : '16px',
          borderBottomRightRadius: isMobile ? '0' : '16px',
        },
        header: {
          backgroundColor: currentPalette.background,
          borderBottom: `1px solid ${currentPalette.text}15`,
          paddingBottom: 'var(--mantine-spacing-md)',
        },
        body: {
          paddingTop: 'var(--mantine-spacing-md)',
          paddingBottom: isMobile
            ? 'calc(100px + env(safe-area-inset-bottom))'
            : 'var(--mantine-spacing-md)',
          display: 'flex',
          flexDirection: 'column',
        },
        close: {
          color: currentPalette.text,
        },
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
} 