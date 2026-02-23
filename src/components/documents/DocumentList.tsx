import { Stack, Select, Text, Badge, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPE } from '../../constants/status';
import { DocumentCard } from './DocumentCard';
import type { DocumentType } from '../../constants/status';
import type { Document } from '../../types/Patient';

interface DocumentListProps {
  documents: Document[];
  filterType: DocumentType | null;
  onFilterChange: (type: DocumentType | null) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number) => void;
}

export function DocumentList({
  documents,
  filterType,
  onFilterChange,
  onEdit,
  onDelete,
  onTogglePin,
}: DocumentListProps) {
  const { t } = useTranslation();

  const typeOptions = [
    { value: '', label: t('common.all') },
    ...Object.values(DOCUMENT_TYPE).map(type => ({
      value: type,
      label: t(`documents.types.${type}`),
    })),
  ];

  const filtered = filterType
    ? documents.filter(d => d.type === filterType)
    : documents;

  return (
    <Stack gap='md'>
      <Group align='center' gap='sm'>
        <Select
          placeholder={t('documents.filterByType')}
          data={typeOptions}
          value={filterType ?? ''}
          onChange={val => onFilterChange((val || null) as DocumentType | null)}
          clearable
          size='sm'
          w={220}
        />
        {filterType && (
          <Badge variant='light' size='sm'>
            {filtered.length}
          </Badge>
        )}
      </Group>

      {filtered.length === 0 ? (
        <Text size='sm' c='dimmed'>
          {filterType
            ? t('documents.noDocumentsOfType')
            : t('documents.noDocuments')}
        </Text>
      ) : (
        <Stack gap='sm'>
          {filtered.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
