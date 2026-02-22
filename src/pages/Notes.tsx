import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  ThemeIcon,
  Select,
  Button,
  Modal,
  SegmentedControl,
} from '@mantine/core';
import { IconNotes, IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NoteForm } from '../components/NoteForm';
import { NoteList } from '../components/NoteList';
import { BottomSheet } from '../components/ui/BottomSheet';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useNoteStore } from '../stores/useNoteStore';
import { usePatientStore } from '../stores/usePatientStore';
import { getPatientDisplayName } from '../utils/dates';
import type { Appointment } from '../types/Appointment';
import type { Note } from '../types/Patient';

type ViewMode = 'personal' | 'patient';

function Notes() {
  const { t } = useTranslation();
  const { currentPalette } = useTheme();
  const { patients, fetchPatients } = usePatientStore();
  const { notes, fetchNotesByPatient, fetchPersonalNotes, togglePin, deleteNote, clearNotes } =
    useNoteStore();
  const { getAppointmentsByPatient } = useAppointmentStore();
  const [viewMode, setViewMode] = useState<ViewMode>('personal');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Load personal notes on mount and when switching to personal mode
  useEffect(() => {
    if (viewMode === 'personal') {
      fetchPersonalNotes();
      setAppointments([]);
    } else {
      clearNotes();
    }
  }, [viewMode, fetchPersonalNotes, clearNotes]);

  // Load patient notes when patient is selected
  useEffect(() => {
    if (viewMode === 'patient') {
      if (selectedPatientId) {
        const patientId = parseInt(selectedPatientId, 10);
        fetchNotesByPatient(patientId);
        getAppointmentsByPatient(patientId).then(setAppointments);
      } else {
        clearNotes();
        setAppointments([]);
      }
    }
  }, [selectedPatientId, viewMode, fetchNotesByPatient, clearNotes, getAppointmentsByPatient]);

  const patientOptions = patients.map(p => ({
    value: p.id?.toString() || '',
    label: getPatientDisplayName(p),
  }));

  const patientId = selectedPatientId ? parseInt(selectedPatientId, 10) : null;

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteModalOpen(true);
  };

  const handleNoteFormSuccess = () => {
    setNoteModalOpen(false);
    setEditingNote(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteNoteId) {
      await deleteNote(deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  const handleViewModeChange = (value: string) => {
    setViewMode(value as ViewMode);
    setSelectedPatientId(null);
    setEditingNote(null);
    setNoteModalOpen(false);
  };

  const showAddButton = viewMode === 'personal' || (viewMode === 'patient' && patientId !== null);

  return (
    <Container size='md'>
      <Stack gap='xl'>
        <Group align='center' gap='md'>
          <ThemeIcon size='xl' variant='light' color={currentPalette.primary}>
            <IconNotes size={24} />
          </ThemeIcon>
          <div>
            <Title order={1}>{t('notes.title')}</Title>
            <Text size='sm' c='dimmed'>
              {t('notes.subtitle')}
            </Text>
          </div>
        </Group>

        <SegmentedControl
          value={viewMode}
          onChange={handleViewModeChange}
          data={[
            { label: t('notes.viewModes.personal'), value: 'personal' },
            { label: t('notes.viewModes.patient'), value: 'patient' },
          ]}
        />

        {viewMode === 'patient' && (
          <Group align='flex-end' gap='md'>
            <Select
              label={t('calendar.table.patient')}
              placeholder={t('notes.selectPatientPlaceholder')}
              data={patientOptions}
              searchable
              clearable
              value={selectedPatientId}
              onChange={setSelectedPatientId}
              style={{ flex: 1 }}
            />
          </Group>
        )}

        <Group justify='flex-end'>
          {showAddButton && (
            <Button
              leftSection={<IconPlus size='1rem' />}
              variant='light'
              onClick={handleAddNote}
            >
              {t('notes.addNote')}
            </Button>
          )}
        </Group>

        {viewMode === 'personal' ? (
          notes.length > 0 ? (
            <NoteList
              notes={notes}
              onEdit={handleEditNote}
              onDelete={id => setDeleteNoteId(id)}
              onTogglePin={id => togglePin(id)}
            />
          ) : (
            <Text size='sm' c='dimmed' ta='center' py='xl'>
              {t('notes.noPersonalNotes')}
            </Text>
          )
        ) : patientId ? (
          <NoteList
            notes={notes}
            appointments={appointments}
            onEdit={handleEditNote}
            onDelete={id => setDeleteNoteId(id)}
            onTogglePin={id => togglePin(id)}
          />
        ) : (
          <Text size='sm' c='dimmed' ta='center' py='xl'>
            {t('notes.selectPatient')}
          </Text>
        )}
      </Stack>

      <BottomSheet
        opened={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={editingNote ? t('notes.editNote') : t('notes.addNote')}
      >
        <NoteForm
          patientId={viewMode === 'patient' && patientId ? patientId : undefined}
          note={editingNote}
          appointments={viewMode === 'patient' ? appointments : undefined}
          onSuccess={handleNoteFormSuccess}
          onCancel={() => setNoteModalOpen(false)}
        />
      </BottomSheet>

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
            <Button color='red' onClick={handleConfirmDelete}>
              {t('common.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default Notes;
