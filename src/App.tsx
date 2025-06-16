import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { createAppTheme } from './theme';
import { useSettingsStore } from './stores/useSettingsStore';
import { AppRouter } from './components/AppRouter';

function App() {
  const { colorPalette, darkMode } = useSettingsStore();
  const theme = createAppTheme(colorPalette);

  return (
    <>
      <ColorSchemeScript defaultColorScheme={darkMode ? "dark" : "light"} />
      <style>{`
        body {
          background-color: #100b00 !important;
          color: #f5f4f0 !important;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        /* MOBILE FIXES - Core responsive improvements */
        @media (max-width: 768px) {
          /* Better spacing and centering on mobile */
          .mantine-AppShell-main {
            padding: 1rem !important;
            max-width: 100vw !important;
            margin: 0 auto !important;
          }
          
          /* Smaller text sizes on mobile */
          .mantine-Title-root[data-order="1"] {
            font-size: 1.5rem !important;
            text-align: center !important;
            margin-bottom: 1rem !important;
          }
          
          .mantine-Title-root[data-order="3"] {
            font-size: 1.2rem !important;
          }
          
          /* Better spacing on mobile */
          .mantine-Stack-root {
            gap: 1rem !important;
          }
          
          .mantine-Grid-root {
            margin: 0 !important;
          }
          
          .mantine-Grid-col {
            padding: 0.5rem !important;
          }
          
          /* Card improvements with more padding */
          .mantine-Card-root {
            padding: 1rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          /* Group spacing fixes */
          .mantine-Group-root {
            gap: 0.75rem !important;
          }
          
          /* Button improvements - larger touch targets */
          .mantine-Button-root {
            height: 2.5rem !important;
            padding: 0 1rem !important;
            font-size: 0.9rem !important;
            min-width: 120px !important;
          }
          
          .mantine-Button-section {
            margin: 0 0.5rem !important;
          }
          
          /* Table responsive fixes */
          .mantine-Table-root {
            font-size: 0.8rem !important;
          }
          
          .mantine-Table-td, .mantine-Table-th {
            padding: 0.75rem 0.5rem !important;
          }
          
          /* ActionIcon bigger for touch */
          .mantine-ActionIcon-root {
            width: 2rem !important;
            height: 2rem !important;
          }
          
          /* Badge improvements */
          .mantine-Badge-root {
            height: 1.5rem !important;
            padding: 0 0.5rem !important;
            font-size: 0.75rem !important;
          }
          
          /* Header improvements */
          .mantine-AppShell-header .mantine-Group-root {
            padding: 0 1rem !important;
          }
          
          /* Navbar improvements */
          .mantine-AppShell-navbar {
            padding: 1rem !important;
          }
          
          .mantine-NavLink-root {
            padding: 0.75rem 1rem !important;
            margin-bottom: 0.5rem !important;
            border-radius: 0.5rem !important;
          }
          
          /* Text input improvements */
          .mantine-TextInput-root, .mantine-Select-root, .mantine-NumberInput-root {
            margin-bottom: 1rem !important;
          }
          
          .mantine-TextInput-input, .mantine-Select-input, .mantine-NumberInput-input {
            height: 2.5rem !important;
            font-size: 0.9rem !important;
            padding: 0 0.75rem !important;
          }
          
          /* Alert improvements */
          .mantine-Alert-root {
            padding: 1rem !important;
            margin: 0.75rem 0 !important;
          }
          
          .mantine-Alert-title {
            font-size: 0.9rem !important;
          }
          
          .mantine-Alert-message {
            font-size: 0.85rem !important;
          }
          
          /* Center content better */
          .mantine-Container-root {
            padding: 0 1rem !important;
          }
          
          /* Better button groups on mobile */
          .mantine-Group-root[data-justify="space-between"] {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .mantine-Group-root[data-justify="space-between"] > * {
            width: 100% !important;
            justify-content: center !important;
          }
          
          /* Mobile card specific improvements */
          .mobile-patient-card {
            padding: 1.25rem !important;
            border-radius: 0.75rem !important;
          }
        }
        
        /* EXTRA SMALL MOBILE (iPhone SE, etc.) */
        @media (max-width: 480px) {
          .mantine-Title-root[data-order="1"] {
            font-size: 1.25rem !important;
          }
          
          .mantine-AppShell-main {
            padding: 0.75rem !important;
          }
          
          .mantine-Card-root {
            padding: 0.75rem !important;
          }
          
          .mantine-Grid-col {
            padding: 0.25rem !important;
          }
          
          .mantine-Button-root {
            height: 2.25rem !important;
            padding: 0 0.75rem !important;
            font-size: 0.85rem !important;
            min-width: 100px !important;
          }
          
          /* Stack full-width buttons on very small screens */
          .mantine-Group-root .mantine-Button-root {
            width: 100% !important;
          }
        }
        
        /* FIX: Naprawka dla Mantine overlay które blokują klikanie */
        .mantine-Modal-root:not([data-opened="true"]) {
          pointer-events: none !important;
        }
        
        .mantine-Notifications-root {
          pointer-events: none !important;
        }
        
        .mantine-Notification-root {
          pointer-events: auto !important;
        }
        
        /* Poprawka dla modalów - zapobiega wyjeżdżaniu za ekran */
        .mantine-Modal-root {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 1000 !important;
        }
        
        .mantine-Modal-root[data-opened="true"] {
          pointer-events: auto !important;
        }
        
        .mantine-Modal-inner {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 1rem !important;
          min-height: 100vh !important;
          width: 100vw !important;
          max-width: 100vw !important;
          overflow-x: hidden !important;
        }
        
        .mantine-Modal-content {
          max-width: min(90vw, 700px) !important;
          max-height: 90vh !important;
          width: auto !important;
          margin: 0 !important;
          position: relative !important;
          overflow: hidden !important;
        }
        
        .mantine-Modal-body {
          max-height: calc(90vh - 120px) !important;
          overflow-y: auto !important;
        }
        
        /* Zabezpieczenie przed overlayami blokującymi kliknięcia */
        [data-mantine-color-scheme] {
          pointer-events: auto !important;
        }
        
        /* Zapewnienie że przyciski zawsze są klikalne */
        button, [role="button"], a {
          pointer-events: auto !important;
        }
        
        /* Responsywne poprawki dla małych ekranów */
        @media (max-width: 768px) {
          .mantine-Modal-inner {
            padding: 0.75rem !important;
          }
          
          .mantine-Modal-content {
            max-width: 95vw !important;
          }
          
          /* Mobile modal improvements */
          .mantine-Modal-body {
            max-height: calc(100vh - 160px) !important;
            padding: 1rem !important;
          }
          
          .mantine-Modal-header {
            padding: 1rem !important;
          }
          
          .mantine-Modal-title {
            font-size: 1.1rem !important;
          }
        }
        
        /* Floating Action Button */
        .floating-action-button {
          z-index: 900 !important;
        }
        
        @media (max-width: 768px) {
          /* FAB adjustments for mobile */
          .mantine-Affix-root {
            z-index: 900 !important;
          }
          
          /* Better FAB shadow on mobile */
          .floating-action-button .mantine-ActionIcon-root {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
          }
          
          /* FAB menu paper improvements */
          .floating-action-button .mantine-Paper-root {
            backdrop-filter: blur(8px) !important;
            background: rgba(16, 11, 0, 0.9) !important;
          }
        }
      `}</style>
      <MantineProvider 
        theme={theme} 
        defaultColorScheme={darkMode ? "dark" : "light"}
      >
        <ModalsProvider>
          <Notifications />
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
