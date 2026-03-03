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

  const getIconBoxStyle = (id: ActionId) => ({
    width: 64,
    height: 64,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      hoveredId === id ? `${currentPalette.primary}18` : currentPalette.surface,
    border: `1px solid ${hoveredId === id ? `${currentPalette.primary}30` : `${currentPalette.text}08`}`,
    transition: 'all 150ms ease-out',
  });

  const labelStyle = {
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: `${currentPalette.text}60`,
    lineHeight: 1.2,
    textAlign: 'center' as const,
  };

  const renderTile = (action: typeof actions[number]) => {
    const Icon = action.icon;
    const label = t(action.labelKey);

    return (
      <Stack gap={8} align="center" style={{ width: 76 }}>
        <div style={getIconBoxStyle(action.id)}>
          <Icon size={24} stroke={1.5} style={{ color: currentPalette.primary }} />
        </div>
        <Text style={labelStyle}>{label}</Text>
      </Stack>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 2,
      }}
    >
      {actions.map(action => {
        if (action.isSpecial && action.id === 'send-reminders') {
          return (
            <BulkSMSReminders key={action.id} variant="custom" onRemindersSent={() => {}}>
              <div
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredId(action.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {renderTile(action)}
              </div>
            </BulkSMSReminders>
          );
        }

        return (
          <UnstyledButton
            key={action.id}
            onClick={action.onClick}
            onMouseEnter={() => setHoveredId(action.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {renderTile(action)}
          </UnstyledButton>
        );
      })}
    </div>
  );
}
