import { Card, Group, Text, RingProgress, Badge, ActionIcon, Stack, Tooltip } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus, IconEye } from '@tabler/icons-react';
import { useTheme } from '../../hooks/useTheme';

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  progress?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'compact';
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  progress,
  icon,
  variant = 'default',
  onClick
}) => {
  const { currentPalette, utilityColors } = useTheme();

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <IconTrendingUp size={16} />;
    } else if (trend.value < 0) {
      return <IconTrendingDown size={16} />;
    } else {
      return <IconMinus size={16} />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return currentPalette.text;
    
    if (trend.value > 0) {
      return utilityColors.success;
    } else if (trend.value < 0) {
      return utilityColors.error;
    } else {
      return currentPalette.text;
    }
  };

  if (variant === 'compact') {
    return (
      <Card
        padding="md"
        radius="md"
        withBorder
        style={{
          backgroundColor: currentPalette.surface,
          border: `1px solid ${currentPalette.primary}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 200ms ease-out',
          color: currentPalette.text
        }}
        onClick={onClick}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="sm" c="dimmed" style={{ color: `${currentPalette.text}80` }}>
              {title}
            </Text>
            <Text size="xl" fw={700} style={{ color: currentPalette.text }}>
              {value}
            </Text>
          </Stack>
          
          {icon && (
            <ActionIcon size="lg" variant="light" color="gray">
              {icon}
            </ActionIcon>
          )}
        </Group>
      </Card>
    );
  }

  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      style={{
        backgroundColor: currentPalette.surface,
        border: `1px solid ${currentPalette.primary}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 200ms ease-out',
        color: currentPalette.text
      }}
      onClick={onClick}
    >
      <Group justify="space-between" align="flex-start" mb="xs">
        <Text size="sm" c="dimmed" fw={500} style={{ color: `${currentPalette.text}80` }}>
          {title}
        </Text>
        {onClick && (
          <Tooltip label="Zobacz szczegóły">
            <ActionIcon size="sm" variant="subtle" color="gray">
              <IconEye size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      <Group align="flex-end" gap="xs" mb={description || progress ? "xs" : 0}>
        <Text size="2rem" fw={700} lh={1} style={{ color: currentPalette.text }}>
          {value}
        </Text>
        
        {trend && (
          <Badge
            size="sm"
            variant="light"
            leftSection={getTrendIcon()}
            color={trend.value > 0 ? 'green' : trend.value < 0 ? 'red' : 'gray'}
            style={{ 
              color: getTrendColor(),
              backgroundColor: `${getTrendColor()}20`
            }}
          >
            {trend.label}
          </Badge>
        )}
      </Group>

      {description && (
        <Text size="xs" c="dimmed" style={{ color: `${currentPalette.text}60` }}>
          {description}
        </Text>
      )}

      {progress && (
        <Group mt="md" gap="xs">
          <RingProgress
            size={40}
            thickness={4}
            sections={[
              { 
                value: progress.value, 
                color: currentPalette.primary
              }
            ]}
          />
          <Text size="xs" style={{ color: currentPalette.text }}>
            {progress.label}
          </Text>
        </Group>
      )}
    </Card>
  );
}; 