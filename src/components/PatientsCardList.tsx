import {
  Stack,
  Text,
  Avatar,
  Group,
  Badge,
  ActionIcon,
  Menu,
  Loader,
} from '@mantine/core';
import {
  IconDots,
  IconEdit,
  IconArchive,
  IconRestore,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PATIENT_STATUS, PATIENT_STATUS_LABELS } from '../constants/status';
import { useTheme } from '../hooks/useTheme';
import { getPatientDisplayName } from '../utils/dates';
import type { PatientWithAppointments, Patient } from '../types/Patient';

const PAGE_SIZE = 20;

function getInitials(patient: Patient): string {
  const first = patient.firstName?.charAt(0) ?? '';
  const last = patient.lastName?.charAt(0) ?? '';
  return (first + last).toUpperCase() || '?';
}

interface PatientsCardListProps {
  patients: PatientWithAppointments[];
  onEdit: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onArchive: (id: number) => void;
  onRestore: (id: number) => void;
}

export function PatientsCardList({
  patients,
  onEdit,
  onView,
  onArchive,
  onRestore,
}: PatientsCardListProps) {
  const { t } = useTranslation();
  const { currentPalette, utilityColors } = useTheme();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset visible count when patients list changes (e.g. search)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [patients]);

  // Infinite scroll with IntersectionObserver
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && visibleCount < patients.length) {
        setVisibleCount(prev => Math.min(prev + PAGE_SIZE, patients.length));
      }
    },
    [visibleCount, patients.length]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '200px',
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [observerCallback]);

  if (patients.length === 0) {
    return (
      <Text ta='center' c='dimmed' py='xl'>
        {t('patients.noPatients')}
      </Text>
    );
  }

  const visiblePatients = patients.slice(0, visibleCount);
  const hasMore = visibleCount < patients.length;

  return (
    <Stack gap={8} hiddenFrom='md'>
      {visiblePatients.map(patient => {
        const isArchived = patient.status === PATIENT_STATUS.ARCHIVED;
        const statusColor =
          patient.status === PATIENT_STATUS.ACTIVE
            ? utilityColors.success
            : 'gray';

        const lastVisitLabel = patient.lastAppointment
          ? `${t('patients.lastVisit')}: ${format(
              typeof patient.lastAppointment === 'string'
                ? new Date(patient.lastAppointment)
                : patient.lastAppointment,
              'd MMM',
              { locale: pl }
            )}`
          : null;

        return (
          <div
            key={patient.id}
            onClick={() => onView(patient)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 14px',
              cursor: 'pointer',
              opacity: isArchived ? 0.6 : 1,
              borderRadius: 14,
              backgroundColor: `${currentPalette.text}05`,
              border: `1px solid ${currentPalette.text}08`,
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = `${currentPalette.primary}10`;
              e.currentTarget.style.borderColor = `${currentPalette.primary}20`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = `${currentPalette.text}05`;
              e.currentTarget.style.borderColor = `${currentPalette.text}08`;
            }}
          >
            <Avatar
              size={46}
              radius='xl'
              style={{
                backgroundColor: `${currentPalette.primary}15`,
                color: currentPalette.primary,
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
                border: `2px solid ${currentPalette.primary}20`,
              }}
            >
              {getInitials(patient)}
            </Avatar>

            <div style={{ flex: 1, minWidth: 0 }}>
              <Text
                fw={600}
                size='sm'
                lineClamp={1}
                style={{ color: currentPalette.text }}
              >
                {getPatientDisplayName(patient)}
              </Text>
              {lastVisitLabel && (
                <Text
                  size='xs'
                  mt={2}
                  style={{ color: `${currentPalette.text}50` }}
                >
                  {lastVisitLabel}
                </Text>
              )}
              <Group gap={6} mt={4}>
                <Badge
                  size='xs'
                  color={statusColor}
                  variant='light'
                  styles={{
                    root: { textTransform: 'capitalize', fontWeight: 600 },
                  }}
                >
                  {PATIENT_STATUS_LABELS[patient.status]}
                </Badge>
                {patient.tags?.slice(0, 2).map(tag => (
                  <Badge
                    key={tag}
                    size='xs'
                    variant='dot'
                    style={{
                      color: `${currentPalette.text}70`,
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
            </div>

            <Menu shadow='md' width={180}>
              <Menu.Target>
                <ActionIcon
                  variant='subtle'
                  size='sm'
                  onClick={e => e.stopPropagation()}
                  style={{ color: `${currentPalette.text}40`, flexShrink: 0 }}
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size='1rem' />}
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(patient);
                  }}
                >
                  {t('common.edit')}
                </Menu.Item>

                {patient.status === PATIENT_STATUS.ACTIVE ? (
                  <Menu.Item
                    leftSection={<IconArchive size='1rem' />}
                    color={utilityColors.error}
                    onClick={e => {
                      e.stopPropagation();
                      if (patient.id) onArchive(patient.id);
                    }}
                  >
                    {t('patients.archive')}
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    leftSection={<IconRestore size='1rem' />}
                    color={utilityColors.success}
                    onClick={e => {
                      e.stopPropagation();
                      if (patient.id) onRestore(patient.id);
                    }}
                  >
                    {t('patients.restore')}
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </div>
        );
      })}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {hasMore && (
        <Group justify='center' py='sm'>
          <Loader size='sm' color={currentPalette.primary} />
        </Group>
      )}
    </Stack>
  );
}
