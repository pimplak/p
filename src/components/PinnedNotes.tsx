import {
  Group,
  Text,
  Badge,
  Tooltip,
  CloseButton,
  Stack,
  Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPin,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNoteStore } from '../stores/useNoteStore';
import type { Note } from '../types/Patient';

// --- PinnedNotesOverview: chips for the Overview tab ---

interface PinnedNotesOverviewProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
}

function getNoteTooltip(note: Note): string {
  if (note.content) return note.content;
  return (
    [
      note.subjective && `S: ${note.subjective}`,
      note.objective && `O: ${note.objective}`,
      note.assessment && `A: ${note.assessment}`,
      note.plan && `P: ${note.plan}`,
    ]
      .filter(Boolean)
      .join('\n') || 'Brak treści'
  );
}

export function PinnedNotesOverview({
  notes,
  onNoteClick,
}: PinnedNotesOverviewProps) {
  if (notes.length === 0) return null;

  return (
    <div>
      <Group gap='xs' mb='xs'>
        <IconPin size='0.875rem' />
        <Text size='sm' fw={500}>
          Przypięte notatki
        </Text>
      </Group>
      <Group gap='xs'>
        {notes.map(note => (
          <Tooltip
            key={note.id}
            label={getNoteTooltip(note)}
            multiline
            maw={300}
            withArrow
          >
            <Badge
              variant='light'
              style={{ cursor: 'pointer' }}
              onClick={() => onNoteClick(note)}
            >
              {note.title || 'Notatka'}
            </Badge>
          </Tooltip>
        ))}
      </Group>
    </div>
  );
}

// --- PinnedNotesChips: dismissible chips for the session note form ---

interface PinnedNotesChipsProps {
  patientId: number;
}

export function PinnedNotesChips({ patientId }: PinnedNotesChipsProps) {
  const { getPinnedNotes } = useNoteStore();
  const pinnedNotes = getPinnedNotes(patientId);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [opened, { toggle }] = useDisclosure(true);

  const visibleNotes = pinnedNotes.filter(n => n.id && !dismissed.has(n.id));

  if (visibleNotes.length === 0) return null;

  const handleDismiss = (noteId: number) => {
    setDismissed(prev => new Set(prev).add(noteId));
  };

  return (
    <Stack gap='xs'>
      <Group
        gap='xs'
        style={{ cursor: 'pointer' }}
        onClick={toggle}
      >
        {opened ? (
          <IconChevronDown size='1rem' />
        ) : (
          <IconChevronRight size='1rem' />
        )}
        <IconPin size='0.875rem' />
        <Text fw={500} size='sm'>
          Kontekst pacjenta
        </Text>
      </Group>

      <Collapse in={opened}>
        <Group gap='xs'>
          {visibleNotes.map(note => (
            <Tooltip
              key={note.id}
              label={getNoteTooltip(note)}
              multiline
              maw={300}
              withArrow
            >
              <Badge
                variant='light'
                rightSection={
                  <CloseButton
                    size='xs'
                    onClick={e => {
                      e.stopPropagation();
                      if (note.id) handleDismiss(note.id);
                    }}
                    aria-label='Ukryj'
                  />
                }
              >
                {note.title || 'Notatka'}
              </Badge>
            </Tooltip>
          ))}
        </Group>
      </Collapse>
    </Stack>
  );
}
