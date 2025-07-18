import {
  Stack,
  Card,
  Group,
  Text,
  Badge,
  ActionIcon,
  Menu,
} from '@mantine/core';
import {
  IconDots,
  IconEdit,
  IconArchive,
  IconRestore,
  IconPhone,
  IconMail,
  IconCalendar,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { PATIENT_STATUS, PATIENT_STATUS_LABELS } from '../constants/status';
import { useTheme } from '../hooks/useTheme';
import { formatDate, getPatientDisplayName } from '../utils/dates';
import type { PatientWithAppointments, Patient } from '../types/Patient';

interface PatientsCardListProps {
  patients: PatientWithAppointments[];
  onEdit: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onArchive: (id: number) => void;
  onRestore: (id: number) => void;
}

export function PatientsCardList({
  patients,
  onEdit,
  onView,
  onArchive,
  onRestore,
}: PatientsCardListProps) {
  const { currentPalette, utilityColors } = useTheme();

  if (patients.length === 0) {
    return (
      <Card padding='xl'>
        <Text ta='center' c='dimmed'>
          Brak pacjentów do wyświetlenia
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap='md' hiddenFrom='md'>
      {patients.map(patient => (
        <Card
          key={patient.id}
          withBorder
          p='lg'
          radius='md'
          style={{
            cursor: 'pointer',
            transition: 'all 200ms ease-out',
            backgroundColor:
              patient.status === PATIENT_STATUS.ACTIVE
                ? currentPalette.surface
                : currentPalette.surface,
            border: `1px solid ${currentPalette.primary}`,
            opacity: patient.status === PATIENT_STATUS.ARCHIVED ? 0.7 : 1,
          }}
          onClick={() => onView(patient)}
        >
          <Stack gap='md'>
            <Group justify='space-between' align='flex-start' wrap='nowrap'>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Group gap='xs' align='center'>
                  <Text fw={600} size='md' truncate>
                    {getPatientDisplayName(patient)}
                  </Text>
                  <Badge
                    size='xs'
                    color={
                      patient.status === PATIENT_STATUS.ACTIVE
                        ? utilityColors.success
                        : 'gray'
                    }
                    variant='light'
                  >
                    {PATIENT_STATUS_LABELS[patient.status]}
                  </Badge>
                </Group>

                {patient.birthDate && (
                  <Text size='sm' c='dimmed'>
                    Ur. {formatDate(patient.birthDate)}
                  </Text>
                )}

                {patient.tags && patient.tags.length > 0 && (
                  <Group gap={4} mt={4}>
                    {patient.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant='outline' size='xs'>
                        {tag}
                      </Badge>
                    ))}
                    {patient.tags.length > 3 && (
                      <Badge variant='outline' size='xs' c='dimmed'>
                        +{patient.tags.length - 3}
                      </Badge>
                    )}
                  </Group>
                )}
              </div>

              <Group>
                <Badge
                  size='sm'
                  variant='light'
                  color={currentPalette.primary}
                  style={{ flexShrink: 0 }}
                >
                  {patient.appointmentCount} wizyt
                </Badge>
                <Menu shadow='md' width={180}>
                  <Menu.Target>
                    <ActionIcon
                      variant='light'
                      size='sm'
                      onClick={e => e.stopPropagation()}
                    >
                      <IconDots size='1rem' />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size='1rem' />}
                      onClick={e => {
                        e.stopPropagation();
                        onEdit(patient);
                      }}
                    >
                      Edytuj
                    </Menu.Item>

                    {patient.status === PATIENT_STATUS.ACTIVE ? (
                      <Menu.Item
                        leftSection={<IconArchive size='1rem' />}
                        color={utilityColors.error}
                        onClick={e => {
                          e.stopPropagation();
                          if (patient.id) onArchive(patient.id);
                        }}
                      >
                        Archiwizuj
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        leftSection={<IconRestore size='1rem' />}
                        color={utilityColors.success}
                        onClick={e => {
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
            </Group>

            <Stack gap='sm'>
              {patient.phone && (
                <Group gap='sm' wrap='nowrap'>
                  <ActionIcon
                    size='sm'
                    variant='subtle'
                    style={{ color: currentPalette.text, flexShrink: 0 }}
                  >
                    <IconPhone size='1rem' />
                  </ActionIcon>
                  <Text size='sm' style={{ flex: 1 }}>
                    {patient.phone}
                  </Text>
                </Group>
              )}

              {patient.email && (
                <Group gap='sm' wrap='nowrap'>
                  <ActionIcon
                    size='sm'
                    variant='subtle'
                    style={{ color: currentPalette.text, flexShrink: 0 }}
                  >
                    <IconMail size='1rem' />
                  </ActionIcon>
                  <Text size='sm' c='dimmed' truncate style={{ flex: 1 }}>
                    {patient.email}
                  </Text>
                </Group>
              )}

              {patient.nextAppointment && (
                <Group gap='sm' wrap='nowrap'>
                  <ActionIcon
                    size='sm'
                    variant='subtle'
                    style={{ color: currentPalette.primary, flexShrink: 0 }}
                  >
                    <IconCalendar size='1rem' />
                  </ActionIcon>
                  <Text
                    size='sm'
                    style={{ color: currentPalette.primary, flex: 1 }}
                  >
                    Następna:{' '}
                    {format(
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
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
