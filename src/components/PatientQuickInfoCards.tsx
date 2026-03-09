import { Text, Group, SimpleGrid } from '@mantine/core';
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconCake,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { formatDate, calculateAge } from '../utils/dates';
import type { Patient } from '../types/Patient';

interface PatientQuickInfoCardsProps {
  patient: Patient;
}

function InfoRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Group gap={10} wrap='nowrap' align='flex-start'>
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}12`,
          color: `${color}90`,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <Text
          size='xs'
          style={{
            color: `${color}50`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {label}
        </Text>
        <Text size='sm' style={{ color }} lineClamp={1}>
          {value}
        </Text>
      </div>
    </Group>
  );
}

export function PatientQuickInfoCards({ patient }: PatientQuickInfoCardsProps) {
  const { t } = useTranslation();
  const { currentPalette } = useTheme();

  const age = calculateAge(patient.birthDate);
  const textColor = currentPalette.text;

  return (
    <div
      style={{
        backgroundColor: `${currentPalette.text}04`,
        borderRadius: 12,
        padding: '16px',
        border: `1px solid ${currentPalette.text}08`,
      }}
    >
      <SimpleGrid cols={{ base: 2, md: 3 }} spacing='md'>
        {patient.birthDate && (
          <InfoRow
            icon={<IconCake size={14} />}
            label={t('patientQuickInfo.dateOfBirth')}
            value={`${formatDate(patient.birthDate)}${age ? ` (${age})` : ''}`}
            color={textColor}
          />
        )}

        {patient.phone && (
          <InfoRow
            icon={<IconPhone size={14} />}
            label={t('patientQuickInfo.phone')}
            value={patient.phone}
            color={textColor}
          />
        )}

        {patient.email && (
          <InfoRow
            icon={<IconMail size={14} />}
            label='Email'
            value={patient.email}
            color={textColor}
          />
        )}

        {patient.address && (
          <InfoRow
            icon={<IconMapPin size={14} />}
            label={t('patientQuickInfo.address')}
            value={patient.address}
            color={textColor}
          />
        )}

        {patient.emergencyContact && (
          <InfoRow
            icon={<IconAlertTriangle size={14} />}
            label={t('patientQuickInfo.emergencyContact')}
            value={`${patient.emergencyContact}${patient.emergencyPhone ? ` · ${patient.emergencyPhone}` : ''}`}
            color={textColor}
          />
        )}
      </SimpleGrid>
    </div>
  );
}
