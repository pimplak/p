import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  SegmentedControl,
  Switch,
  Select,
  Input,
  Box,
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { useNoteStore } from '../stores/useNoteStore';
import { formatDateTime } from '../utils/dates';
import { PinnedNotesChips } from './PinnedNotes';
import type { Appointment } from '../types/Appointment';
import type { Note } from '../types/Patient';

interface NoteFormProps {
  patientId?: number;
  note?: Note | null;
  sessionId?: number;
  appointments?: Appointment[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface NoteFormValues {
  type: 'general' | 'soap' | 'assessment';
  title: string;
  pinned: boolean;
  sessionId: string;
  content: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export function NoteForm({
  patientId,
  note,
  sessionId,
  appointments,
  onSuccess,
  onCancel,
}: NoteFormProps) {
  const { addNote, updateNote, loading } = useNoteStore();

  const form = useForm<NoteFormValues>({
    initialValues: {
      type: note?.type || 'general',
      title: note?.title || '',
      pinned: note?.pinned || false,
      sessionId: (note?.sessionId ?? sessionId ?? '').toString(),
      content: note?.content || '',
      subjective: note?.subjective || '',
      objective: note?.objective || '',
      assessment: note?.assessment || '',
      plan: note?.plan || '',
    },
    validate: {
      content: (value, values) =>
        values.type !== 'soap' && !value?.trim()
          ? 'Treść jest wymagana'
          : null,
      subjective: (value, values) =>
        values.type === 'soap' &&
        !value?.trim() &&
        !values.objective?.trim() &&
        !values.assessment?.trim() &&
        !values.plan?.trim()
          ? 'Wypełnij przynajmniej jedno pole SOAP'
          : null,
    },
  });

  const resolvedSessionId = form.values.sessionId
    ? parseInt(form.values.sessionId, 10)
    : undefined;

  // Reset content fields when type changes
  useEffect(() => {
    if (!note) {
      if (form.values.type === 'soap') {
        form.setFieldValue('content', '');
      } else {
        form.setFieldValue('subjective', '');
        form.setFieldValue('objective', '');
        form.setFieldValue('assessment', '');
        form.setFieldValue('plan', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.type]);

  const handleSubmit = async (values: NoteFormValues) => {
    try {
      const parsedSessionId = values.sessionId
        ? parseInt(values.sessionId, 10)
        : undefined;

      const noteData = {
        ...(patientId !== undefined ? { patientId } : {}),
        sessionId: parsedSessionId || undefined,
        type: values.type,
        title: values.title || undefined,
        pinned: values.pinned,
        content: values.type !== 'soap' ? values.content : undefined,
        subjective: values.type === 'soap' ? values.subjective : undefined,
        objective: values.type === 'soap' ? values.objective : undefined,
        assessment: values.type === 'soap' ? values.assessment : undefined,
        plan: values.type === 'soap' ? values.plan : undefined,
      };

      if (note?.id) {
        await updateNote(note.id, noteData);
        notifications.show({
          title: 'Sukces',
          message: 'Notatka została zaktualizowana',
          color: 'green',
        });
      } else {
        await addNote(noteData);
        notifications.show({
          title: 'Sukces',
          message: 'Notatka została dodana',
          color: 'green',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Błąd podczas zapisywania notatki:', error);
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się zapisać notatki',
        color: 'red',
      });
    }
  };

  const appointmentOptions = appointments
    ? [
        { value: '', label: 'Brak (notatka ogólna)' },
        ...appointments.map(a => ({
          value: a.id!.toString(),
          label: `${formatDateTime(a.date)} — ${a.type || 'Wizyta'}`,
        })),
      ]
    : [];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap='md'>
        {resolvedSessionId && patientId !== undefined && (
          <PinnedNotesChips patientId={patientId} />
        )}

        {patientId !== undefined && appointments && appointments.length > 0 && (
          <Select
            label='Powiązana wizyta'
            placeholder='Wybierz wizytę...'
            data={appointmentOptions}
            searchable
            clearable
            {...form.getInputProps('sessionId')}
          />
        )}

        <Input.Wrapper label='Typ notatki'>
          <ScrollArea scrollbars='x' type='never' mt='xs'>
            <Box
              style={{
                display: 'flex',
                width: 'max-content',
                minWidth: '100%',
              }}
            >
              <SegmentedControl
                data={[
                  { label: 'Ogólna', value: 'general' },
                  { label: 'SOAP', value: 'soap' },
                  { label: 'Ocena', value: 'assessment' },
                ]}
                {...form.getInputProps('type')}
                fullWidth
              />
            </Box>
          </ScrollArea>
        </Input.Wrapper>

        <TextInput
          label='Tytuł (opcjonalnie)'
          placeholder='Krótki tytuł notatki...'
          maxLength={100}
          {...form.getInputProps('title')}
        />

        <Switch
          label='Przypnij notatkę'
          description='Przypięte notatki są widoczne w przeglądzie pacjenta'
          {...form.getInputProps('pinned', { type: 'checkbox' })}
        />

        {form.values.type === 'soap' ? (
          <Stack gap='sm'>
            <Textarea
              label='Subiektywne (S)'
              placeholder='Co pacjent zgłasza...'
              minRows={2}
              autosize
              {...form.getInputProps('subjective')}
            />
            <Textarea
              label='Obiektywne (O)'
              placeholder='Obserwacje kliniczne...'
              minRows={2}
              autosize
              {...form.getInputProps('objective')}
            />
            <Textarea
              label='Ocena (A)'
              placeholder='Ocena kliniczna...'
              minRows={2}
              autosize
              {...form.getInputProps('assessment')}
            />
            <Textarea
              label='Plan (P)'
              placeholder='Plan dalszego postępowania...'
              minRows={2}
              autosize
              {...form.getInputProps('plan')}
            />
          </Stack>
        ) : (
          <Textarea
            label='Treść'
            placeholder={
              form.values.type === 'assessment'
                ? 'Ocena pacjenta...'
                : 'Treść notatki...'
            }
            minRows={4}
            autosize
            {...form.getInputProps('content')}
          />
        )}

        <Group justify='flex-end' mt='md'>
          <Button variant='light' onClick={onCancel}>
            Anuluj
          </Button>
          <Button type='submit' loading={loading}>
            {note ? 'Aktualizuj' : 'Dodaj'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
