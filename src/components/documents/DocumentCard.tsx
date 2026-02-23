import {
  Card,
  Group,
  Text,
  Badge,
  ActionIcon,
  Stack,
  Anchor,
  Tooltip,
} from '@mantine/core';
import {
  IconFile,
  IconFileText,
  IconLink,
  IconPin,
  IconPinFilled,
  IconDownload,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { DocumentType } from '../../constants/status';
import type { Document, DocumentKind } from '../../types/Patient';

interface DocumentCardProps {
  document: Document;
  onEdit: (doc: Document) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getKindIcon(kind: DocumentKind) {
  switch (kind) {
    case 'file':
      return <IconFile size='1rem' />;
    case 'link':
      return <IconLink size='1rem' />;
    case 'text':
    default:
      return <IconFileText size='1rem' />;
  }
}

export function DocumentCard({ document, onEdit, onDelete, onTogglePin }: DocumentCardProps) {
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!document.fileData || !document.fileName) return;
    const a = window.document.createElement('a');
    a.href = document.fileData;
    a.download = document.fileName;
    a.click();
  };

  const typeLabel = t(`documents.types.${document.type as DocumentType}`, { defaultValue: document.type });

  return (
    <Card withBorder p='sm' radius='md'>
      <Group justify='space-between' align='flex-start' wrap='nowrap'>
        <Group align='flex-start' gap='sm' style={{ flex: 1, minWidth: 0 }}>
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            {getKindIcon(document.kind)}
          </div>
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Group gap='xs' wrap='nowrap'>
              <Text fw={500} size='sm' lineClamp={1} style={{ flex: 1 }}>
                {document.title}
              </Text>
              {document.pinned && (
                <IconPinFilled size='0.75rem' style={{ flexShrink: 0 }} />
              )}
            </Group>

            <Badge size='xs' variant='light' radius='sm' w='fit-content'>
              {typeLabel}
            </Badge>

            {document.description && (
              <Text size='xs' c='dimmed' lineClamp={2}>
                {document.description}
              </Text>
            )}

            {/* File-specific info */}
            {document.kind === 'file' && document.fileName && (
              <Text size='xs' c='dimmed'>
                {document.fileName}
                {document.fileSizeBytes !== undefined && ` · ${formatFileSize(document.fileSizeBytes)}`}
              </Text>
            )}

            {/* Link */}
            {document.kind === 'link' && document.content && (
              <Anchor
                href={document.content}
                target='_blank'
                rel='noopener noreferrer'
                size='xs'
                lineClamp={1}
                onClick={e => e.stopPropagation()}
              >
                {document.content}
              </Anchor>
            )}

            {/* Text preview */}
            {document.kind === 'text' && document.content && (
              <Text size='xs' c='dimmed' lineClamp={2}>
                {document.content}
              </Text>
            )}
          </Stack>
        </Group>

        <Group gap={4} wrap='nowrap' style={{ flexShrink: 0 }}>
          {document.kind === 'file' && document.fileData && (
            <Tooltip label={t('documents.download')}>
              <ActionIcon variant='subtle' size='sm' onClick={handleDownload} aria-label={t('documents.download')}>
                <IconDownload size='1rem' />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label={document.pinned ? t('documents.unpin') : t('documents.pin')}>
            <ActionIcon
              variant='subtle'
              size='sm'
              onClick={() => onTogglePin(document.id!)}
              aria-label={document.pinned ? t('documents.unpin') : t('documents.pin')}
            >
              {document.pinned ? <IconPinFilled size='1rem' /> : <IconPin size='1rem' />}
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('common.edit')}>
            <ActionIcon variant='subtle' size='sm' onClick={() => onEdit(document)} aria-label={t('common.edit')}>
              <IconEdit size='1rem' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('common.delete')}>
            <ActionIcon variant='subtle' size='sm' color='red' onClick={() => onDelete(document.id!)} aria-label={t('common.delete')}>
              <IconTrash size='1rem' />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Card>
  );
}
