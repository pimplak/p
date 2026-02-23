import {
  Stack,
  Button,
  Group,
  SegmentedControl,
  Select,
  TextInput,
  Textarea,
  Switch,
  FileInput,
  Text,
  Alert,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPE } from '../../constants/status';
import { DocumentFormSchema } from '../../schemas';
import { useDocumentStore } from '../../stores/useDocumentStore';
import type { Document } from '../../types/Patient';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const WARN_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface DocumentFormProps {
  patientId: number;
  document?: Document | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DocumentForm({ patientId, document, onSuccess, onCancel }: DocumentFormProps) {
  const { t } = useTranslation();
  const { addDocument, updateDocument } = useDocumentStore();

  const form = useForm({
    validate: zodResolver(DocumentFormSchema),
    initialValues: {
      patientId,
      kind: (document?.kind ?? 'file') as 'file' | 'text' | 'link',
      type: document?.type ?? DOCUMENT_TYPE.OTHER,
      title: document?.title ?? '',
      description: document?.description ?? '',
      pinned: document?.pinned ?? false,
      fileData: document?.fileData ?? undefined,
      fileName: document?.fileName ?? undefined,
      fileMimeType: document?.fileMimeType ?? undefined,
      fileSizeBytes: document?.fileSizeBytes ?? undefined,
      content: document?.content ?? '',
    },
  });

  const kind = form.values.kind;
  const isFileTooLarge = (form.values.fileSizeBytes ?? 0) > MAX_FILE_SIZE;
  const isFileWarning = !isFileTooLarge && (form.values.fileSizeBytes ?? 0) > WARN_FILE_SIZE;

  const handleFileChange = (file: File | null) => {
    if (!file) {
      form.setFieldValue('fileData', undefined);
      form.setFieldValue('fileName', undefined);
      form.setFieldValue('fileMimeType', undefined);
      form.setFieldValue('fileSizeBytes', undefined);
      return;
    }

    form.setFieldValue('fileSizeBytes', file.size);
    form.setFieldValue('fileName', file.name);
    form.setFieldValue('fileMimeType', file.type);

    // Auto-fill title from filename if title is empty
    if (!form.values.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      form.setFieldValue('title', nameWithoutExt);
    }

    const reader = new FileReader();
    reader.onload = () => {
      form.setFieldValue('fileData', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (values.kind === 'file' && !document?.fileData && !values.fileData) {
      form.setFieldError('fileData', t('documentForm.fileRequired'));
      return;
    }
    if (values.kind === 'link' && !values.content) {
      form.setFieldError('content', t('documentForm.urlRequired'));
      return;
    }
    if (values.kind === 'text' && !values.content) {
      form.setFieldError('content', t('documentForm.contentRequired'));
      return;
    }
    if (isFileTooLarge) {
      return;
    }

    try {
      const payload = {
        patientId: values.patientId,
        kind: values.kind,
        type: values.type,
        title: values.title,
        description: values.description || undefined,
        pinned: values.pinned,
        fileData: values.kind === 'file' ? values.fileData : undefined,
        fileName: values.kind === 'file' ? values.fileName : undefined,
        fileMimeType: values.kind === 'file' ? values.fileMimeType : undefined,
        fileSizeBytes: values.kind === 'file' ? values.fileSizeBytes : undefined,
        content: values.kind !== 'file' ? values.content || undefined : undefined,
      };

      if (document?.id) {
        await updateDocument(document.id, payload);
        notifications.show({ message: t('documents.notifications.documentUpdated'), color: 'green' });
      } else {
        await addDocument(payload);
        notifications.show({ message: t('documents.notifications.documentAdded'), color: 'green' });
      }
      onSuccess();
    } catch {
      notifications.show({ message: t('documents.notifications.errorSaving'), color: 'red' });
    }
  };

  const typeOptions = Object.values(DOCUMENT_TYPE).map(type => ({
    value: type,
    label: t(`documents.types.${type}`),
  }));

  const kindOptions = [
    { label: t('documentForm.kinds.file'), value: 'file' },
    { label: t('documentForm.kinds.text'), value: 'text' },
    { label: t('documentForm.kinds.link'), value: 'link' },
  ];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap='md'>
        <div>
          <Text size='sm' fw={500} mb={4}>{t('documentForm.kind')}</Text>
          <SegmentedControl
            fullWidth
            data={kindOptions}
            value={kind}
            onChange={val => form.setFieldValue('kind', val as 'file' | 'text' | 'link')}
          />
        </div>

        <Select
          label={t('documentForm.type')}
          data={typeOptions}
          {...form.getInputProps('type')}
          required
        />

        <TextInput
          label={t('documentForm.title')}
          placeholder={t('documentForm.titlePlaceholder')}
          required
          {...form.getInputProps('title')}
        />

        <Textarea
          label={t('documentForm.description')}
          placeholder={t('documentForm.descriptionPlaceholder')}
          rows={2}
          {...form.getInputProps('description')}
        />

        {kind === 'file' && (
          <Stack gap='xs'>
            <FileInput
              label={t('documentForm.file')}
              placeholder={t('documentForm.filePlaceholder')}
              accept='.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp'
              onChange={handleFileChange}
              error={form.errors.fileData}
            />
            {document?.fileName && !form.values.fileData && (
              <Text size='xs' c='dimmed'>
                {t('documentForm.currentFile')}: {document.fileName}
              </Text>
            )}
            {isFileTooLarge && (
              <Alert color='red' icon={<IconAlertTriangle size='1rem' />} py='xs'>
                {t('documentForm.fileTooLarge')}
              </Alert>
            )}
            {isFileWarning && (
              <Alert color='yellow' icon={<IconAlertTriangle size='1rem' />} py='xs'>
                {t('documentForm.fileSizeWarning')}
              </Alert>
            )}
            <Text size='xs' c='dimmed'>{t('documentForm.storageNote')}</Text>
          </Stack>
        )}

        {kind === 'link' && (
          <TextInput
            label={t('documentForm.url')}
            placeholder={t('documentForm.urlPlaceholder')}
            type='url'
            required
            {...form.getInputProps('content')}
          />
        )}

        {kind === 'text' && (
          <Textarea
            label={t('documentForm.content')}
            placeholder={t('documentForm.contentPlaceholder')}
            rows={5}
            required
            {...form.getInputProps('content')}
          />
        )}

        <Switch
          label={t('notes.pinned')}
          description={t('documents.pinnedDescription')}
          {...form.getInputProps('pinned', { type: 'checkbox' })}
        />

        <Group justify='flex-end'>
          <Button variant='light' onClick={onCancel}>{t('common.cancel')}</Button>
          <Button type='submit' disabled={isFileTooLarge}>
            {document ? t('common.save') : t('common.add')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
