import { Card, Text, Group, Badge, ActionIcon, Button, Stack } from '@mantine/core';
import { IconEdit, IconTrash, IconPhone, IconMail, IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { getPatientDisplayName } from '../utils/dates';
import type { PatientWithAppointments , Patient } from '../types/Patient';

interface VirtualizedPatientListProps {
  patients: PatientWithAppointments[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
  height?: number;
}

interface PatientCardProps {
  index: number;
  style: React.CSSProperties;
  data: {
    patients: PatientWithAppointments[];
    onEdit: (patient: Patient) => void;
    onDelete: (id: number) => void;
  };
}

const PatientCard = memo(({ index, style, data }: PatientCardProps) => {
  const { patients, onEdit, onDelete } = data;
  const patient = patients[index];

  if (!patient) return null;

  return (
    <div style={style}>
      <Card 
        withBorder 
        p="lg"
        radius="md"
        style={{ 
          margin: '0 16px 16px 16px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-primary)'
        }}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} size="md" truncate>
                {getPatientDisplayName(patient)}
              </Text>
              {patient.birthDate && (
                <Text size="sm" c="dimmed">
                  Ur. {format(
                    typeof patient.birthDate === 'string' 
                      ? new Date(patient.birthDate) 
                      : patient.birthDate, 
                    'dd.MM.yyyy'
                  )}
                </Text>
              )}
            </div>
            <Badge size="sm" variant="light" color="blue" style={{ flexShrink: 0 }}>
              {patient.appointmentCount} wizyt
            </Badge>
          </Group>
          
          <Stack gap="sm">
            {patient.phone && (
              <Group gap="sm" wrap="nowrap">
                <ActionIcon size="sm" variant="subtle" color="gray" style={{ flexShrink: 0 }}>
                  <IconPhone size="1rem" />
                </ActionIcon>
                <Text size="sm" style={{ flex: 1 }}>{patient.phone}</Text>
              </Group>
            )}
            {patient.email && (
              <Group gap="sm" wrap="nowrap">
                <ActionIcon size="sm" variant="subtle" color="gray" style={{ flexShrink: 0 }}>
                  <IconMail size="1rem" />
                </ActionIcon>
                <Text size="sm" c="dimmed" truncate style={{ flex: 1 }}>
                  {patient.email}
                </Text>
              </Group>
            )}
            {patient.nextAppointment && (
              <Group gap="sm" wrap="nowrap">
                <ActionIcon size="sm" variant="subtle" color="blue" style={{ flexShrink: 0 }}>
                  <IconCalendar size="1rem" />
                </ActionIcon>
                <Text size="sm" c="blue" style={{ flex: 1 }}>
                  Następna: {format(
                    typeof patient.nextAppointment === 'string' 
                      ? new Date(patient.nextAppointment) 
                      : patient.nextAppointment, 
                    'dd.MM.yyyy', 
                    { locale: pl }
                  )}
                </Text>
              </Group>
            )}
          </Stack>
          
          <Group justify="center" gap="md" mt="sm">
            <Button 
              size="sm"
              variant="light" 
              color="blue"
              leftSection={<IconEdit size="1rem" />}
              onClick={() => onEdit(patient)}
              style={{ flex: 1 }}
            >
              Edytuj
            </Button>
            <Button 
              size="sm"
              variant="light" 
              color="red"
              leftSection={<IconTrash size="1rem" />}
              onClick={() => patient.id && onDelete(patient.id)}
              style={{ flex: 1 }}
            >
              Usuń
            </Button>
          </Group>
        </Stack>
      </Card>
    </div>
  );
});

PatientCard.displayName = 'PatientCard';

export const VirtualizedPatientList = memo(({ 
  patients, 
  onEdit, 
  onDelete, 
  height = 600 
}: VirtualizedPatientListProps) => {
  const itemData = useMemo(() => ({
    patients,
    onEdit,
    onDelete
  }), [patients, onEdit, onDelete]);

  if (patients.length === 0) {
    return null;
  }

  return (
    <List
      height={height}
      width="100%"
      itemCount={patients.length}
      itemSize={200} // wysokość każdej karty + marginesy
      itemData={itemData}
      overscanCount={5} // render 5 items poza viewport dla płynności
    >
      {PatientCard}
    </List>
  );
});

VirtualizedPatientList.displayName = 'VirtualizedPatientList'; 