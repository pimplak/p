import { create } from 'zustand';
import { DEFAULT_SMS_TEMPLATES, type SMSTemplate } from '../utils/sms';

export type ColorPalette = 'naturalne' | 'magenta-rose';

interface SettingsStore {
    colorPalette: ColorPalette;
    darkMode: boolean;

    // Calendar settings
    hideWeekends: boolean;

    // SMS settings
    practitionerName: string;
    practitionerTitle: string;
    smsTemplates: SMSTemplate[];

    // Actions
    setColorPalette: (palette: ColorPalette) => void;
    toggleDarkMode: () => void;
    toggleHideWeekends: () => void;

    // SMS actions
    setPractitionerName: (name: string) => void;
    setPractitionerTitle: (title: string) => void;
    addSMSTemplate: (template: Omit<SMSTemplate, 'id'>) => void;
    updateSMSTemplate: (templateId: string, template: Partial<SMSTemplate>) => void;
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
            hideWeekends: state.hideWeekends,
            practitionerName: state.practitionerName,
            practitionerTitle: state.practitionerTitle,
            smsTemplates: state.smsTemplates
        });
    };

    return {
        colorPalette: storedSettings.colorPalette || 'naturalne',
        darkMode: storedSettings.darkMode ?? true,
        hideWeekends: storedSettings.hideWeekends ?? false,

        // SMS settings
        practitionerName: storedSettings.practitionerName || 'Gabinet Psychologiczny',
        practitionerTitle: storedSettings.practitionerTitle || 'mgr',
        smsTemplates: storedSettings.smsTemplates || DEFAULT_SMS_TEMPLATES,

        setColorPalette: (palette) => {
            set({ colorPalette: palette });
            saveAllSettings();
        },

        toggleDarkMode: () => {
            set((state) => ({ darkMode: !state.darkMode }));
            saveAllSettings();
        },

        toggleHideWeekends: () => {
            set((state) => ({ hideWeekends: !state.hideWeekends }));
            saveAllSettings();
        },

        // SMS actions
        setPractitionerName: (name) => {
            set({ practitionerName: name });
            saveAllSettings();
        },

        setPractitionerTitle: (title) => {
            set({ practitionerTitle: title });
            saveAllSettings();
        },

        addSMSTemplate: (templateData) => {
            const newTemplate: SMSTemplate = {
                ...templateData,
                id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };

            set((state) => ({
                smsTemplates: [...state.smsTemplates, newTemplate]
            }));
            saveAllSettings();
        },

        updateSMSTemplate: (templateId, templateUpdate) => {
            set((state) => ({
                smsTemplates: state.smsTemplates.map(template =>
                    template.id === templateId
                        ? { ...template, ...templateUpdate }
                        : template
                )
            }));
            saveAllSettings();
        },

        deleteSMSTemplate: (templateId) => {
            set((state) => ({
                smsTemplates: state.smsTemplates.filter(template => template.id !== templateId)
            }));
            saveAllSettings();
        },

        resetSMSTemplates: () => {
            set({ smsTemplates: DEFAULT_SMS_TEMPLATES });
            saveAllSettings();
        },
    };
}); 