import {
  Stack,
  Text,
  TagsInput,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DEFAULT_APPOINTMENT_TYPES } from '../constants/defaults';
import { useSettingsStore } from '../stores/useSettingsStore';

export function AppointmentTypesManager() {
  const { t } = useTranslation();
  const {
    appointmentTypes,
    addAppointmentType,
    deleteAppointmentType,
  } = useSettingsStore();

  const handleTagsChange = (newTags: string[]) => {
    // Remove duplicates and empty strings
    const uniqueTags = [...new Set(newTags.filter(tag => tag.trim()))];

    // If duplicates were found, update the UI to reflect unique tags
    if (uniqueTags.length !== newTags.length) {
      // For now, just use unique tags. TagsInput should handle this automatically.
    }

    // Convert current tags to labels for comparison
    const currentLabels = appointmentTypes.map(type => type.label);

    // Find added tags
    const addedTags = uniqueTags.filter(tag => !currentLabels.includes(tag));
    addedTags.forEach(tag => {
      addAppointmentType({ label: tag.trim() });
    });

    // Find removed tags (but protect default types)
    const removedTags = currentLabels.filter(label => !uniqueTags.includes(label));
    removedTags.forEach(label => {
      const type = appointmentTypes.find(t => t.label === label);
      if (type) {
        const isDefaultType = DEFAULT_APPOINTMENT_TYPES.some(
          dt => dt.id === type.id
        );
        if (!isDefaultType) {
          deleteAppointmentType(type.id);
        } else {
          // Don't show notification for protected types, just prevent removal
        }
      }
    });
  };

  return (
    <Stack gap='md'>
      <TagsInput
        label={t('appointmentTypes.title')}
        placeholder={t('appointmentTypes.addType')}
        value={appointmentTypes.map(type => type.label)}
        onChange={handleTagsChange}
        description={t('appointmentTypes.description')}
        clearable
      />
      <Text size='xs' c='dimmed'>
        {t('appointmentTypes.hint')}
      </Text>
    </Stack>
  );
}