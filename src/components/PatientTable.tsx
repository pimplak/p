import { Table, Text, Badge, ActionIcon, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { PatientWithAppointments, Patient } from '../types/Patient';

interface PatientTableProps {
  patients: PatientWithAppointments[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
}

export function PatientTable({ patients, onEdit, onDelete }: PatientTableProps) {
  return (
    <Table.ScrollContainer minWidth={800} visibleFrom="md">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Imię i nazwisko</Table.Th>
            <Table.Th>Kontakt</Table.Th>
            <Table.Th>Wizyty</Table.Th>
            <Table.Th>Ostatnia wizyta</Table.Th>
            <Table.Th>Następna wizyta</Table.Th>
            <Table.Th>Akcje</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {patients.map((patient) => (
            <Table.Tr key={patient.id}>
              <Table.Td>
                <div>
                  <Text fw={500}>
                    {patient.firstName} {patient.lastName}
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
              </Table.Td>
              <Table.Td>
                <div>
                  {patient.phone && (
                    <Text size="sm">{patient.phone}</Text>
                  )}
                  {patient.email && (
                    <Text size="sm" c="dimmed">{patient.email}</Text>
                  )}
                </div>
              </Table.Td>
              <Table.Td>
                <Badge variant="light">
                  {patient.appointmentCount}
                </Badge>
              </Table.Td>
              <Table.Td>
                {patient.lastAppointment ? (
                  <Text size="sm">
                    {format(
                      typeof patient.lastAppointment === 'string' 
                        ? new Date(patient.lastAppointment) 
                        : patient.lastAppointment, 
                      'dd.MM.yyyy', 
                      { locale: pl }
                    )}
                  </Text>
                ) : (
                  <Text size="sm" c="dimmed">-</Text>
                )}
              </Table.Td>
              <Table.Td>
                {patient.nextAppointment ? (
                  <Text size="sm" c="blue">
                    {format(
                      typeof patient.nextAppointment === 'string' 
                        ? new Date(patient.nextAppointment) 
                        : patient.nextAppointment, 
                      'dd.MM.yyyy', 
                      { locale: pl }
                    )}
                  </Text>
                ) : (
                  <Text size="sm" c="dimmed">-</Text>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon 
                    variant="light" 
                    color="blue"
                    onClick={() => onEdit(patient)}
                  >
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon 
                    variant="light" 
                    color="red"
                    onClick={() => patient.id && onDelete(patient.id)}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
} 