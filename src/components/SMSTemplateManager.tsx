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
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../stores/useSettingsStore';
import { DEFAULT_SMS_TEMPLATES, type SMSTemplate } from '../utils/sms';
import { BottomSheet } from './ui/BottomSheet';

// Available variables for SMS templates
const availableVariables = [
  'imię',
  'nazwisko',
  'data',
  'godzina',
  'terapeuta',
  'tytuł',
  'dzień',
  'miesiąc',
  'rok',
];

interface SMSTemplateFormData {
  name: string;
  content: string;
  description: string;
}

export function SMSTemplateManager() {
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
        title: 'Błąd',
        message: 'Nazwa i treść szablonu są wymagane',
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
        title: 'Sukces!',
        message: 'Szablon został zaktualizowany',
        color: 'green',
      });
    } else {
      addSMSTemplate(templateData);
      notifications.show({
        title: 'Sukces!',
        message: 'Nowy szablon został dodany',
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
        title: 'Informacja',
        message:
          'Domyślne szablony można zresetować, ale nie usuwać. Użyj przycisku "Resetuj".',
        color: 'yellow',
      });
      return;
    }

    deleteSMSTemplate(templateId);
    notifications.show({
      title: 'Sukces!',
      message: `Szablon "${template.name}" został usunięty`,
      color: 'green',
    });
  };

  const handleResetTemplates = () => {
    resetSMSTemplates();
    notifications.show({
      title: 'Sukces!',
      message: 'Szablony zostały zresetowane do wartości domyślnych',
      color: 'green',
    });
  };

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + `{${variable}}`,
    }));
  };

  return (
    <Stack gap='md'>
      {/* Header and actions */}
      <Group justify='space-between' align='center'>
        <Text fw={600} size='md'>
          Szablony wiadomości SMS
        </Text>
        <Group gap='xs'>
          <Button
            leftSection={<IconPlus size={16} />}
            variant='light'
            size='sm'
            onClick={() => handleOpenModal()}
          >
            Dodaj szablon
          </Button>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant='light'
            color={utilityColors.warning}
            size='sm'
            onClick={handleResetTemplates}
          >
            Resetuj
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
            W szablonach możesz używać zmiennych, które zostaną automatycznie
            zastąpione danymi pacjenta.
          </Text>
          <Anchor size='sm' onClick={togglePreview}>
            {previewOpened ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            {previewOpened ? ' Ukryj' : ' Pokaż'} zmienne
          </Anchor>
        </Group>
        <Collapse in={previewOpened}>
          <Stack gap='xs' mt='sm'>
            <Text size='xs' fw={600}>
              Dostępne zmienne:
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
                          Domyślny
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
                      Zmienne:
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
        title={editingTemplate ? 'Edytuj szablon' : 'Nowy szablon SMS'}
      >
        <Stack gap='md'>
          <TextInput
            label='Nazwa szablonu'
            placeholder='np. Przypomnienie o wizycie'
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <TextInput
            label='Opis (opcjonalnie)'
            placeholder='Krótki opis przeznaczenia szablonu'
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
          />

          <Stack gap='xs'>
            <Text size='sm' fw={500}>
              Treść wiadomości
            </Text>
            <Textarea
              placeholder='Treść wiadomości SMS...'
              value={formData.content}
              onChange={e =>
                setFormData(prev => ({ ...prev, content: e.target.value }))
              }
              minRows={4}
              maxRows={8}
              required
            />
            <Text size='xs' c='dimmed'>
              Maksymalnie 160 znaków dla pojedynczej wiadomości SMS
            </Text>
            <Text size='xs' c='dimmed'>
              Aktualna długość: {formData.content.length} znaków
            </Text>
          </Stack>

          <Divider
            label='Szybkie wstawianie zmiennych'
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
              Anuluj
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? 'Zapisz zmiany' : 'Dodaj szablon'}
            </Button>
          </Group>
        </Stack>
      </BottomSheet>
    </Stack>
  );
}
