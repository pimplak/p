import { Table, Text, Badge, ActionIcon, Group, Menu } from '@mantine/core';
import { IconEdit, IconArchive, IconRestore, IconDots } from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import { getPatientDisplayName } from '../utils/dates';
import type { PatientWithAppointments, Patient } from '../types/Patient';

interface PatientTableProps {
  patients: PatientWithAppointments[];
  onEdit: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onArchive: (id: number) => void;
  onRestore: (id: number) => void;
}

export function PatientTable({ patients, onEdit, onView, onArchive, onRestore }: PatientTableProps) {
  const { currentPalette, utilityColors } = useTheme();

  return (
    <Table.ScrollContainer minWidth={900} visibleFrom="md">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Imię i nazwisko</Table.Th>
            <Table.Th>Status / Tagi</Table.Th>
            <Table.Th>Kontakt</Table.Th>
            <Table.Th>Wizyty</Table.Th>
            <Table.Th>Ostatnia wizyta</Table.Th>
            <Table.Th>Następna wizyta</Table.Th>
            <Table.Th>Akcje</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {patients.map((patient) => (
            <Table.Tr 
              key={patient.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onView(patient)}
            >
              <Table.Td>
                <div>
                  <Text fw={500}>
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
              </Table.Td>
              <Table.Td>
                <div>
                  <Badge
                    color={patient.status === 'active' ? utilityColors.success : 'gray'}
                    variant="light"
                    size="sm"
                  >
                    {patient.status === 'active' ? 'Aktywny' : 'Zarchiwizowany'}
                  </Badge>
                  {patient.tags && patient.tags.length > 0 && (
                    <Group gap={4} mt={4}>
                      {patient.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" size="xs">
                          {tag}
                        </Badge>
                      ))}
                      {patient.tags.length > 2 && (
                        <Badge variant="outline" size="xs" c="dimmed">
                          +{patient.tags.length - 2}
                        </Badge>
                      )}
                    </Group>
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
                  <Text size="sm" style={{ color: currentPalette.primary }}>
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
                  <Menu shadow="md" width={180}>
                    <Menu.Target>
                      <ActionIcon 
                        variant="light"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDots size="1rem" />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEdit size="1rem" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(patient);
                        }}
                      >
                        Edytuj
                      </Menu.Item>
                      
                      {patient.status === 'active' ? (
                        <Menu.Item
                          leftSection={<IconArchive size="1rem" />}
                          color={utilityColors.error}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (patient.id) onArchive(patient.id);
                          }}
                        >
                          Archiwizuj
                        </Menu.Item>
                      ) : (
                        <Menu.Item
                          leftSection={<IconRestore size="1rem" />}
                          color={utilityColors.success}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (patient.id) onRestore(patient.id);
                          }}
                        >
                          Przywróć
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
} 