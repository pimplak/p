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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          ? t('noteForm.contentRequired')
          : null,
      subjective: (value, values) =>
        values.type === 'soap' &&
        !value?.trim() &&
        !values.objective?.trim() &&
        !values.assessment?.trim() &&
        !values.plan?.trim()
          ? t('noteForm.soap.atLeastOne')
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
          title: t('common.success'),
          message: t('notes.notifications.noteUpdated'),
          color: 'green',
        });
      } else {
        await addNote(noteData);
        notifications.show({
          title: t('common.success'),
          message: t('notes.notifications.noteAdded'),
          color: 'green',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Błąd podczas zapisywania notatki:', error);
      notifications.show({
        title: t('common.error'),
        message: t('notes.notifications.errorSaving'),
        color: 'red',
      });
    }
  };

  const appointmentOptions = appointments
    ? [
        { value: '', label: t('noteForm.noAppointment') },
        ...appointments.map(a => ({
          value: a.id!.toString(),
          label: `${formatDateTime(a.date)} — ${a.type || t('appointmentForm.appointmentType')}`,
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
            label={t('noteForm.relatedAppointment')}
            placeholder={t('noteForm.relatedAppointmentPlaceholder')}
            data={appointmentOptions}
            searchable
            clearable
            {...form.getInputProps('sessionId')}
          />
        )}

        <Input.Wrapper label={t('noteForm.type')}>
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
                  { label: t('notes.types.general'), value: 'general' },
                  { label: t('notes.types.soap'), value: 'soap' },
                  { label: t('notes.types.assessment'), value: 'assessment' },
                ]}
                {...form.getInputProps('type')}
                fullWidth
              />
            </Box>
          </ScrollArea>
        </Input.Wrapper>

        <TextInput
          label={t('noteForm.noteTitle')}
          placeholder={t('noteForm.noteTitlePlaceholder')}
          maxLength={100}
          {...form.getInputProps('title')}
        />

        <Switch
          label={t('notes.pinned')}
          description={t('notes.pinnedDescription')}
          {...form.getInputProps('pinned', { type: 'checkbox' })}
        />

        {form.values.type === 'soap' ? (
          <Stack gap='sm'>
            <Textarea
              label={t('noteForm.soap.subjective')}
              placeholder={t('noteForm.soap.subjectivePlaceholder')}
              minRows={2}
              autosize
              {...form.getInputProps('subjective')}
            />
            <Textarea
              label={t('noteForm.soap.objective')}
              placeholder={t('noteForm.soap.objectivePlaceholder')}
              minRows={2}
              autosize
              {...form.getInputProps('objective')}
            />
            <Textarea
              label={t('noteForm.soap.assessment')}
              placeholder={t('noteForm.soap.assessmentPlaceholder')}
              minRows={2}
              autosize
              {...form.getInputProps('assessment')}
            />
            <Textarea
              label={t('noteForm.soap.plan')}
              placeholder={t('noteForm.soap.planPlaceholder')}
              minRows={2}
              autosize
              {...form.getInputProps('plan')}
            />
          </Stack>
        ) : (
          <Textarea
            label={t('noteForm.content')}
            placeholder={
              form.values.type === 'assessment'
                ? t('noteForm.assessmentPlaceholder')
                : t('noteForm.contentPlaceholder')
            }
            minRows={4}
            autosize
            {...form.getInputProps('content')}
          />
        )}

        <Group justify='flex-end' mt='md'>
          <Button variant='light' onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type='submit' loading={loading}>
            {note ? t('common.update') : t('common.add')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
