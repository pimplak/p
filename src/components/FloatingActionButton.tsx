import {
  ActionIcon,
  Stack,
  Affix,
  Transition,
  Paper,
  Group,
  Text,
} from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

export interface FABAction {
  id: string;
  icon: ReactNode;
  label: string;
  color?: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  position?: { bottom: number; right: number };
}

export function FloatingActionButton({
  actions,
  position = { bottom: 100, right: 20 },
}: FloatingActionButtonProps) {
  const [opened, setOpened] = useState(false);
  const { currentPalette } = useTheme();

  if (actions.length === 0) return null;

  // Jeśli tylko jedna akcja, pokaż jako prosty FAB
  if (actions.length === 1) {
    const action = actions[0];
    return (
      <Affix
        position={position}
        hiddenFrom='md'
        className='floating-action-button'
      >
        <ActionIcon
          size='xl'
          radius='xl'
          variant='filled'
          style={{
            backgroundColor: currentPalette.primary,
            color: currentPalette.surface,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${currentPalette.primary}`,
            zIndex: 1001,
          }}
          onClick={action.onClick}
        >
          {action.icon}
        </ActionIcon>
      </Affix>
    );
  }

  // Jeśli więcej akcji, pokaż expandable menu
  return (
    <Affix
      position={position}
      hiddenFrom='md'
      className='floating-action-button'
    >
      <Stack gap='sm' align='flex-end' style={{ zIndex: 1001 }}>
        {/* Menu Actions */}
        <Transition
          mounted={opened}
          transition='slide-up'
          duration={200}
          timingFunction='ease'
        >
          {styles => (
            <Stack gap='xs' style={{ ...styles, zIndex: 1001 }}>
              {actions.map(action => (
                <Paper
                  key={action.id}
                  p='xs'
                  style={{
                    backgroundColor: currentPalette.surface,
                    color: currentPalette.text,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${currentPalette.primary}`,
                    zIndex: 1001,
                  }}
                >
                  <Group
                    gap='sm'
                    wrap='nowrap'
                    onClick={action.onClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <Text
                      size='sm'
                      fw={500}
                      style={{ minWidth: 'max-content' }}
                    >
                      {action.label}
                    </Text>
                    <ActionIcon
                      size='lg'
                      radius='xl'
                      variant='filled'
                      style={{
                        backgroundColor: currentPalette.primary,
                        color: currentPalette.surface,
                      }}
                    >
                      {action.icon}
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </Transition>

        {/* Main FAB */}
        <ActionIcon
          size='xl'
          radius='xl'
          variant='filled'
          onClick={() => setOpened(!opened)}
          style={{
            backgroundColor: currentPalette.primary,
            color: currentPalette.surface,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${currentPalette.primary}`,
            transform: opened ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            zIndex: 1001,
          }}
        >
          {opened ? <IconX size='1.5rem' /> : <IconPlus size='1.5rem' />}
        </ActionIcon>
      </Stack>
    </Affix>
  );
}
