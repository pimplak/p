import { create } from 'zustand';
import { DEFAULT_APPOINTMENT_DURATION } from '../constants/business';
import { DEFAULT_APPOINTMENT_TYPES } from '../constants/defaults';
import { DEFAULT_SMS_TEMPLATES, type SMSTemplate } from '../utils/sms';
import type { AppointmentTypeConfig } from '../types/Appointment';

export type ColorPalette = 'naturalne' | 'magenta-rose';
export type Language = 'pl' | 'en';

interface SettingsStore {
  colorPalette: ColorPalette;
  darkMode: boolean;
  language: Language;

  // Calendar settings
  hideWeekends: boolean;
  appointmentHours: string[];
  defaultAppointmentDuration: number;
  appointmentTypes: AppointmentTypeConfig[];

  // SMS settings
  practitionerName: string;
  practitionerTitle: string;
  smsTemplates: SMSTemplate[];

  // Actions
  setColorPalette: (palette: ColorPalette) => void;
  toggleDarkMode: () => void;
  setLanguage: (language: Language) => void;
  toggleHideWeekends: () => void;
  setAppointmentHours: (hours: string[]) => void;
  setDefaultAppointmentDuration: (duration: number) => void;
  setAppointmentTypes: (types: AppointmentTypeConfig[]) => void;
  addAppointmentType: (type: Omit<AppointmentTypeConfig, 'id'>) => void;
  updateAppointmentType: (id: string, type: Partial<AppointmentTypeConfig>) => void;
  deleteAppointmentType: (id: string) => void;
  resetAppointmentTypes: () => void;

  // SMS actions
  setPractitionerName: (name: string) => void;
  setPractitionerTitle: (title: string) => void;
  addSMSTemplate: (template: Omit<SMSTemplate, 'id'>) => void;
  updateSMSTemplate: (
    templateId: string,
    template: Partial<SMSTemplate>
  ) => void;
  deleteSMSTemplate: (templateId: string) => void;
  resetSMSTemplates: () => void;
}

// Prosty localStorage helper
const STORAGE_KEY = 'p-settings';

const getStoredSettings = (): Partial<SettingsStore> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveSettings = (settings: Partial<SettingsStore>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore localStorage errors
  }
};

export const useSettingsStore = create<SettingsStore>((set, get) => {
  const storedSettings = getStoredSettings();

  // Helper function to save all settings
  const saveAllSettings = () => {
    const state = get();
    saveSettings({
      colorPalette: state.colorPalette,
      darkMode: state.darkMode,
      language: state.language,
      hideWeekends: state.hideWeekends,
      appointmentHours: state.appointmentHours,
      defaultAppointmentDuration: state.defaultAppointmentDuration,
      appointmentTypes: state.appointmentTypes,
      practitionerName: state.practitionerName,
      practitionerTitle: state.practitionerTitle,
      smsTemplates: state.smsTemplates,
    });
  };

  const generateDefaultHours = () => {
    const hours: string[] = [];
    let current = 14 * 60 + 15; // 14:15 in minutes
    const end = 21 * 60 + 30; // 21:30 in minutes
    const interval = 75; // 1h 15m in minutes

    while (current <= end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      hours.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      current += interval;
    }
    return hours;
  };

  return {
    colorPalette: storedSettings.colorPalette || 'naturalne',
    darkMode: storedSettings.darkMode ?? true,
    language: storedSettings.language || 'pl',
    hideWeekends: storedSettings.hideWeekends ?? false,
    appointmentHours: storedSettings.appointmentHours || generateDefaultHours(),
    defaultAppointmentDuration: storedSettings.defaultAppointmentDuration || DEFAULT_APPOINTMENT_DURATION,
    appointmentTypes: storedSettings.appointmentTypes || DEFAULT_APPOINTMENT_TYPES,

    // SMS settings
    practitionerName:
      storedSettings.practitionerName || 'Gabinet Psychologiczny',
    practitionerTitle: storedSettings.practitionerTitle || 'mgr',
    smsTemplates: storedSettings.smsTemplates || DEFAULT_SMS_TEMPLATES,

    setColorPalette: palette => {
      set({ colorPalette: palette });
      saveAllSettings();
    },

    toggleDarkMode: () => {
      set(state => ({ darkMode: !state.darkMode }));
      saveAllSettings();
    },

    setLanguage: language => {
      set({ language });
      // Save to separate localStorage key for i18n
      localStorage.setItem('p-language', language);
      saveAllSettings();
    },

    toggleHideWeekends: () => {
      set(state => ({ hideWeekends: !state.hideWeekends }));
      saveAllSettings();
    },

    setAppointmentHours: hours => {
      set({ appointmentHours: hours });
      saveAllSettings();
    },

    setDefaultAppointmentDuration: duration => {
      set({ defaultAppointmentDuration: duration });
      saveAllSettings();
    },

    setAppointmentTypes: types => {
      set({ appointmentTypes: types });
      saveAllSettings();
    },

    addAppointmentType: typeData => {
      const newType: AppointmentTypeConfig = {
        ...typeData,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      set(state => ({
        appointmentTypes: [...state.appointmentTypes, newType],
      }));
      saveAllSettings();
    },

    updateAppointmentType: (id, typeUpdate) => {
      set(state => ({
        appointmentTypes: state.appointmentTypes.map(type =>
          type.id === id
            ? { ...type, ...typeUpdate }
            : type
        ),
      }));
      saveAllSettings();
    },

    deleteAppointmentType: id => {
      set(state => ({
        appointmentTypes: state.appointmentTypes.filter(
          type => type.id !== id
        ),
      }));
      saveAllSettings();
    },

    resetAppointmentTypes: () => {
      set({ appointmentTypes: DEFAULT_APPOINTMENT_TYPES });
      saveAllSettings();
    },

    // SMS actions
    setPractitionerName: name => {
      set({ practitionerName: name });
      saveAllSettings();
    },

    setPractitionerTitle: title => {
      set({ practitionerTitle: title });
      saveAllSettings();
    },

    addSMSTemplate: templateData => {
      const newTemplate: SMSTemplate = {
        ...templateData,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      set(state => ({
        smsTemplates: [...state.smsTemplates, newTemplate],
      }));
      saveAllSettings();
    },

    updateSMSTemplate: (templateId, templateUpdate) => {
      set(state => ({
        smsTemplates: state.smsTemplates.map(template =>
          template.id === templateId
            ? { ...template, ...templateUpdate }
            : template
        ),
      }));
      saveAllSettings();
    },

    deleteSMSTemplate: templateId => {
      set(state => ({
        smsTemplates: state.smsTemplates.filter(
          template => template.id !== templateId
        ),
      }));
      saveAllSettings();
    },

    resetSMSTemplates: () => {
      set({ smsTemplates: DEFAULT_SMS_TEMPLATES });
      saveAllSettings();
    },
  };
});
