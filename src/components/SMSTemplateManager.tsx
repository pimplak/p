import {
  Stack,
  Group,
  Text,
  Button,
  Card,
  Badge,
  ActionIcon,
  TextInput,
  Textarea,
  Divider,
  Alert,
  Code,
  Collapse,
  Anchor,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../stores/useSettingsStore';
import { DEFAULT_SMS_TEMPLATES, type SMSTemplate } from '../utils/sms';
import { BottomSheet } from './ui/BottomSheet';

// Available variables for SMS templates
const availableVariables = [
  'patientName',
  'patientFirstName',
  'date',
  'time',
  'practitionerName',
  'practitionerTitle',
  'appointmentType',
  'duration',
];

interface SMSTemplateFormData {
  name: string;
  content: string;
  description: string;
}

export function SMSTemplateManager() {
  const { t } = useTranslation();
  const {
    smsTemplates,
    addSMSTemplate,
    updateSMSTemplate,
    deleteSMSTemplate,
    resetSMSTemplates,
  } = useSettingsStore();
  const { currentPalette, utilityColors } = useTheme();

  const [opened, { open, close }] = useDisclosure(false);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(
    null
  );
  const [previewOpened, { toggle: togglePreview }] = useDisclosure(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<SMSTemplateFormData>({
    name: '',
    content: '',
    description: '',
  });

  const handleOpenModal = (template?: SMSTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        content: template.content,
        description: template.description,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        content: '',
        description: '',
      });
    }
    open();
  };

  const handleCloseModal = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      content: '',
      description: '',
    });
    close();
  };

  const handleSaveTemplate = () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      notifications.show({
        title: t('common.error'),
        message: t('settings.smsTemplates.nameAndContentRequired'),
        color: 'red',
      });
      return;
    }

    // Detect variables in content
    const variables = availableVariables.filter(variable =>
      formData.content.includes(`{${variable}}`)
    );

    const templateData: Omit<SMSTemplate, 'id'> = {
      name: formData.name.trim(),
      content: formData.content.trim(),
      description: formData.description.trim(),
      variables,
    };

    if (editingTemplate) {
      updateSMSTemplate(editingTemplate.id, templateData);
      notifications.show({
        title: t('common.success'),
        message: t('settings.smsTemplates.templateUpdated'),
        color: 'green',
      });
    } else {
      addSMSTemplate(templateData);
      notifications.show({
        title: t('common.success'),
        message: t('settings.smsTemplates.templateAdded'),
        color: 'green',
      });
    }

    handleCloseModal();
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = smsTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Prevent deletion of default templates
    const isDefaultTemplate = DEFAULT_SMS_TEMPLATES.some(
      dt => dt.id === templateId
    );
    if (isDefaultTemplate) {
      notifications.show({
        title: t('common.info'),
        message: t('settings.smsTemplates.cannotDeleteDefault'),
        color: 'yellow',
      });
      return;
    }

    deleteSMSTemplate(templateId);
    notifications.show({
      title: t('common.success'),
      message: t('settings.smsTemplates.templateDeleted'),
      color: 'green',
    });
  };

  const handleResetTemplates = () => {
    resetSMSTemplates();
    notifications.show({
      title: t('common.success'),
      message: t('settings.smsTemplates.templatesReset'),
      color: 'green',
    });
  };

  const insertVariable = useCallback((variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = formData.content;

    const newValue =
      currentValue.substring(0, start) +
      `{${variable}}` +
      currentValue.substring(end);

    setFormData(prev => ({
      ...prev,
      content: newValue,
    }));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + `{${variable}}`.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [formData.content]);

  return (
    <Stack gap='md'>
      {/* Header and actions */}
      <Group justify='space-between' align='center'>
        <Text fw={600} size='md'>
          {t('settings.sms.templates.title')}
        </Text>
        <Group gap='xs'>
          <Button
            leftSection={<IconPlus size={16} />}
            variant='light'
            size='sm'
            onClick={() => handleOpenModal()}
          >
            {t('settings.smsTemplates.addTemplate')}
          </Button>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant='light'
            color={utilityColors.warning}
            size='sm'
            onClick={handleResetTemplates}
          >
            {t('settings.smsTemplates.reset')}
          </Button>
        </Group>
      </Group>

      {/* Info about variables */}
      <Alert
        icon={<IconInfoCircle size={16} />}
        color={currentPalette.primary}
        variant='light'
      >
        <Group justify='space-between' align='center'>
          <Text size='sm'>
            {t('settings.smsTemplates.variablesInfo')}
          </Text>
          <Anchor size='sm' onClick={togglePreview}>
            {previewOpened ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            {previewOpened ? ` ${t('settings.smsTemplates.hideVariables')}` : ` ${t('settings.smsTemplates.showVariables')}`}
          </Anchor>
        </Group>
        <Collapse in={previewOpened}>
          <Stack gap='xs' mt='sm'>
            <Text size='xs' fw={600}>
              {t('settings.smsTemplates.availableVariables')}:
            </Text>
            <Group gap='xs'>
              {availableVariables.map(variable => (
                <Code key={variable}>{`{${variable}}`}</Code>
              ))}
            </Group>
          </Stack>
        </Collapse>
      </Alert>

      {/* Templates list */}
      <Stack gap='sm'>
        {smsTemplates.map(template => {
          const isDefault = DEFAULT_SMS_TEMPLATES.some(
            dt => dt.id === template.id
          );

          return (
            <Card key={template.id} padding='md' radius='md' withBorder>
              <Stack gap='xs'>
                <Group justify='space-between' align='flex-start'>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap='xs' align='center'>
                      <Text fw={600} size='sm'>
                        {template.name}
                      </Text>
                      {isDefault && (
                        <Badge
                          size='xs'
                          variant='light'
                          color={currentPalette.primary}
                        >
                          {t('settings.smsTemplates.default')}
                        </Badge>
                      )}
                    </Group>
                    {template.description && (
                      <Text size='xs' c='dimmed'>
                        {template.description}
                      </Text>
                    )}
                  </Stack>
                  <Group gap='xs'>
                    <ActionIcon
                      variant='light'
                      color={currentPalette.primary}
                      size='sm'
                      onClick={() => handleOpenModal(template)}
                    >
                      <IconEdit size={14} />
                    </ActionIcon>
                    {!isDefault && (
                      <ActionIcon
                        variant='light'
                        color={utilityColors.error}
                        size='sm'
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    )}
                  </Group>
                </Group>

                <Text
                  size='xs'
                  style={{
                    fontFamily: 'monospace',
                    backgroundColor: currentPalette.surface,
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${currentPalette.primary}`,
                    color: currentPalette.text,
                  }}
                >
                  {template.content}
                </Text>

                {template.variables.length > 0 && (
                  <Group gap='xs'>
                    <Text size='xs' c='dimmed'>
                      {t('settings.smsTemplates.variables')}:
                    </Text>
                    {template.variables.map(variable => (
                      <Code key={variable}>{`{${variable}}`}</Code>
                    ))}
                  </Group>
                )}
              </Stack>
            </Card>
          );
        })}
      </Stack>

      {/* Template form bottom sheet */}
      <BottomSheet
        opened={opened}
        onClose={handleCloseModal}
        title={editingTemplate ? t('settings.smsTemplates.editTemplate') : t('settings.smsTemplates.newTemplate')}
      >
        <Stack gap='md'>
          <TextInput
            label={t('settings.smsTemplates.templateName')}
            placeholder={t('settings.smsTemplates.templateNamePlaceholder')}
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <TextInput
            label={t('settings.smsTemplates.descriptionOptional')}
            placeholder={t('settings.smsTemplates.descriptionPlaceholder')}
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
          />

          <Stack gap='xs'>
            <Text size='sm' fw={500}>
              {t('settings.smsTemplates.messageContent')}
            </Text>
            <Textarea
              placeholder={t('settings.smsTemplates.messagePlaceholder')}
              value={formData.content}
              onChange={e =>
                setFormData(prev => ({ ...prev, content: e.target.value }))
              }
              minRows={4}
              maxRows={8}
              required
              ref={textareaRef}
            />
            <Text size='xs' c='dimmed'>
              {t('settings.smsTemplates.maxLength')}
            </Text>
            <Text size='xs' c='dimmed'>
              {t('settings.smsTemplates.currentLength', { length: formData.content.length })}
            </Text>
          </Stack>

          <Divider
            label={t('settings.smsTemplates.quickInsert')}
            labelPosition='center'
          />

          <Group gap='xs'>
            {availableVariables.map(variable => (
              <Button
                key={variable}
                variant='light'
                size='xs'
                onClick={() => insertVariable(variable)}
              >
                {`{${variable}}`}
              </Button>
            ))}
          </Group>

          <Group justify='flex-end' gap='sm' mt='lg'>
            <Button variant='light' onClick={handleCloseModal}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? t('common.save') : t('settings.smsTemplates.addTemplate')}
            </Button>
          </Group>
        </Stack>
      </BottomSheet>
    </Stack>
  );
}
