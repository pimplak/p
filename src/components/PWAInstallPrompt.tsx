import { Button, Group, Notification, rem } from '@mantine/core';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import { usePWA } from '../hooks/usePWA';

export function PWAInstallPrompt() {
  const { isInstallable, installPWA, needRefresh, updatePWA, closeRefreshPrompt } = usePWA();

  if (!isInstallable && !needRefresh) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {isInstallable && (
        <Notification
          icon={<IconDownload size={rem(20)} />}
          color="blue"
          title="Install P"
          onClose={() => {}} // Keep visible until user installs
          withCloseButton={false}
          mb="md"
        >
          <Group mt="sm">
            <Button
              size="xs"
              onClick={installPWA}
              leftSection={<IconDownload size={rem(16)} />}
            >
              Install App
            </Button>
          </Group>
        </Notification>
      )}

      {needRefresh && (
        <Notification
          icon={<IconRefresh size={rem(20)} />}
          color="green"
          title="Update Available"
          onClose={closeRefreshPrompt}
          withCloseButton
        >
          <Group mt="sm">
            <Button
              size="xs"
              onClick={updatePWA}
              leftSection={<IconRefresh size={rem(16)} />}
            >
              Update Now
            </Button>
          </Group>
        </Notification>
      )}
    </div>
  );
} 