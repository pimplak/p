import { Paper, Group, Stack, Title, Badge, ActionIcon, Menu, Text } from '@mantine/core';
import { 
  IconDots, 
  IconEdit, 
  IconPhone, 
  IconMail, 
  IconArchive, 
  IconRestore 
} from '@tabler/icons-react';
import { PATIENT_STATUS, PATIENT_STATUS_LABELS } from '../constants/status';
import { getPatientDisplayName } from '../utils/dates';
import type { Patient } from '../types/Patient';

interface PatientProfileHeaderProps {
  patient: Patient;
  onEdit: () => void;
  onArchive: () => void;
  onRestore: () => void;
}

export function PatientProfileHeader({
  patient,
  onEdit,
  onArchive,
  onRestore
}: PatientProfileHeaderProps) {
  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs">
          <Group align="center">
            <Title order={2}>
              {getPatientDisplayName(patient)}
            </Title>
            <Badge
              color={patient.status === PATIENT_STATUS.ACTIVE ? 'green' : 'gray'}
              variant="light"
            >
              {PATIENT_STATUS_LABELS[patient.status]}
            </Badge>
          </Group>
          
          {patient.nazwa && (
            <Text size="sm" c="dimmed">
              {patient.firstName} {patient.lastName}
            </Text>
          )}
          
          {patient.tags && patient.tags.length > 0 && (
            <Group gap="xs">
              {patient.tags.map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>

        <Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light">
                <IconDots size="1rem" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size="1rem" />}
                onClick={onEdit}
              >
                Edytuj dane
              </Menu.Item>
              
              {patient.phone && (
                <Menu.Item
                  leftSection={<IconPhone size="1rem" />}
                  component="a"
                  href={`tel:${patient.phone}`}
                >
                  Zadzwoń
                </Menu.Item>
              )}
              
              {patient.email && (
                <Menu.Item
                  leftSection={<IconMail size="1rem" />}
                  component="a"
                  href={`mailto:${patient.email}`}
                >
                  Wyślij email
                </Menu.Item>
              )}

              <Menu.Divider />

              {patient.status === PATIENT_STATUS.ACTIVE ? (
                <Menu.Item
                  leftSection={<IconArchive size="1rem" />}
                  color="red"
                  onClick={onArchive}
                >
                  Archiwizuj
                </Menu.Item>
              ) : (
                <Menu.Item
                  leftSection={<IconRestore size="1rem" />}
                  color="green"
                  onClick={onRestore}
                >
                  Przywróć
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  );
} 