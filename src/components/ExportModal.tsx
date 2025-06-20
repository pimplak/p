import { 
  Modal, 
  Stack, 
  Text, 
  Checkbox, 
  Divider, 
  Group, 
  Button 
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import type { PatientWithAppointments } from '../types/Patient';

interface ExportModalProps {
  opened: boolean;
  onClose: () => void;
  filteredPatients: PatientWithAppointments[];
  onExport: (options: {
    exportPatients: boolean;
    exportAppointments: boolean;
    dateFrom: Date | null;
    dateTo: Date | null;
    selectedPatients: number[];
  }) => void;
}

export function ExportModal({ 
  opened, 
  onClose, 
  filteredPatients, 
  onExport 
}: ExportModalProps) {
  const [exportPatients, setExportPatients] = useState(true);
  const [exportAppointments, setExportAppointments] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  const handlePatientSelection = (patientId: number, checked: boolean) => {
    if (checked) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  const selectAllPatients = () => {
    setSelectedPatients(filteredPatients.map(p => p.id!).filter(Boolean));
  };

  const clearSelection = () => {
    setSelectedPatients([]);
  };

  const handleExport = () => {
    onExport({
      exportPatients,
      exportAppointments,
      dateFrom,
      dateTo,
      selectedPatients
    });
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Eksport danych"
      size="md"
    >
      <Stack>
        <div>
          <Text fw={500} mb="xs">Co eksportować?</Text>
          <Checkbox
            label="Dane pacjentów"
            checked={exportPatients}
            onChange={(e) => setExportPatients(e.currentTarget.checked)}
          />
          <Checkbox
            label="Wizyty"
            checked={exportAppointments}
            onChange={(e) => setExportAppointments(e.currentTarget.checked)}
          />
        </div>

        <Divider />

        <div>
          <Text fw={500} mb="xs">Zakres dat (wizyty)</Text>
          <Group grow>
            <DateInput
              label="Od"
              placeholder="Wybierz datę"
              value={dateFrom}
              onChange={(value) => {
                if (value) {
                  const date = typeof value === 'string' ? new Date(value) : value;
                  setDateFrom(date);
                } else {
                  setDateFrom(null);
                }
              }}
            />
            <DateInput
              label="Do"
              placeholder="Wybierz datę"
              value={dateTo}
              onChange={(value) => {
                if (value) {
                  const date = typeof value === 'string' ? new Date(value) : value;
                  setDateTo(date);
                } else {
                  setDateTo(null);
                }
              }}
            />
          </Group>
        </div>

        <Divider />

        <div>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Wybierz pacjentów</Text>
            <Group gap="xs">
              <Button size="xs" variant="light" onClick={selectAllPatients}>
                Zaznacz wszystkich
              </Button>
              <Button size="xs" variant="light" onClick={clearSelection}>
                Wyczyść
              </Button>
            </Group>
          </Group>
          <Text size="sm" c="dimmed" mb="sm">
            Pozostaw puste aby eksportować wszystkich
          </Text>
          <Stack gap="xs" mah={200} style={{ overflowY: 'auto' }}>
            {filteredPatients.map((patient) => (
              <Checkbox
                key={patient.id}
                label={`${patient.firstName} ${patient.lastName}`}
                checked={selectedPatients.includes(patient.id!)}
                onChange={(e) => handlePatientSelection(patient.id!, e.currentTarget.checked)}
              />
            ))}
          </Stack>
        </div>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={handleExport}>
            Eksportuj
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 