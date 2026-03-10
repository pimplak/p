import {
  Stack,
  Text,
  Avatar,
  Group,
  Badge,
  ActionIcon,
  Menu,
  UnstyledButton,
} from '@mantine/core';
import {
  IconDots,
  IconEdit,
  IconPhone,
  IconMail,
  IconArchive,
  IconRestore,
  IconMessageCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { PATIENT_STATUS, PATIENT_STATUS_LABELS } from '../constants/status';
import { useTheme } from '../hooks/useTheme';
import { getPatientDisplayName, calculateAge } from '../utils/dates';
import type { Patient } from '../types/Patient';

function getInitials(patient: Patient): string {
  const first = patient.firstName?.charAt(0) ?? '';
  const last = patient.lastName?.charAt(0) ?? '';
  return (first + last).toUpperCase() || '?';
}

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
  onRestore,
}: PatientProfileHeaderProps) {
  const { t } = useTranslation();
  const { utilityColors, currentPalette } = useTheme();

  const age = calculateAge(patient.birthDate);
  const statusLabel =
    patient.status === PATIENT_STATUS.ACTIVE
      ? t('patients.statusActive')
      : PATIENT_STATUS_LABELS[patient.status];

  return (
    <Stack gap={16}>
      {/* Top row: Avatar + Info side by side */}
      <Group gap='lg' align='flex-start' wrap='nowrap'>
        {/* Avatar */}
        <Avatar
          size={80}
          radius={9999}
          style={{
            backgroundColor: `${currentPalette.primary}18`,
            color: currentPalette.primary,
            fontWeight: 700,
            fontSize: '1.5rem',
            border: `3px solid ${currentPalette.primary}30`,
            flexShrink: 0,
          }}
        >
          {getInitials(patient)}
        </Avatar>

        {/* Info column */}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          {/* Name + status dot */}
          <Group gap={6} align='center'>
            <Text fw={700} size='lg' style={{ color: currentPalette.text }}>
              {getPatientDisplayName(patient)}
            </Text>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor:
                  patient.status === PATIENT_STATUS.ACTIVE
                    ? utilityColors.success
                    : '#888',
              }}
            />
          </Group>

          {/* Real name under nickname */}
          {patient.nazwa && (
            <Text size='xs' style={{ color: `${currentPalette.text}50` }}>
              {patient.firstName} {patient.lastName}
            </Text>
          )}

          {/* Subtitle: age + status */}
          <Text size='xs' style={{ color: `${currentPalette.text}60` }}>
            {age ? `${age} ${t('patientForm.ageYears')}` : ''}{age ? ' · ' : ''}{statusLabel}
          </Text>

          {/* Tags */}
          {patient.tags && patient.tags.length > 0 && (
            <Group gap={6} mt={4}>
              {patient.tags.map(tag => (
                <Badge
                  key={tag}
                  variant='outline'
                  size='xs'
                  style={{
                    borderColor: `${currentPalette.text}20`,
                    color: `${currentPalette.text}70`,
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>
      </Group>

      {/* Action buttons: Call + Message + Edit menu */}
      <Group gap='sm'>
        {patient.phone && (
          <UnstyledButton
            component='a'
            href={`tel:${patient.phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 20,
              border: `1px solid ${currentPalette.text}18`,
              color: currentPalette.text,
              fontSize: 13,
              fontWeight: 500,
              transition: 'background-color 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${currentPalette.text}08`)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <IconPhone size={15} />
            {t('patients.call')}
          </UnstyledButton>
        )}

        {patient.email && (
          <UnstyledButton
            component='a'
            href={`mailto:${patient.email}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 20,
              backgroundColor: currentPalette.primary,
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              transition: 'opacity 150ms ease',
            }}
          >
            <IconMessageCircle size={15} />
            {t('patients.message')}
          </UnstyledButton>
        )}

        <Menu shadow='md' width={200}>
          <Menu.Target>
            <ActionIcon
              variant='subtle'
              size='md'
              style={{
                color: `${currentPalette.text}60`,
                border: `1px solid ${currentPalette.text}15`,
                borderRadius: 20,
              }}
            >
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size='1rem' />}
              onClick={onEdit}
            >
              {t('common.edit')}
            </Menu.Item>

            {patient.phone && (
              <Menu.Item
                leftSection={<IconPhone size='1rem' />}
                component='a'
                href={`tel:${patient.phone}`}
              >
                {t('patients.call')}
              </Menu.Item>
            )}

            {patient.email && (
              <Menu.Item
                leftSection={<IconMail size='1rem' />}
                component='a'
                href={`mailto:${patient.email}`}
              >
                {t('patients.sendEmail')}
              </Menu.Item>
            )}

            <Menu.Divider />

            {patient.status === PATIENT_STATUS.ACTIVE ? (
              <Menu.Item
                leftSection={<IconArchive size='1rem' />}
                color={utilityColors.error}
                onClick={onArchive}
              >
                {t('patients.archive')}
              </Menu.Item>
            ) : (
              <Menu.Item
                leftSection={<IconRestore size='1rem' />}
                color={utilityColors.success}
                onClick={onRestore}
              >
                {t('patients.restore')}
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Stack>
  );
}
