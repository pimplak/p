import {
  ActionIcon,
  Stack,
  Affix,
  Transition,
  Paper,
  Group,
  Text,
  Box,
} from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBottomSheetState } from '../hooks/useBottomSheetState';
import { useTheme } from '../hooks/useTheme';
import type { ReactNode } from 'react';

export interface FABAction {
  id: string;
  icon: ReactNode;
  label: string;
  color?: string;
  onClick: () => void;
  disabled?: boolean;
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
  const { isAnyBottomSheetOpen } = useBottomSheetState();

  // Blokuj scrollowanie gdy menu jest otwarte
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup przy unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [opened]);

  if (actions.length === 0) return null;

  // Ukryj FAB gdy bottom sheet jest otwarty
  if (isAnyBottomSheetOpen) return null;

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
    <>
      {/* Overlay via Portal */}
      {opened &&
        createPortal(
          <Transition
            mounted={opened}
            transition='fade'
            duration={200}
            timingFunction='ease'
          >
            {styles => (
              <Box
                style={{
                  ...styles,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  zIndex: 1000,
                  pointerEvents: 'auto',
                }}
                onClick={() => setOpened(false)}
              />
            )}
          </Transition>,
          document.body
        )}

      <Affix
        position={position}
        hiddenFrom='md'
        className='floating-action-button'
        style={{ zIndex: 1001 }}
      >
        <Stack gap='sm' align='flex-end'>
          {/* Menu Actions */}
          <Transition
            mounted={opened}
            transition='slide-up'
            duration={200}
            timingFunction='ease'
          >
            {styles => (
              <Stack gap='xs' style={styles}>
                {actions.map(action => (
                  <Paper
                    key={action.id}
                    p='xs'
                    style={{
                      backgroundColor: currentPalette.surface,
                      color: currentPalette.text,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      border: `1px solid ${currentPalette.primary}`,
                    }}
                  >
                    <Group
                      gap='sm'
                      wrap='nowrap'
                      onClick={() => {
                        if (!action.disabled) {
                          action.onClick();
                          setOpened(false);
                        }
                      }}
                      style={{ 
                        cursor: action.disabled ? 'not-allowed' : 'pointer',
                        opacity: action.disabled ? 0.5 : 1,
                      }}
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
            }}
          >
            {opened ? <IconX size='1.5rem' /> : <IconPlus size='1.5rem' />}
          </ActionIcon>
        </Stack>
      </Affix>
    </>
  );
}
