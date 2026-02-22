import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Card,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { IconChartLine, IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

function Analytics() {
  const { t } = useTranslation();
  const { currentPalette } = useTheme();

  return (
    <Container size='md'>
      <Stack gap='xl'>
        {/* Header Section */}
        <Group align='center' gap='md'>
          <ThemeIcon size='xl' variant='light' color={currentPalette.primary}>
            <IconChartLine size={24} />
          </ThemeIcon>
          <div>
            <Title order={1}>{t('analytics.title')}</Title>
            <Text size='sm' c='dimmed'>
              {t('analytics.subtitle')}
            </Text>
          </div>
        </Group>

        {/* Coming Soon Card */}
        <Card shadow='sm' padding='xl' radius='md' withBorder>
          <Stack gap='lg' align='center' ta='center'>
            <ThemeIcon size={80} variant='light' color={currentPalette.accent}>
              <IconClock size={40} />
            </ThemeIcon>

            <Stack gap='sm' align='center'>
              <Title order={2} size='h3'>
                {t('analytics.comingSoon')}
              </Title>
              <Text size='lg' c='dimmed' maw={500}>
                {t('analytics.comingSoonDescription')}
              </Text>
            </Stack>

            <Badge size='lg' variant='light' color={currentPalette.primary}>
              {t('analytics.inDevelopment')}
            </Badge>
          </Stack>
        </Card>

        {/* Features Preview */}
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Stack gap='md'>
            <Title order={3} size='h4'>
              {t('analytics.plannedFeatures.title')}
            </Title>

            <Stack gap='xs'>
              <Text size='sm'>📈 {t('analytics.plannedFeatures.patientProgress')}</Text>
              <Text size='sm'>💰 {t('analytics.plannedFeatures.revenueAnalysis')}</Text>
              <Text size='sm'>📅 {t('analytics.plannedFeatures.timeUsage')}</Text>
              <Text size='sm'>📊 {t('analytics.plannedFeatures.therapyEffectiveness')}</Text>
              <Text size='sm'>📋 {t('analytics.plannedFeatures.compliance')}</Text>
              <Text size='sm'>📄 {t('analytics.plannedFeatures.exportReports')}</Text>
            </Stack>
          </Stack>
        </Card>

        {/* Current Analytics Available */}
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Stack gap='md'>
            <Title order={3} size='h4'>
              {t('analytics.currentFeatures.title')}
            </Title>

            <Text size='sm'>
              🔹 {t('analytics.currentFeatures.dashboardStats')}
              <br />
              🔹 {t('analytics.currentFeatures.smsAnalysis')}
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

export default Analytics;
