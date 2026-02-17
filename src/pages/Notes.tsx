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
} from '@mantine/core';
import { IconNotes, IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
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

function Notes() {
  const { currentPalette } = useTheme();
  const { patients, fetchPatients } = usePatientStore();
  const { notes, fetchNotesByPatient, togglePin, deleteNote, clearNotes } =
    useNoteStore();
  const { getAppointmentsByPatient } = useAppointmentStore();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (selectedPatientId) {
      const patientId = parseInt(selectedPatientId, 10);
      fetchNotesByPatient(patientId);
      getAppointmentsByPatient(patientId).then(setAppointments);
    } else {
      clearNotes();
      setAppointments([]);
    }
  }, [selectedPatientId, fetchNotesByPatient, clearNotes, getAppointmentsByPatient]);

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

  return (
    <Container size='md'>
      <Stack gap='xl'>
        <Group align='center' gap='md'>
          <ThemeIcon size='xl' variant='light' color={currentPalette.primary}>
            <IconNotes size={24} />
          </ThemeIcon>
          <div>
            <Title order={1}>Notatki</Title>
            <Text size='sm' c='dimmed'>
              System notatek terapeutycznych
            </Text>
          </div>
        </Group>

        <Group align='flex-end' gap='md'>
          <Select
            label='Pacjent'
            placeholder='Wybierz pacjenta...'
            data={patientOptions}
            searchable
            clearable
            value={selectedPatientId}
            onChange={setSelectedPatientId}
            style={{ flex: 1 }}
          />
          {patientId && (
            <Button
              leftSection={<IconPlus size='1rem' />}
              variant='light'
              onClick={handleAddNote}
            >
              Dodaj notatkę
            </Button>
          )}
        </Group>

        {patientId ? (
          <NoteList
            notes={notes}
            appointments={appointments}
            onEdit={handleEditNote}
            onDelete={id => setDeleteNoteId(id)}
            onTogglePin={id => togglePin(id)}
          />
        ) : (
          <Text size='sm' c='dimmed' ta='center' py='xl'>
            Wybierz pacjenta, aby zobaczyć jego notatki.
          </Text>
        )}
      </Stack>

      {patientId && (
        <BottomSheet
          opened={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          title={editingNote ? 'Edytuj notatkę' : 'Dodaj notatkę'}
        >
          <NoteForm
            patientId={patientId}
            note={editingNote}
            appointments={appointments}
            onSuccess={handleNoteFormSuccess}
            onCancel={() => setNoteModalOpen(false)}
          />
        </BottomSheet>
      )}

      <Modal
        opened={deleteNoteId !== null}
        onClose={() => setDeleteNoteId(null)}
        title='Usuń notatkę'
        centered
        size='sm'
      >
        <Stack gap='md'>
          <Text size='sm'>Czy na pewno chcesz usunąć tę notatkę?</Text>
          <Group justify='flex-end'>
            <Button variant='light' onClick={() => setDeleteNoteId(null)}>
              Anuluj
            </Button>
            <Button color='red' onClick={handleConfirmDelete}>
              Usuń
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default Notes;
