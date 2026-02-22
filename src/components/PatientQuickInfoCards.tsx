import { Grid, Card, Stack, Text, Group } from '@mantine/core';
import { IconPhone, IconMail } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { formatDate, calculateAge } from '../utils/dates';
import type { Patient } from '../types/Patient';

interface PatientQuickInfoCardsProps {
  patient: Patient;
}

export function PatientQuickInfoCards({ patient }: PatientQuickInfoCardsProps) {
  const { t } = useTranslation();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder>
          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              {t('patientQuickInfo.contact')}
            </Text>
            {patient.phone && (
              <Group gap='xs'>
                <IconPhone size='1rem' />
                <Text size='sm'>{patient.phone}</Text>
              </Group>
            )}
            {patient.email && (
              <Group gap='xs'>
                <IconMail size='1rem' />
                <Text size='sm'>{patient.email}</Text>
              </Group>
            )}
            {!patient.phone && !patient.email && (
              <Text size='sm' c='dimmed'>
                {t('patientQuickInfo.noContactInfo')}
              </Text>
            )}
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder>
          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              {t('patientQuickInfo.personalInfo')}
            </Text>
            <Text size='sm'>
              <strong>{t('patientQuickInfo.age')}:</strong>{' '}
              {calculateAge(patient.birthDate)
                ? `${calculateAge(patient.birthDate)} ${t('patientForm.ageYears')}`
                : t('patientQuickInfo.noData')}
            </Text>
            <Text size='sm'>
              <strong>{t('patientQuickInfo.dateOfBirth')}:</strong> {formatDate(patient.birthDate)}
            </Text>
            {patient.address && (
              <Text size='sm'>
                <strong>{t('patientQuickInfo.address')}:</strong> {patient.address}
              </Text>
            )}
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder>
          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              {t('patientQuickInfo.emergencyContact')}
            </Text>
            <Text size='sm'>
              <strong>{t('patientQuickInfo.person')}:</strong>{' '}
              {patient.emergencyContact || t('patientQuickInfo.noData')}
            </Text>
            <Text size='sm'>
              <strong>{t('patientQuickInfo.phone')}:</strong>{' '}
              {patient.emergencyPhone || t('patientQuickInfo.noData')}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
