import { Grid, Card, Stack, Text, Group } from '@mantine/core';
import { IconPhone, IconMail } from '@tabler/icons-react';
import type { Patient } from '../types/Patient';
import { formatDate, calculateAge } from '../utils/dates';

interface PatientQuickInfoCardsProps {
  patient: Patient;
}

export function PatientQuickInfoCards({ patient }: PatientQuickInfoCardsProps) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Kontakt</Text>
            {patient.phone && (
              <Group gap="xs">
                <IconPhone size="1rem" />
                <Text size="sm">{patient.phone}</Text>
              </Group>
            )}
            {patient.email && (
              <Group gap="xs">
                <IconMail size="1rem" />
                <Text size="sm">{patient.email}</Text>
              </Group>
            )}
            {!patient.phone && !patient.email && (
              <Text size="sm" c="dimmed">Brak danych kontaktowych</Text>
            )}
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Informacje osobiste</Text>
            <Text size="sm">
              <strong>Wiek:</strong>{' '}
              {calculateAge(patient.birthDate) 
                ? `${calculateAge(patient.birthDate)} lat`
                : 'Brak danych'
              }
            </Text>
            <Text size="sm">
              <strong>Data urodzenia:</strong> {formatDate(patient.birthDate)}
            </Text>
            {patient.address && (
              <Text size="sm">
                <strong>Adres:</strong> {patient.address}
              </Text>
            )}
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Kontakt awaryjny</Text>
            <Text size="sm">
              <strong>Osoba:</strong> {patient.emergencyContact || 'Brak danych'}
            </Text>
            <Text size="sm">
              <strong>Telefon:</strong> {patient.emergencyPhone || 'Brak danych'}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
} 