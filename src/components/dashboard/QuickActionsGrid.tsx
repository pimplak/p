import { Stack, Text, UnstyledButton } from '@mantine/core';
import {
  IconUserPlus,
  IconMessageCircle,
  IconChartBar,
  IconNote,
  IconCalendarPlus,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { BulkSMSReminders } from '../BulkSMSReminders';

export const ACTION_IDS = ['add-patient', 'send-reminders', 'reports', 'new-note', 'add-session'] as const;
type ActionId = (typeof ACTION_IDS)[number];

export function QuickActionsGrid() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentPalette } = useTheme();
  const [hoveredId, setHoveredId] = useState<ActionId | null>(null);

  const actions: {
    id: ActionId;
    labelKey: string;
    icon: React.ElementType;
    isSpecial?: boolean;
    onClick?: () => void;
  }[] = [
    {
      id: 'add-patient',
      labelKey: 'dashboard.actions.addPatient',
      icon: IconUserPlus,
      onClick: () => navigate('/patients'),
    },
    {
      id: 'send-reminders',
      labelKey: 'dashboard.actions.sendReminders',
      icon: IconMessageCircle,
      isSpecial: true,
    },
    {
      id: 'reports',
      labelKey: 'dashboard.actions.reports',
      icon: IconChartBar,
      onClick: () => navigate('/analytics'),
    },
    {
      id: 'new-note',
      labelKey: 'dashboard.actions.newNote',
      icon: IconNote,
      onClick: () => navigate('/notes'),
    },
    {
      id: 'add-session',
      labelKey: 'dashboard.actions.addSession',
      icon: IconCalendarPlus,
      onClick: () => navigate('/calendar'),
    },
  ];

  const getButtonStyle = (id: ActionId) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '16px 14px',
    borderRadius: 12,
    backgroundColor:
      hoveredId === id ? `${currentPalette.primary}25` : `${currentPalette.primary}12`,
    border: `1px solid ${hoveredId === id ? currentPalette.primary : `${currentPalette.primary}35`}`,
    transition: 'all 150ms ease-out',
    minWidth: 88,
    flex: 1,
    cursor: 'pointer',
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 2,
      }}
    >
      {actions.map(action => {
        const Icon = action.icon;
        const label = t(action.labelKey);

        if (action.isSpecial && action.id === 'send-reminders') {
          return (
            <BulkSMSReminders key={action.id} variant="custom" onRemindersSent={() => {}}>
              <div
                style={getButtonStyle(action.id)}
                onMouseEnter={() => setHoveredId(action.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Icon size={22} stroke={1.5} style={{ color: currentPalette.primary }} />
                <Text
                  size="xs"
                  fw={500}
                  ta="center"
                  style={{ color: currentPalette.text, lineHeight: 1.2 }}
                >
                  {label}
                </Text>
              </div>
            </BulkSMSReminders>
          );
        }

        return (
          <UnstyledButton
            key={action.id}
            onClick={action.onClick}
            style={getButtonStyle(action.id)}
            onMouseEnter={() => setHoveredId(action.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Stack gap={6} align="center" justify="center">
              <Icon size={22} stroke={1.5} style={{ color: currentPalette.primary }} />
              <Text
                size="xs"
                fw={500}
                ta="center"
                style={{ color: currentPalette.text, lineHeight: 1.2 }}
              >
                {label}
              </Text>
            </Stack>
          </UnstyledButton>
        );
      })}
    </div>
  );
}
