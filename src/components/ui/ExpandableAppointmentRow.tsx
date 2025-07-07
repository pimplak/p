import { 
  Card, 
  Group, 
  Text, 
  Badge, 
  ActionIcon, 
  Collapse, 
  Stack,
  Divider,
  Box
} from '@mantine/core';
import { 
  IconChevronDown, 
  IconChevronUp, 
  IconEdit, 
  IconTrash 
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { SMSReminderButton } from '../SMSReminderButton';
import type { AppointmentWithPatient } from '../../types/Appointment';

interface ExpandableAppointmentRowProps {
  appointment: AppointmentWithPatient;
  onEditAppointment: (appointment: AppointmentWithPatient) => void;
  onDeleteAppointment: (id: number) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function ExpandableAppointmentRow({
  appointment,
  onEditAppointment,
  onDeleteAppointment,
  getStatusColor,
  getStatusLabel
}: ExpandableAppointmentRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card 
      shadow="sm" 
      p="md" 
      mb="sm"
      style={{ cursor: 'pointer' }}
    >
      {/* Main row - always visible */}
      <Group 
        justify="space-between" 
        onClick={() => setExpanded(!expanded)}
        wrap="nowrap"
      >
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group gap="sm" wrap="nowrap">
            <Text fw={600} size="sm">
              {format(new Date(appointment.date), 'HH:mm')}
            </Text>
            <Text 
              fw={500} 
              size="sm" 
              style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1 
              }}
            >
              {appointment.patient?.firstName} {appointment.patient?.lastName}
            </Text>
          </Group>
          <Group gap="xs" mt="xs">
            <Badge 
              color={getStatusColor(appointment.status)}
              size="sm"
            >
              {getStatusLabel(appointment.status)}
            </Badge>
            {appointment.price && (
              <Text size="xs" c="dimmed" fw={500}>
                {appointment.price} zł
              </Text>
            )}
          </Group>
        </Box>
        
        <ActionIcon 
          variant="subtle" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? <IconChevronUp /> : <IconChevronDown />}
        </ActionIcon>
      </Group>

      {/* Expanded details */}
      <Collapse in={expanded}>
        <Divider my="md" />
        <Stack gap="sm">
          {/* Patient details */}
          {appointment.patient?.phone && (
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Telefon:</Text>
              <Text size="sm">{appointment.patient.phone}</Text>
            </Group>
          )}
          
          {/* Appointment details */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Typ wizyty:</Text>
            <Text size="sm">{appointment.type || 'Wizyta'}</Text>
          </Group>
          
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Czas trwania:</Text>
            <Text size="sm">{appointment.duration} min</Text>
          </Group>
          
          {appointment.price && (
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Cena:</Text>
              <Text size="sm" fw={500}>{appointment.price} zł</Text>
            </Group>
          )}
          
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Płatność:</Text>
            {appointment.paymentInfo?.isPaid ? (
              <Badge color="green" size="sm">Opłacono</Badge>
            ) : (
              <Badge color="red" size="sm">Nieopłacono</Badge>
            )}
          </Group>
          
          {appointment.notes && (
            <>
              <Text size="sm" c="dimmed">Notatki:</Text>
              <Text size="sm">{appointment.notes}</Text>
            </>
          )}
          
          {/* Actions */}
          <Divider my="xs" />
          <Group justify="flex-end" gap="xs">
            {appointment.patient && (
              <SMSReminderButton
                patient={appointment.patient}
                appointment={appointment}
                variant="button"
                size="sm"
                onReminderSent={() => {
                  // Refresh appointments
                  window.location.reload();
                }}
              />
            )}
            <ActionIcon 
              variant="light" 
              color="blue"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onEditAppointment(appointment);
              }}
            >
              <IconEdit size="1.2rem" />
            </ActionIcon>
            <ActionIcon 
              variant="light" 
              color="red"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                if (appointment.id) onDeleteAppointment(appointment.id);
              }}
            >
              <IconTrash size="1.2rem" />
            </ActionIcon>
          </Group>
        </Stack>
      </Collapse>
    </Card>
  );
} 