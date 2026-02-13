import { Card, SimpleGrid, Stack, Text, UnstyledButton } from '@mantine/core';
import {
  IconUserPlus,
  IconMessageCircle,
  IconChartBar,
  IconNote,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { BulkSMSReminders } from '../BulkSMSReminders';

const actions = [
  {
    id: 'add-patient',
    label: 'Dodaj pacjenta',
    icon: IconUserPlus,
    href: '/patients',
    onClick: (navigate: (path: string) => void) => navigate('/patients'),
  },
  {
    id: 'send-reminders',
    label: 'Wyślij przypomnienia',
    icon: IconMessageCircle,
    isSpecial: true,
    onClick: (navigate: (path: string) => void) => navigate('/reminders'),
  },
  {
    id: 'reports',
    label: 'Raporty',
    icon: IconChartBar,
    onClick: (navigate: (path: string) => void) => navigate('/analytics'),
  },
  {
    id: 'new-note',
    label: 'Nowa notatka',
    icon: IconNote,
    onClick: (navigate: (path: string) => void) => navigate('/notes'),
  },
];

export function QuickActionsGrid() {
  const navigate = useNavigate();
  const { currentPalette, mantineTheme } = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getCardStyle = (id: string, isPointer: boolean = true) => ({
    backgroundColor: currentPalette.surface,
    border: `1px solid ${hoveredId === id ? currentPalette.accent : currentPalette.primary}`,
    boxShadow: hoveredId === id ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 200ms ease-out',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    cursor: isPointer ? 'pointer' : 'default',
    transform: hoveredId === id ? 'translateY(-2px)' : 'translateY(0)',
  });

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={mantineTheme.spacing?.md ?? 'md'}>
      {actions.map(action => {
        const Icon = action.icon;
        
        if (action.isSpecial && action.id === 'send-reminders') {
          return (
            <BulkSMSReminders
              key={action.id}
              variant="custom"
              onRemindersSent={() => {}}
            >
              <Card
                padding="lg"
                radius="md"
                style={getCardStyle(action.id)}
                onMouseEnter={() => setHoveredId(action.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Stack gap="sm" align="center" justify="center" style={{ flex: 1 }}>
                  <div style={{ color: currentPalette.primary }}>
                    <Icon size={28} stroke={1.5} />
                  </div>
                  <Text size="sm" fw={500} ta="center" style={{ color: currentPalette.text }}>
                    {action.label}
                  </Text>
                </Stack>
              </Card>
            </BulkSMSReminders>
          );
        }

        return (
          <UnstyledButton
            key={action.id}
            onClick={() => action.onClick?.(navigate)}
            style={{ height: '100%' }}
            onMouseEnter={() => setHoveredId(action.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Card
              padding="lg"
              radius="md"
              style={getCardStyle(action.id)}
            >
              <Stack gap="sm" align="center" justify="center" style={{ flex: 1 }}>
                <div
                  style={{
                    color: currentPalette.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={28} stroke={1.5} />
                </div>
                <Text size="sm" fw={500} ta="center" style={{ color: currentPalette.text }}>
                  {action.label}
                </Text>
              </Stack>
            </Card>
          </UnstyledButton>
        );
      })}
    </SimpleGrid>
  );
}
