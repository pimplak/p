import React from 'react';
import { Card, Text, Group, Stack, ThemeIcon } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: Icon;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
  trend?: {
    value: number;
    period: string;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color = 'indigo',
  trend
}) => {
  const getColorScheme = (colorName: string) => {
    const colors = {
      indigo: { bg: '#F0F2FF', iconBg: '#6366F1' },
      green: { bg: '#F0FDF4', iconBg: '#10B981' },
      yellow: { bg: '#FFFBEB', iconBg: '#F59E0B' },
      red: { bg: '#FEF2F2', iconBg: '#EF4444' }
    };
    return colors[colorName as keyof typeof colors] || colors.indigo;
  };

  const colorScheme = getColorScheme(color);

  return (
    <Card
      shadow="sm"
      padding="xl"
      radius="md"
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--gray-100)',
        transition: 'all 200ms ease-out',
        height: '100%',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--card-hover-shadow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
      }}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text 
            size="sm" 
            c="var(--gray-600)" 
            fw={500}
            style={{ 
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              fontSize: '0.75rem'
            }}
          >
            {title}
          </Text>
          
          <Text 
            size="xl" 
            fw={700} 
            c="var(--gray-900)"
            style={{ 
              fontSize: '2rem',
              lineHeight: '2.5rem',
              letterSpacing: '-0.02em'
            }}
          >
            {value}
          </Text>
          
          {description && (
            <Text 
              size="sm" 
              c="var(--gray-600)"
              style={{ lineHeight: '1.5' }}
            >
              {description}
            </Text>
          )}
          
          {trend && (
            <Group gap="xs">
              <Text 
                size="sm" 
                c={trend.value > 0 ? 'var(--success)' : 'var(--danger)'}
                fw={500}
              >
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </Text>
              <Text size="sm" c="var(--gray-500)">
                {trend.period}
              </Text>
            </Group>
          )}
        </Stack>
        
        <ThemeIcon
          size="lg"
          radius="md"
          style={{
            backgroundColor: colorScheme.bg,
            color: colorScheme.iconBg,
            border: 'none'
          }}
        >
          <Icon size={24} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}; 