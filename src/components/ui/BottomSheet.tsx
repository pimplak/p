import { Drawer } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      title={title}
      size={isMobile ? '100%' : '60%'}
      overlayProps={{ opacity: 0.5, blur: 4 }}
      closeOnClickOutside={true}
      closeOnEscape={true}
      withCloseButton={true}
      styles={{
        root: {
          zIndex: 1000,
        },
        content: {
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        },
        header: {
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          paddingBottom: 'var(--mantine-spacing-md)',
        },
        body: {
          paddingTop: 'var(--mantine-spacing-md)',
        },
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
} 