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
    updateSMSTemplate: (templateId: string, template: Partial<SMSTemplate>) => void;
    resetSMSTemplates: () => void;
}

// Prosty localStorage helper
const STORAGE_KEY = 'psychflow-settings';

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
            const state = get();
            saveSettings({
                colorPalette: palette,
                darkMode: state.darkMode,
                hideWeekends: state.hideWeekends,
                practitionerName: state.practitionerName,
                practitionerTitle: state.practitionerTitle,
                smsTemplates: state.smsTemplates
            });
        },

        toggleDarkMode: () => {
            set((state) => ({ darkMode: !state.darkMode }));
            const state = get();
            saveSettings({
                colorPalette: state.colorPalette,
                darkMode: state.darkMode,
                hideWeekends: state.hideWeekends,
                practitionerName: state.practitionerName,
                practitionerTitle: state.practitionerTitle,
                smsTemplates: state.smsTemplates
            });
        },

        toggleHideWeekends: () => {
            set((state) => ({ hideWeekends: !state.hideWeekends }));
            const state = get();
            saveSettings({
                colorPalette: state.colorPalette,
                darkMode: state.darkMode,
                hideWeekends: state.hideWeekends,
                practitionerName: state.practitionerName,
                practitionerTitle: state.practitionerTitle,
                smsTemplates: state.smsTemplates
            });
        },

        // SMS actions
        setPractitionerName: (name) => {
            set({ practitionerName: name });
            const state = get();
            saveSettings({
                colorPalette: state.colorPalette,
                darkMode: state.darkMode,
                hideWeekends: state.hideWeekends,
                practitionerName: name,
                practitionerTitle: state.practitionerTitle,
                smsTemplates: state.smsTemplates
            });
        },

        setPractitionerTitle: (title) => {
            set({ practitionerTitle: title });
            const state = get();
            saveSettings({
                colorPalette: state.colorPalette,
                darkMode: state.darkMode,
                hideWeekends: state.hideWeekends,
                practitionerName: state.practitionerName,
                practitionerTitle: title,
                smsTemplates: state.smsTemplates
            });
        },

        updateSMSTemplate: (templateId, templateUpdate) => {
            set((state) => ({
                smsTemplates: state.smsTemplates.map(template =>
                    template.id === templateId
                        ? { ...template, ...templateUpdate }
                        : template
                )
            }));
            const state = get();
            saveSettings({
                colorPalette: state.colorPalette,
                darkMode: state.darkMode,
                hideWeekends: state.hideWeekends,
                practitionerName: state.practitionerName,
                practitionerTitle: state.practitionerTitle,
                smsTemplates: state.smsTemplates
            });
        },

        resetSMSTemplates: () => {
            set({ smsTemplates: DEFAULT_SMS_TEMPLATES });
            const state = get();
            saveSettings({
                colorPalette: state.colorPalette,
                darkMode: state.darkMode,
                hideWeekends: state.hideWeekends,
                practitionerName: state.practitionerName,
                practitionerTitle: state.practitionerTitle,
                smsTemplates: DEFAULT_SMS_TEMPLATES
            });
        },
    };
}); 