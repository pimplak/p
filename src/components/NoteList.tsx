import {
  Stack,
  Card,
  Group,
  Text,
  Badge,
  ActionIcon,
} from '@mantine/core';
import {
  IconPin,
  IconPinnedOff,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { formatDate, formatDateTime } from '../utils/dates';
import type { Appointment } from '../types/Appointment';
import type { Note } from '../types/Patient';

interface NoteListProps {
  notes: Note[];
  appointments?: Appointment[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number) => void;
}

const NOTE_TYPE_CONFIG = {
  general: { label: 'Ogólna', color: 'blue' },
  soap: { label: 'SOAP', color: 'green' },
  assessment: { label: 'Ocena', color: 'orange' },
} as const;

function getNotePreview(note: Note): string {
  if (note.type === 'soap') {
    const parts = [
      note.subjective && `S: ${note.subjective.slice(0, 50)}`,
      note.objective && `O: ${note.objective.slice(0, 50)}`,
      note.assessment && `A: ${note.assessment.slice(0, 50)}`,
      note.plan && `P: ${note.plan.slice(0, 50)}`,
    ].filter(Boolean);
    return parts.join(' | ') || 'Pusta notatka SOAP';
  }
  return note.content?.slice(0, 150) || 'Brak treści';
}

export function NoteList({
  notes,
  appointments,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <Text size='sm' c='dimmed'>
        Brak notatek.
      </Text>
    );
  }

  const appointmentMap = new Map(
    appointments?.map(a => [a.id, a]) ?? []
  );

  return (
    <Stack gap='sm'>
      {notes.map(note => {
        const typeConfig = NOTE_TYPE_CONFIG[note.type];
        const linkedAppointment = note.sessionId
          ? appointmentMap.get(note.sessionId)
          : undefined;

        return (
          <Card
            key={note.id}
            withBorder
            p='md'
            style={{ cursor: 'pointer' }}
            onClick={() => onEdit(note)}
          >
            <Group justify='space-between' align='flex-start'>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Group gap='xs' mb='xs'>
                  <Badge
                    size='sm'
                    variant='light'
                    color={typeConfig.color}
                  >
                    {typeConfig.label}
                  </Badge>
                  {note.pinned && (
                    <Badge size='sm' variant='dot' color='yellow'>
                      Przypięta
                    </Badge>
                  )}
                  {linkedAppointment && (
                    <Badge size='sm' variant='outline' color='violet'>
                      Sesja {formatDateTime(linkedAppointment.date)}
                    </Badge>
                  )}
                  {note.sessionId && !linkedAppointment && (
                    <Badge size='sm' variant='outline' color='violet'>
                      Sesja
                    </Badge>
                  )}
                </Group>

                {note.title && (
                  <Text fw={500} size='sm' mb={2}>
                    {note.title}
                  </Text>
                )}

                <Text size='xs' c='dimmed' lineClamp={2}>
                  {getNotePreview(note)}
                </Text>

                <Text size='xs' c='dimmed' mt='xs'>
                  {formatDate(note.createdAt)}
                </Text>
              </div>

              <Group gap={4}>
                <ActionIcon
                  variant='subtle'
                  size='sm'
                  onClick={e => {
                    e.stopPropagation();
                    if (note.id) onTogglePin(note.id);
                  }}
                  aria-label={note.pinned ? 'Odepnij' : 'Przypnij'}
                >
                  {note.pinned ? (
                    <IconPinnedOff size='0.875rem' />
                  ) : (
                    <IconPin size='0.875rem' />
                  )}
                </ActionIcon>
                <ActionIcon
                  variant='subtle'
                  size='sm'
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                  aria-label='Edytuj'
                >
                  <IconEdit size='0.875rem' />
                </ActionIcon>
                <ActionIcon
                  variant='subtle'
                  size='sm'
                  color='red'
                  onClick={e => {
                    e.stopPropagation();
                    if (note.id) onDelete(note.id);
                  }}
                  aria-label='Usuń'
                >
                  <IconTrash size='0.875rem' />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}
