import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme';
import { AppRouter } from './components/AppRouter';

function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <style>{`
        body {
          background-color: #100b00 !important;
          color: #f5f4f0 !important;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
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
            padding: 0.5rem !important;
          }
          
          .mantine-Modal-content {
            max-width: 95vw !important;
          }
        }
      `}</style>
      <MantineProvider theme={theme} defaultColorScheme="dark">
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
