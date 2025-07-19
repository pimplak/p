import {
  Tabs,
  Paper,
  Stack,
  Text,
  Divider,
  Badge,
  Group,
  Card,
  Title,
  Button,
  Checkbox,
  Menu,
  ActionIcon,
} from '@mantine/core';
import {
  IconNotes,
  IconCalendar,
  IconPlus,
  IconDownload,
  IconCheck,
  IconX,
  IconFileExport,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { AppointmentStatus } from '../types/Appointment';
import { formatDate, formatDateTime } from '../utils/dates';
import { exportToExcel } from '../utils/export';
import { AppointmentForm } from './AppointmentForm';
import { BottomSheet } from './ui/BottomSheet';
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';
import type { Patient } from '../types/Patient';

interface PatientProfileTabsProps {
  patient: Patient;
}

export function PatientProfileTabs({ patient }: PatientProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>(
    []
  );
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { getAppointmentsByPatient } = useAppointmentStore();
  const { fetchPatients } = usePatientStore();
  const { currentPalette, utilityColors } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      // Load patients for AppointmentForm
      await fetchPatients();
      
      // Load appointments for this patient
      if (patient.id) {
        const patientAppointments = await getAppointmentsByPatient(patient.id);
        setAppointments(patientAppointments);
      }
    };

    loadData();
  }, [patient.id, getAppointmentsByPatient, fetchPatients]);

  const handleAppointmentSelection = (
    appointmentId: number,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedAppointments(prev => [...prev, appointmentId]);
    } else {
      setSelectedAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const selectAllAppointments = () => {
    setSelectedAppointments(appointments.map(apt => apt.id!).filter(Boolean));
  };

  const clearSelection = () => {
    setSelectedAppointments([]);
  };

  const handleExportSelected = async () => {
    if (selectedAppointments.length === 0) {
      return;
    }

    // Convert selected appointments to AppointmentWithPatient format
    const selectedAppointmentsWithPatient: AppointmentWithPatient[] =
      appointments
        .filter(apt => selectedAppointments.includes(apt.id!))
        .map(apt => ({
          ...apt,
          patient: {
            ...patient,
            id: patient.id!,
            status: patient.status,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt,
          },
        }));

    await exportToExcel([], selectedAppointmentsWithPatient, {
      patients: false,
      appointments: true,
      selectedPatients: patient.id ? [patient.id] : [],
    });
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setAppointmentModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentModalOpen(true);
  };

  const handleAppointmentFormSuccess = async () => {
    setAppointmentModalOpen(false);
    setEditingAppointment(null);
    // Reload appointments
    if (patient.id) {
      const patientAppointments = await getAppointmentsByPatient(patient.id);
      setAppointments(patientAppointments);
    }
  };

  const getStatusBadgeColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.COMPLETED:
        return utilityColors.success;
      case AppointmentStatus.CANCELLED:
        return utilityColors.error;
      case AppointmentStatus.NO_SHOW:
        return utilityColors.warning;
      default:
        return currentPalette.primary;
    }
  };

  return (
    <>
      <Tabs value={activeTab} onChange={value => value && setActiveTab(value)}>
        <Tabs.List>
          <Tabs.Tab value='overview' leftSection={<IconNotes size='1rem' />}>
            Przegląd
          </Tabs.Tab>
          <Tabs.Tab
            value='appointments'
            leftSection={<IconCalendar size='1rem' />}
          >
            Wizyty
          </Tabs.Tab>
          {/* <Tabs.Tab value='notes' leftSection={<IconNotes size='1rem' />}>
            Notatki
          </Tabs.Tab>
          <Tabs.Tab value='goals' leftSection={<IconTarget size='1rem' />}>
            Cele terapii
          </Tabs.Tab> */}
        </Tabs.List>

        <Tabs.Panel value='overview' pt='md'>
          <Paper p='md' withBorder>
            <Stack gap='md'>
              {patient.address && (
                <div>
                  <Text size='sm' fw={500} mb='xs'>
                    Adres
                  </Text>
                  <Text size='sm'>{patient.address}</Text>
                </div>
              )}

              {patient.notes && (
                <div>
                  <Text size='sm' fw={500} mb='xs'>
                    Notatki
                  </Text>
                  <Text size='sm' style={{ whiteSpace: 'pre-wrap' }}>
                    {patient.notes}
                  </Text>
                </div>
              )}

              {!patient.address && !patient.notes && (
                <Text size='sm' c='dimmed'>
                  Brak dodatkowych informacji o pacjencie.
                </Text>
              )}

              <Divider />

              <div>
                <Text size='xs' c='dimmed'>
                  Utworzono: {formatDate(patient.createdAt)}
                </Text>
                <Text size='xs' c='dimmed'>
                  Ostatnia aktualizacja: {formatDate(patient.updatedAt)}
                </Text>
              </div>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value='appointments' pt='md'>
          <Paper p='md' withBorder>
            <Group justify='space-between' align='flex-start' mb='md'>
              <Stack gap='xs'>
                <Title order={4}>Wizyty ({appointments.length})</Title>
                {selectedAppointments.length > 0 && (
                  <Badge color={currentPalette.primary} variant='light'>
                    {selectedAppointments.length} zaznaczonych
                  </Badge>
                )}
              </Stack>
              <Group gap='xs'>
                {appointments.length > 0 && (
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant='light' size='sm'>
                        <IconDownload size='1rem' />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconCheck size='1rem' />}
                        onClick={selectAllAppointments}
                        disabled={
                          selectedAppointments.length === appointments.length
                        }
                      >
                        Zaznacz wszystkie
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconX size='1rem' />}
                        onClick={clearSelection}
                        disabled={selectedAppointments.length === 0}
                      >
                        Wyczyść zaznaczenie
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconFileExport size='1rem' />}
                        onClick={handleExportSelected}
                        disabled={selectedAppointments.length === 0}
                      >
                        Eksportuj zaznaczone
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
                <Button
                  size='sm'
                  leftSection={<IconPlus size='1rem' />}
                  variant='light'
                  onClick={handleAddAppointment}
                >
                  Dodaj wizytę
                </Button>
              </Group>
            </Group>

            {appointments.length === 0 ? (
              <Text size='sm' c='dimmed'>
                Brak wizyt dla tego pacjenta.
              </Text>
            ) : (
              <Stack gap='md'>
                {appointments.map(appointment => (
                  <Card 
                    key={appointment.id} 
                    withBorder 
                    p='md'
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEditAppointment(appointment)}
                  >
                    <Group justify='space-between' align='flex-start'>
                      <Group align='flex-start' gap='md'>
                        <Checkbox
                          checked={selectedAppointments.includes(appointment.id!)}
                          onChange={e => {
                            e.stopPropagation(); // Prevent card click when clicking checkbox
                            handleAppointmentSelection(
                              appointment.id!,
                              e.currentTarget.checked
                            );
                          }}
                          onClick={e => e.stopPropagation()}
                          mt='2px'
                        />
                        <div style={{ flex: 1 }}>
                          <Group gap='xs' mb='xs'>
                            <Text fw={500}>
                              {formatDateTime(appointment.date)}
                            </Text>
                            <Badge
                              color={getStatusBadgeColor(appointment.status)}
                              variant='light'
                              size='sm'
                            >
                              {appointment.status === AppointmentStatus.COMPLETED
                                ? 'Zakończona'
                                : appointment.status ===
                                  AppointmentStatus.CANCELLED
                                  ? 'Anulowana'
                                  : appointment.status ===
                                    AppointmentStatus.NO_SHOW
                                    ? 'Nieobecność'
                                    : appointment.status ===
                                      AppointmentStatus.SCHEDULED
                                      ? 'Zaplanowana'
                                      : 'Przełożona'}
                            </Badge>
                          </Group>

                          <Text size='sm' c='dimmed'>
                            Czas trwania: {appointment.duration} min
                          </Text>

                          {appointment.type && (
                            <Text size='sm' c='dimmed'>
                              Typ:{' '}
                              {appointment.type === 'therapy'
                                ? 'Terapia'
                                : appointment.type === 'initial'
                                  ? 'Wizyta początkowa'
                                  : appointment.type === 'follow_up'
                                    ? 'Wizyta kontrolna'
                                    : appointment.type === 'consultation'
                                      ? 'Konsultacja'
                                      : 'Ocena'}
                            </Text>
                          )}

                          {appointment.notes && (
                            <Text size='sm' mt='xs'>
                              <strong>Notatki:</strong> {appointment.notes}
                            </Text>
                          )}
                        </div>
                      </Group>

                      {appointment.price && (
                        <Text size='sm' fw={500} c='green'>
                          {appointment.price} zł
                        </Text>
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>
            )}
          </Paper>
        </Tabs.Panel>

        {/* <Tabs.Panel value='notes' pt='md'>
          <Paper p='md' withBorder>
            <Stack gap='md' align='center' ta='center' py='xl'>
              <ThemeIcon size='lg' variant='light' color={currentPalette.accent}>
                <IconClock size='1.5rem' />
              </ThemeIcon>
              <div>
                <Text fw={500} size='lg' mb='xs'>
                  Feature będzie dostępny soon
                </Text>
                <Text size='sm' c='dimmed'>
                  System notatek SOAP dla pacjentów jest w przygotowaniu
                </Text>
              </div>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value='goals' pt='md'>
          <Paper p='md' withBorder>
            <Stack gap='md' align='center' ta='center' py='xl'>
              <ThemeIcon size='lg' variant='light' color={currentPalette.accent}>
                <IconClock size='1.5rem' />
              </ThemeIcon>
              <div>
                <Text fw={500} size='lg' mb='xs'>
                  Feature będzie dostępny soon
                </Text>
                <Text size='sm' c='dimmed'>
                  System śledzenia celów terapii jest w przygotowaniu
                </Text>
              </div>
            </Stack>
          </Paper>
        </Tabs.Panel> */}
      </Tabs>

      {/* Appointment Form Bottom Sheet */}
      <BottomSheet
        opened={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        title={editingAppointment ? 'Edytuj wizytę' : 'Dodaj wizytę'}
      >
        <AppointmentForm
          appointment={editingAppointment}
          initialPatientId={patient.id?.toString()}
          onSuccess={handleAppointmentFormSuccess}
          onCancel={() => setAppointmentModalOpen(false)}
        />
      </BottomSheet>
    </>
  );
}
