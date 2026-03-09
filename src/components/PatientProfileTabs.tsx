import {
  Stack,
  Text,
  Badge,
  Group,
  Card,
  Title,
  Button,
  Checkbox,
  Menu,
  ActionIcon,
  Modal,
  ScrollArea,
  UnstyledButton,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
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
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoteStore } from '../stores/useNoteStore';
import { usePatientStore } from '../stores/usePatientStore';
import { AppointmentStatus } from '../types/Appointment';
import { formatDate, formatDateTime } from '../utils/dates';
import { exportToExcel } from '../utils/export';
import { AppointmentForm } from './AppointmentForm';
import { DocumentForm } from './documents/DocumentForm';
import { DocumentList } from './documents/DocumentList';
import { NoteForm } from './NoteForm';
import { NoteList } from './NoteList';
import { PatientQuickInfoCards } from './PatientQuickInfoCards';
import { PinnedNotesOverview } from './PinnedNotes';
import { BottomSheet } from './ui/BottomSheet';
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';
import type { Note, Patient, Document } from '../types/Patient';

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
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deleteDocumentId, setDeleteDocumentId] = useState<number | null>(null);
  const { getAppointmentsByPatient } = useAppointmentStore();
  const { notes, fetchNotesByPatient, togglePin, deleteNote, clearNotes, getPinnedNotes, getNotesBySession } = useNoteStore();
  const {
    documents,
    filterType: documentFilterType,
    fetchDocumentsByPatient,
    togglePin: toggleDocumentPin,
    deleteDocument,
    clearDocuments,
    setFilterType: setDocumentFilterType,
    getFilteredDocuments,
  } = useDocumentStore();
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
        await fetchDocumentsByPatient(patient.id);
      }
    };

    loadData();
    return () => { clearNotes(); clearDocuments(); };
  }, [patient.id, getAppointmentsByPatient, fetchPatients, fetchNotesByPatient, clearNotes, fetchDocumentsByPatient, clearDocuments]);

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

  const handleAddDocument = () => {
    setEditingDocument(null);
    setDocumentModalOpen(true);
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocument(doc);
    setDocumentModalOpen(true);
  };

  const handleDocumentFormSuccess = () => {
    setDocumentModalOpen(false);
    setEditingDocument(null);
  };

  const handleConfirmDeleteDocument = async () => {
    if (deleteDocumentId) {
      await deleteDocument(deleteDocumentId);
      setDeleteDocumentId(null);
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

  const segmentData = [
    { label: t('calendar.patientProfile.tabs.overview'), value: 'overview' },
    { label: t('calendar.patientProfile.tabs.appointments'), value: 'appointments' },
    { label: t('calendar.patientProfile.tabs.notes'), value: 'notes' },
    { label: t('calendar.patientProfile.tabs.documents'), value: 'documents' },
  ];

  return (
    <>
      <ScrollArea scrollbarSize={0} type='never'>
        <Group gap={6} wrap='nowrap' pb={2}>
          {segmentData.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <UnstyledButton
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  backgroundColor: isActive ? currentPalette.primary : `${currentPalette.text}06`,
                  color: isActive ? '#fff' : `${currentPalette.text}70`,
                  border: `1px solid ${isActive ? currentPalette.primary : `${currentPalette.text}10`}`,
                  transition: 'all 150ms ease',
                }}
              >
                {tab.label}
              </UnstyledButton>
            );
          })}
        </Group>
      </ScrollArea>

      <div style={{ marginTop: 16 }}>
        {activeTab === 'overview' && (
          <Stack gap='md'>
            <PatientQuickInfoCards patient={patient} />

            <PinnedNotesOverview
              notes={pinnedNotes}
              onNoteClick={note => {
                handleEditNote(note);
              }}
            />

            {patient.address && (
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: `${currentPalette.text}04`,
                  border: `1px solid ${currentPalette.text}08`,
                }}
              >
                <Text size='xs' fw={700} mb={4} style={{ color: `${currentPalette.text}50`, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10 }}>
                  {t('calendar.patientProfile.overview.address')}
                </Text>
                <Text size='sm'>{patient.address}</Text>
              </div>
            )}

            {!patient.address && pinnedNotes.length === 0 && (
              <Text size='sm' c='dimmed' ta='center' py='lg'>
                {t('calendar.patientProfile.overview.noAdditionalInfo')}
              </Text>
            )}

            <div style={{ padding: '8px 0' }}>
              <Text size='xs' style={{ color: `${currentPalette.text}40` }}>
                {t('calendar.patientProfile.overview.created')} {formatDate(patient.createdAt)}
              </Text>
              <Text size='xs' style={{ color: `${currentPalette.text}40` }}>
                {t('calendar.patientProfile.overview.lastUpdate')} {formatDate(patient.updatedAt)}
              </Text>
            </div>
          </Stack>
        )}

        {activeTab === 'appointments' && (
          <Stack gap='md'>
            <Group justify='space-between' align='flex-start'>
              <Stack gap='xs'>
                <Title order={5}>{t('calendar.patientProfile.appointments.title', { count: filteredAppointments.length })}</Title>
                {selectedAppointments.length > 0 && (
                  <Badge color={currentPalette.primary} variant='light' size='sm'>
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
                  size='xs'
                  w={130}
                />
                {appointments.length > 0 && (
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant='subtle' size='sm' style={{ color: `${currentPalette.text}50` }}>
                        <IconDownload size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconCheck size='1rem' />}
                        onClick={selectAllAppointments}
                        disabled={selectedAppointments.length === appointments.length}
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
                <ActionIcon
                  size='sm'
                  variant='light'
                  onClick={handleAddAppointment}
                  color={currentPalette.primary}
                >
                  <IconPlus size={14} />
                </ActionIcon>
              </Group>
            </Group>

            {filteredAppointments.length === 0 ? (
              <Text size='sm' c='dimmed' ta='center' py='lg'>
                {dateFilter
                  ? t('calendar.patientProfile.appointments.noAppointmentsOnDay')
                  : t('calendar.patientProfile.appointments.noAppointmentsForPatient')}
              </Text>
            ) : (
              <Stack gap={8}>
                {filteredAppointments.map(appointment => {
                  const sessionNotes = appointment.id
                    ? getNotesBySession(appointment.id)
                    : [];

                  return (
                    <Card
                      key={appointment.id}
                      p='sm'
                      radius='md'
                      style={{
                        cursor: 'pointer',
                        backgroundColor: `${currentPalette.text}04`,
                        border: `1px solid ${currentPalette.text}08`,
                        transition: 'all 150ms ease',
                      }}
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      <Group justify='space-between' align='flex-start'>
                        <Group align='flex-start' gap='sm'>
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
                            size='xs'
                          />
                          <div style={{ flex: 1 }}>
                            <Group gap='xs' mb={4}>
                              <Text fw={600} size='sm'>
                                {formatDateTime(appointment.date)}
                              </Text>
                              <Badge
                                color={getStatusBadgeColor(appointment.status)}
                                variant='light'
                                size='xs'
                              >
                                {appointment.status === AppointmentStatus.COMPLETED
                                  ? t('status.appointment.completed')
                                  : appointment.status === AppointmentStatus.CANCELLED
                                    ? t('status.appointment.cancelled')
                                    : appointment.status === AppointmentStatus.NO_SHOW
                                      ? t('status.appointment.no_show')
                                      : appointment.status === AppointmentStatus.SCHEDULED
                                        ? t('status.appointment.scheduled')
                                        : t('status.appointment.rescheduled')}
                              </Badge>
                            </Group>

                            <Text size='xs' style={{ color: `${currentPalette.text}50` }}>
                              {appointment.duration} min
                              {appointment.type && ` · ${
                                appointment.type === 'therapy'
                                  ? t('calendar.patientProfile.appointments.appointmentTypes.therapy')
                                  : appointment.type === 'initial'
                                    ? t('calendar.patientProfile.appointments.appointmentTypes.initial')
                                    : appointment.type === 'follow_up'
                                      ? t('calendar.patientProfile.appointments.appointmentTypes.follow_up')
                                      : appointment.type === 'consultation'
                                        ? t('calendar.patientProfile.appointments.appointmentTypes.consultation')
                                        : t('calendar.patientProfile.appointments.appointmentTypes.assessment')
                              }`}
                            </Text>

                            {appointment.notes && (
                              <Text size='xs' mt={4} style={{ color: `${currentPalette.text}60` }}>
                                {appointment.notes}
                              </Text>
                            )}

                            {sessionNotes.length > 0 && (
                              <Stack gap={2} mt={4}>
                                {sessionNotes.map(sNote => (
                                  <Group
                                    key={sNote.id}
                                    gap={4}
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleEditNote(sNote);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <IconNote size={11} color='var(--mantine-color-violet-5)' />
                                    <Text size='xs' c='dimmed' lineClamp={1}>
                                      {sNote.title || getNotePreviewShort(sNote)}
                                    </Text>
                                  </Group>
                                ))}
                              </Stack>
                            )}
                          </div>
                        </Group>

                        <Stack align='flex-end' gap={4}>
                          {appointment.price && (
                            <Badge size='xs' variant='light' color='green'>
                              {appointment.price} zł
                            </Badge>
                          )}
                          <ActionIcon
                            variant='subtle'
                            size='xs'
                            onClick={e => {
                              e.stopPropagation();
                              handleAddNote(appointment.id);
                            }}
                            aria-label={t('calendar.patientProfile.notes.addSessionNote')}
                            style={{ color: `${currentPalette.text}40` }}
                          >
                            <IconNote size={13} />
                          </ActionIcon>
                        </Stack>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Stack>
        )}

        {activeTab === 'notes' && (
          <Stack gap='md'>
            <Group justify='space-between'>
              <Title order={5}>{t('calendar.patientProfile.notes.title', { count: notes.length })}</Title>
              <ActionIcon
                size='sm'
                variant='light'
                onClick={() => handleAddNote()}
                color={currentPalette.primary}
              >
                <IconPlus size={14} />
              </ActionIcon>
            </Group>

            <NoteList
              notes={notes}
              appointments={appointments}
              onEdit={handleEditNote}
              onDelete={id => setDeleteNoteId(id)}
              onTogglePin={id => togglePin(id)}
            />
          </Stack>
        )}

        {activeTab === 'documents' && (
          <Stack gap='md'>
            <Group justify='space-between'>
              <Title order={5}>
                {t('calendar.patientProfile.documents.title', { count: getFilteredDocuments().length })}
              </Title>
              <ActionIcon
                size='sm'
                variant='light'
                onClick={handleAddDocument}
                color={currentPalette.primary}
              >
                <IconPlus size={14} />
              </ActionIcon>
            </Group>
            <DocumentList
              documents={documents}
              filterType={documentFilterType}
              onFilterChange={setDocumentFilterType}
              onEdit={handleEditDocument}
              onDelete={id => setDeleteDocumentId(id)}
              onTogglePin={id => toggleDocumentPin(id)}
            />
          </Stack>
        )}
      </div>

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

      {/* Document Form Bottom Sheet */}
      <BottomSheet
        opened={documentModalOpen}
        onClose={() => setDocumentModalOpen(false)}
        title={editingDocument ? t('documents.editDocument') : t('documents.addDocument')}
      >
        {patient.id && (
          <DocumentForm
            patientId={patient.id}
            document={editingDocument}
            onSuccess={handleDocumentFormSuccess}
            onCancel={() => setDocumentModalOpen(false)}
          />
        )}
      </BottomSheet>

      {/* Delete Document Confirmation */}
      <Modal
        opened={deleteDocumentId !== null}
        onClose={() => setDeleteDocumentId(null)}
        title={t('documents.deleteDocument')}
        centered
        size='sm'
      >
        <Stack gap='md'>
          <Text size='sm'>{t('documents.deleteConfirm')}</Text>
          <Group justify='flex-end'>
            <Button variant='light' onClick={() => setDeleteDocumentId(null)}>
              {t('common.cancel')}
            </Button>
            <Button color='red' onClick={handleConfirmDeleteDocument}>
              {t('common.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
