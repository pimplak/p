import { Card, SimpleGrid, Stack, Text, Group } from '@mantine/core';
import { IconUsers, IconCurrencyZloty, IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

interface OverviewStatsProps {
  totalPatients: number;
  weeklyRevenue: number;
  pendingHours: number;
}

function formatRevenue(pln: number): string {
  if (pln >= 1000) return `${(pln / 1000).toFixed(1)}k zł`;
  return `${pln} zł`;
}

export function OverviewStats({
  totalPatients,
  weeklyRevenue,
  pendingHours,
}: OverviewStatsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentPalette, mantineTheme } = useTheme();

  const items = [
    {
      key: 'patients',
      title: t('dashboard.stats.totalPatients'),
      value: totalPatients,
      icon: IconUsers,
    },
    {
      key: 'revenue',
      title: t('dashboard.stats.weeklyRevenue'),
      value: formatRevenue(weeklyRevenue),
      icon: IconCurrencyZloty,
    },
    {
      key: 'pending',
      title: t('dashboard.stats.pendingHours'),
      value: `${pendingHours}h`,
      icon: IconClock,
      action: { label: t('dashboard.stats.review'), onClick: () => navigate('/calendar') },
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={mantineTheme.spacing?.md ?? 'md'}>
      {items.map(({ key, title, value, icon: Icon, action }) => (
        <Card
          key={key}
          padding="lg"
          radius="md"
          style={{
            backgroundColor: currentPalette.surface,
            border: `1px solid ${currentPalette.primary}40`,
          }}
        >
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start">
              <Text size="sm" style={{ color: `${currentPalette.text}B3` }}>
                {title}
              </Text>
              <Icon
                size={20}
                style={{ color: `${currentPalette.primary}80`, opacity: 0.8 }}
              />
            </Group>
            <Text size="xl" fw={700} style={{ color: currentPalette.text }}>
              {value}
            </Text>
            {action && (
              <Button
                variant="secondary"
                size="xs"
                onClick={action.onClick}
                style={{ alignSelf: 'flex-start' }}
              >
                {action.label}
              </Button>
            )}
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
