import { Divider, Group, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

interface OverviewStatsProps {
  totalPatients: number;
  weeklyRevenue: number;
  pendingHours: number;
}

function formatRevenue(pln: number): string {
  if (pln >= 1000) return `${(pln / 1000).toFixed(1)}k zł`;
  return `${pln} zł`;
}

export function OverviewStats({ totalPatients, weeklyRevenue, pendingHours }: OverviewStatsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentPalette } = useTheme();

  const items = [
    {
      key: 'patients',
      label: t('dashboard.stats.totalPatients'),
      value: String(totalPatients),
      onClick: () => navigate('/patients'),
    },
    {
      key: 'revenue',
      label: t('dashboard.stats.weeklyRevenue'),
      value: formatRevenue(weeklyRevenue),
      onClick: undefined,
    },
    {
      key: 'pending',
      label: t('dashboard.stats.pendingHours'),
      value: `${pendingHours}h`,
      onClick: () => navigate('/calendar'),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: `${currentPalette.surface}80`,
        border: `1px solid ${currentPalette.text}08`,
        borderRadius: 0,
        padding: '4px 0',
      }}
    >
      <Group justify="space-around" align="center" wrap="nowrap" gap={0}>
        {items.map((item, idx) => (
          <Group key={item.key} wrap="nowrap" gap={0} style={{ flex: 1 }}>
            {idx > 0 && (
              <Divider
                orientation="vertical"
                style={{
                  borderColor: `${currentPalette.text}08`,
                  alignSelf: 'stretch',
                }}
              />
            )}
            <Stack
              gap={4}
              align="center"
              style={{
                flex: 1,
                padding: '10px 8px',
                cursor: item.onClick ? 'pointer' : 'default',
              }}
              onClick={item.onClick}
            >
              <Text fw={700} size="xl" style={{ color: currentPalette.text, lineHeight: 1 }}>
                {item.value}
              </Text>
              <Text
                ta="center"
                style={{
                  color: `${currentPalette.text}45`,
                  lineHeight: 1.2,
                  fontSize: 9,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {item.label}
              </Text>
            </Stack>
          </Group>
        ))}
      </Group>
    </div>
  );
}
