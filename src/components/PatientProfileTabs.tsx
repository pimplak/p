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
  Modal,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconNotes,
  IconCalendar,
  IconPlus,
  IconDownload,
  IconCheck,
  IconX,
  IconFileExport,
  IconNote,
} from '@tabler/icons-react';
import { isSameDay } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useNoteStore } from '../stores/useNoteStore';
import { usePatientStore } from '../stores/usePatientStore';
import { AppointmentStatus } from '../types/Appointment';
import { formatDate, formatDateTime } from '../utils/dates';
import { exportToExcel } from '../utils/export';
import { AppointmentForm } from './AppointmentForm';
import { NoteForm } from './NoteForm';
import { NoteList } from './NoteList';
import { PinnedNotesOverview } from './PinnedNotes';
import { BottomSheet } from './ui/BottomSheet';
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';
import type { Note, Patient } from '../types/Patient';

interface PatientProfileTabsProps {
  patient: Patient;
}

function getNotePreviewShort(note: Note): string {
  if (note.type === 'soap') {
    const part = note.subjective || note.objective || note.assessment || note.plan;
    return part ? part.slice(0, 60) + (part.length > 60 ? '...' : '') : 'SOAP';
  }
  const text = note.content || '';
  return text.slice(0, 60) + (text.length > 60 ? '...' : '');
}

export function PatientProfileTabs({ patient }: PatientProfileTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>(
    []
  );
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteSessionId, setNoteSessionId] = useState<number | undefined>(undefined);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const { getAppointmentsByPatient } = useAppointmentStore();
  const { notes, fetchNotesByPatient, togglePin, deleteNote, clearNotes, getPinnedNotes, getNotesBySession } = useNoteStore();
  const { fetchPatients } = usePatientStore();
  const { currentPalette, utilityColors } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      // Load patients for AppointmentForm
      await fetchPatients();

      // Load appointments and notes for this patient
      if (patient.id) {
        const patientAppointments = await getAppointmentsByPatient(patient.id);
        setAppointments(patientAppointments);
        await fetchNotesByPatient(patient.id);
      }
    };

    loadData();
    return () => clearNotes();
  }, [patient.id, getAppointmentsByPatient, fetchPatients, fetchNotesByPatient, clearNotes]);

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

  // Note handlers
  const handleAddNote = (sessionId?: number) => {
    setEditingNote(null);
    setNoteSessionId(sessionId);
    setNoteModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteSessionId(note.sessionId);
    setNoteModalOpen(true);
  };

  const handleNoteFormSuccess = () => {
    setNoteModalOpen(false);
    setEditingNote(null);
    setNoteSessionId(undefined);
  };

  const handleConfirmDeleteNote = async () => {
    if (deleteNoteId) {
      await deleteNote(deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  const pinnedNotes = patient.id ? getPinnedNotes(patient.id) : [];

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

  // Filter appointments by date if filter is set
  const filteredAppointments = useMemo(() => {
    if (!dateFilter) return appointments;

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const filterDate = new Date(dateFilter);
      return isSameDay(appointmentDate, filterDate);
    });
  }, [appointments, dateFilter]);

  return (
    <>
      <Tabs value={activeTab} onChange={value => value && setActiveTab(value)}>
        <Tabs.List>
          <Tabs.Tab value='overview' leftSection={<IconNotes size='1rem' />}>
            {t('calendar.patientProfile.tabs.overview')}
          </Tabs.Tab>
          <Tabs.Tab
            value='appointments'
            leftSection={<IconCalendar size='1rem' />}
          >
            {t('calendar.patientProfile.tabs.appointments')}
          </Tabs.Tab>
          <Tabs.Tab value='notes' leftSection={<IconNote size='1rem' />}>
            {t('calendar.patientProfile.tabs.notes')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='overview' pt='md'>
          <Paper p='md' withBorder>
            <Stack gap='md'>
              <PinnedNotesOverview
                notes={pinnedNotes}
                onNoteClick={note => {
                  handleEditNote(note);
                }}
              />

              {patient.address && (
                <div>
                  <Text size='sm' fw={500} mb='xs'>
                    {t('calendar.patientProfile.overview.address')}
                  </Text>
                  <Text size='sm'>{patient.address}</Text>
                </div>
              )}

              {!patient.address && pinnedNotes.length === 0 && (
                <Text size='sm' c='dimmed'>
                  {t('calendar.patientProfile.overview.noAdditionalInfo')}
                </Text>
              )}

              <Divider />

              <div>
                <Text size='xs' c='dimmed'>
                  {t('calendar.patientProfile.overview.created')} {formatDate(patient.createdAt)}
                </Text>
                <Text size='xs' c='dimmed'>
                  {t('calendar.patientProfile.overview.lastUpdate')} {formatDate(patient.updatedAt)}
                </Text>
              </div>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value='appointments' pt='md'>
          <Paper p='md' withBorder>
            <Group justify='space-between' align='flex-start' mb='md'>
              <Stack gap='xs'>
                <Title order={4}>{t('calendar.patientProfile.appointments.title', { count: filteredAppointments.length })}</Title>
                {selectedAppointments.length > 0 && (
                  <Badge color={currentPalette.primary} variant='light'>
                    {t('calendar.patientProfile.appointments.selectedCount', { count: selectedAppointments.length })}
                  </Badge>
                )}
              </Stack>
              <Group gap='xs'>
                <DateInput
                  placeholder={t('calendar.patientProfile.appointments.filterByDate')}
                  value={dateFilter}
                  onChange={(value) => {
                    if (value) {
                      const date = typeof value === 'string' ? new Date(value) : value;
                      setDateFilter(date);
                    } else {
                      setDateFilter(null);
                    }
                  }}
                  clearable
                  size='sm'
                  w={150}
                />
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
                        {t('calendar.patientProfile.appointments.selectAll')}
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconX size='1rem' />}
                        onClick={clearSelection}
                        disabled={selectedAppointments.length === 0}
                      >
                        {t('calendar.patientProfile.appointments.clearSelection')}
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconFileExport size='1rem' />}
                        onClick={handleExportSelected}
                        disabled={selectedAppointments.length === 0}
                      >
                        {t('calendar.patientProfile.appointments.exportSelected')}
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
                  {t('calendar.patientProfile.appointments.addAppointment')}
                </Button>
              </Group>
            </Group>

            {filteredAppointments.length === 0 ? (
              <Text size='sm' c='dimmed'>
                {dateFilter
                  ? t('calendar.patientProfile.appointments.noAppointmentsOnDay')
                  : t('calendar.patientProfile.appointments.noAppointmentsForPatient')}
              </Text>
            ) : (
              <Stack gap='md'>
                {filteredAppointments.map(appointment => {
                  const sessionNotes = appointment.id
                    ? getNotesBySession(appointment.id)
                    : [];

                  return (
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
                              e.stopPropagation();
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
                                  ? t('status.appointment.completed')
                                  : appointment.status ===
                                    AppointmentStatus.CANCELLED
                                    ? t('status.appointment.cancelled')
                                    : appointment.status ===
                                      AppointmentStatus.NO_SHOW
                                      ? t('status.appointment.no_show')
                                      : appointment.status ===
                                        AppointmentStatus.SCHEDULED
                                        ? t('status.appointment.scheduled')
                                        : t('status.appointment.rescheduled')}
                              </Badge>
                            </Group>

                            <Text size='sm' c='dimmed'>
                              {t('calendar.patientProfile.appointments.duration')} {appointment.duration} min
                            </Text>

                            {appointment.type && (
                              <Text size='sm' c='dimmed'>
                                {t('calendar.patientProfile.appointments.type')}{' '}
                                {appointment.type === 'therapy'
                                  ? t('calendar.patientProfile.appointments.appointmentTypes.therapy')
                                  : appointment.type === 'initial'
                                    ? t('calendar.patientProfile.appointments.appointmentTypes.initial')
                                    : appointment.type === 'follow_up'
                                      ? t('calendar.patientProfile.appointments.appointmentTypes.follow_up')
                                      : appointment.type === 'consultation'
                                        ? t('calendar.patientProfile.appointments.appointmentTypes.consultation')
                                        : t('calendar.patientProfile.appointments.appointmentTypes.assessment')}
                              </Text>
                            )}

                            {appointment.notes && (
                              <Text size='sm' mt='xs'>
                                <strong>{t('calendar.patientProfile.appointments.notes')}</strong> {appointment.notes}
                              </Text>
                            )}

                            {/* Session notes inline */}
                            {sessionNotes.length > 0 && (
                              <Stack gap={4} mt='xs'>
                                {sessionNotes.map(sNote => (
                                  <Group
                                    key={sNote.id}
                                    gap='xs'
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleEditNote(sNote);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <IconNote size='0.75rem' color='var(--mantine-color-violet-5)' />
                                    <Badge size='xs' variant='light' color='violet'>
                                      {sNote.type === 'soap'
                                        ? t('notes.typeLabels.soap')
                                        : sNote.type === 'assessment'
                                          ? t('notes.typeLabels.assessment')
                                          : t('notes.typeLabels.general')}
                                    </Badge>
                                    <Text size='xs' c='dimmed' lineClamp={1}>
                                      {sNote.title || getNotePreviewShort(sNote)}
                                    </Text>
                                  </Group>
                                ))}
                              </Stack>
                            )}
                          </div>
                        </Group>

                        <Stack align='flex-end' gap='xs'>
                          {appointment.price && (
                            <Text size='sm' fw={500} c='green'>
                              {appointment.price} zł
                            </Text>
                          )}
                          <ActionIcon
                            variant='subtle'
                            size='sm'
                            onClick={e => {
                              e.stopPropagation();
                              handleAddNote(appointment.id);
                            }}
                            aria-label={t('calendar.patientProfile.notes.addSessionNote')}
                          >
                            <IconNote size='1rem' />
                          </ActionIcon>
                        </Stack>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value='notes' pt='md'>
          <Paper p='md' withBorder>
            <Group justify='space-between' mb='md'>
              <Title order={4}>{t('calendar.patientProfile.notes.title', { count: notes.length })}</Title>
              <Button
                size='sm'
                leftSection={<IconPlus size='1rem' />}
                variant='light'
                onClick={() => handleAddNote()}
              >
                {t('calendar.patientProfile.notes.addNote')}
              </Button>
            </Group>

            <NoteList
              notes={notes}
              appointments={appointments}
              onEdit={handleEditNote}
              onDelete={id => setDeleteNoteId(id)}
              onTogglePin={id => togglePin(id)}
            />
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Appointment Form Bottom Sheet */}
      <BottomSheet
        opened={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        title={editingAppointment ? t('calendar.editAppointment') : t('calendar.addAppointment')}
      >
        <AppointmentForm
          appointment={editingAppointment}
          initialPatientId={patient.id?.toString()}
          onSuccess={handleAppointmentFormSuccess}
          onCancel={() => setAppointmentModalOpen(false)}
        />
      </BottomSheet>

      {/* Note Form Bottom Sheet */}
      <BottomSheet
        opened={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={editingNote ? t('notes.editNote') : t('notes.addNote')}
      >
        {patient.id && (
          <NoteForm
            patientId={patient.id}
            note={editingNote}
            sessionId={noteSessionId}
            appointments={appointments}
            onSuccess={handleNoteFormSuccess}
            onCancel={() => setNoteModalOpen(false)}
          />
        )}
      </BottomSheet>

      {/* Delete Note Confirmation */}
      <Modal
        opened={deleteNoteId !== null}
        onClose={() => setDeleteNoteId(null)}
        title={t('notes.deleteNote')}
        centered
        size='sm'
      >
        <Stack gap='md'>
          <Text size='sm'>{t('notes.deleteConfirm')}</Text>
          <Group justify='flex-end'>
            <Button variant='light' onClick={() => setDeleteNoteId(null)}>
              {t('common.cancel')}
            </Button>
            <Button color='red' onClick={handleConfirmDeleteNote}>
              {t('common.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
