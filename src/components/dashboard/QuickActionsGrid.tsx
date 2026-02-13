import { Card, SimpleGrid, Stack, Text } from '@mantine/core';
import {
  IconUserPlus,
  IconMessageCircle,
  IconChartBar,
  IconNote,
} from '@tabler/icons-react';
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

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={mantineTheme.spacing?.md ?? 'md'}>
      {actions.map(action => {
        const Icon = action.icon;
        if (action.isSpecial && action.id === 'send-reminders') {
          return (
            <Card
              key={action.id}
              padding="lg"
              radius="md"
              style={{
                backgroundColor: currentPalette.surface,
                border: `1px solid ${currentPalette.primary}40`,
                cursor: 'default',
              }}
            >
              <Stack gap="sm" align="center">
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
                <Text size="sm" fw={500} style={{ color: currentPalette.text }}>
                  {action.label}
                </Text>
                <BulkSMSReminders
                  variant="button"
                  size="xs"
                  onRemindersSent={() => {}}
                />
              </Stack>
            </Card>
          );
        }
        return (
          <Card
            key={action.id}
            padding="lg"
            radius="md"
            style={{
              backgroundColor: currentPalette.surface,
              border: `1px solid ${currentPalette.primary}40`,
              cursor: 'pointer',
              transition: 'all 200ms ease-out',
            }}
            onClick={() => action.onClick?.(navigate)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                action.onClick?.(navigate);
              }
            }}
            tabIndex={0}
            role="button"
          >
            <Stack gap="sm" align="center">
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
              <Text size="sm" fw={500} style={{ color: currentPalette.text }}>
                {action.label}
              </Text>
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
