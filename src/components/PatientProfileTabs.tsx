import { useState } from 'react';
import { Tabs, Paper, Stack, Text, Divider } from '@mantine/core';
import { IconNotes, IconCalendar, IconTarget } from '@tabler/icons-react';
import type { Patient } from '../types/Patient';
import { formatDate } from '../utils/dates';

interface PatientProfileTabsProps {
  patient: Patient;
}

export function PatientProfileTabs({ patient }: PatientProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)}>
      <Tabs.List>
        <Tabs.Tab value="overview" leftSection={<IconNotes size="1rem" />}>
          Przegląd
        </Tabs.Tab>
        <Tabs.Tab value="appointments" leftSection={<IconCalendar size="1rem" />}>
          Wizyty
        </Tabs.Tab>
        <Tabs.Tab value="notes" leftSection={<IconNotes size="1rem" />}>
          Notatki
        </Tabs.Tab>
        <Tabs.Tab value="goals" leftSection={<IconTarget size="1rem" />}>
          Cele terapii
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="overview" pt="md">
        <Paper p="md" withBorder>
          <Stack gap="md">
            {patient.address && (
              <div>
                <Text size="sm" fw={500} mb="xs">Adres</Text>
                <Text size="sm">{patient.address}</Text>
              </div>
            )}
            
            {patient.notes && (
              <div>
                <Text size="sm" fw={500} mb="xs">Notatki</Text>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {patient.notes}
                </Text>
              </div>
            )}

            {!patient.address && !patient.notes && (
              <Text size="sm" c="dimmed">
                Brak dodatkowych informacji o pacjencie.
              </Text>
            )}

            <Divider />

            <div>
              <Text size="xs" c="dimmed">
                Utworzono: {formatDate(patient.createdAt)}
              </Text>
              <Text size="xs" c="dimmed">
                Ostatnia aktualizacja: {formatDate(patient.updatedAt)}
              </Text>
            </div>
          </Stack>
        </Paper>
      </Tabs.Panel>

      <Tabs.Panel value="appointments" pt="md">
        <Paper p="md" withBorder>
          <Text>Lista wizyt będzie tutaj - do implementacji</Text>
        </Paper>
      </Tabs.Panel>

      <Tabs.Panel value="notes" pt="md">
        <Paper p="md" withBorder>
          <Text>System notatek SOAP będzie tutaj - do implementacji</Text>
        </Paper>
      </Tabs.Panel>

      <Tabs.Panel value="goals" pt="md">
        <Paper p="md" withBorder>
          <Text>Cele terapii będą tutaj - do implementacji</Text>
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
} 