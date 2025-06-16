import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AppRouter } from './components/AppRouter';

// CSS Global Styles - Ferro's theme-aware mobile-optimized styles
const globalStyles = `
  /* Base styles using CSS variables */
  body {
    background-color: var(--color-background) !important;
    color: var(--color-text) !important;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    margin: 0;
    padding: 0;
  }
  
  /* FERRO'S AGGRESSIVE TEXT COLOR OVERRIDES */
  /* All text elements use theme text color */
  .mantine-Text-root,
  .mantine-Title-root,
  .mantine-List-root,
  .mantine-Code-root,
  .mantine-Badge-root,
  .mantine-Alert-root,
  p, h1, h2, h3, h4, h5, h6, span, div, li, td, th {
    color: var(--color-text) !important;
  }
  
  /* Input text colors */
  .mantine-TextInput-input,
  .mantine-Select-input,
  .mantine-NumberInput-input,
  .mantine-Textarea-input,
  .mantine-PasswordInput-input {
    color: var(--color-text) !important;
    background-color: var(--color-surface) !important;
  }
  
  /* Theme-aware component overrides */
  .mantine-AppShell-main {
    background-color: var(--color-background) !important;
  }
  
  .mantine-AppShell-header {
    background-color: var(--color-surface) !important;
    border-color: var(--color-primary) !important;
  }
  
  .mantine-AppShell-navbar {
    background-color: var(--color-surface) !important;
    border-color: var(--color-primary) !important;
  }
  
  .mantine-NavLink-root {
    color: var(--color-text) !important;
  }
  
  .mantine-NavLink-root[data-active] {
    background-color: var(--color-primary) !important;
    color: var(--color-surface) !important;
  }
  
  .mantine-NavLink-root:hover {
    background-color: color-mix(in srgb, var(--color-accent) 20%, transparent) !important;
  }
  
  .mantine-Card-root {
    background-color: var(--color-surface) !important;
    border-color: var(--color-primary) !important;
  }
  
  .mantine-Button-root {
    background-color: var(--color-primary) !important;
    color: var(--color-surface) !important;
  }
  
  .mantine-Button-root:hover {
    background-color: var(--color-accent) !important;
  }
  
  /* Special overrides for dimmed text */
  .mantine-Text-root[data-c="dimmed"],
  [data-c="dimmed"] {
    color: color-mix(in srgb, var(--color-text) 60%, transparent) !important;
  }
  
  /* Table text colors */
  .mantine-Table-root,
  .mantine-Table-th,
  .mantine-Table-td {
    color: var(--color-text) !important;
  }
  
  /* Menu and dropdown text colors */
  .mantine-Menu-item,
  .mantine-Select-item,
  .mantine-Combobox-option {
    color: var(--color-text) !important;
  }
  
  /* Modal and overlay text */
  .mantine-Modal-content,
  .mantine-Modal-header,
  .mantine-Modal-body {
    background-color: var(--color-surface) !important;
    color: var(--color-text) !important;
  }
  
  /* MOBILE OPTIMIZATIONS - Ferro's responsive system */
  @media (max-width: 768px) {
    .mantine-AppShell-main {
      padding: 1rem !important;
      max-width: 100vw !important;
      margin: 0 auto !important;
    }
    
    .mantine-Title-root[data-order="1"] {
      font-size: 1.5rem !important;
      text-align: center !important;
      margin-bottom: 1rem !important;
    }
    
    .mantine-Title-root[data-order="3"] {
      font-size: 1.2rem !important;
    }
    
    .mantine-Stack-root {
      gap: 1rem !important;
    }
    
    .mantine-Grid-root {
      margin: 0 !important;
    }
    
    .mantine-Grid-col {
      padding: 0.5rem !important;
    }
    
    .mantine-Card-root {
      padding: 1rem !important;
      margin-bottom: 0.75rem !important;
    }
    
    .mantine-Group-root {
      gap: 0.75rem !important;
    }
    
    .mantine-Button-root {
      height: 2.5rem !important;
      padding: 0 1rem !important;
      font-size: 0.9rem !important;
      min-width: 120px !important;
    }
    
    .mantine-Table-root {
      font-size: 0.8rem !important;
    }
    
    .mantine-Table-td, .mantine-Table-th {
      padding: 0.75rem 0.5rem !important;
    }
    
    .mantine-ActionIcon-root {
      width: 2rem !important;
      height: 2rem !important;
    }
    
    .mantine-Badge-root {
      height: 1.5rem !important;
      padding: 0 0.5rem !important;
      font-size: 0.75rem !important;
    }
    
    .mantine-AppShell-header .mantine-Group-root {
      padding: 0 1rem !important;
    }
    
    .mantine-AppShell-navbar {
      padding: 1rem !important;
    }
    
    .mantine-NavLink-root {
      padding: 0.75rem 1rem !important;
      margin-bottom: 0.5rem !important;
      border-radius: 0.5rem !important;
    }
    
    .mantine-TextInput-root, .mantine-Select-root, .mantine-NumberInput-root {
      margin-bottom: 1rem !important;
    }
    
    .mantine-TextInput-input, .mantine-Select-input, .mantine-NumberInput-input {
      height: 2.5rem !important;
      font-size: 0.9rem !important;
      padding: 0 0.75rem !important;
    }
    
    .mantine-Alert-root {
      padding: 1rem !important;
      margin: 0.75rem 0 !important;
    }
    
    .mantine-Container-root {
      padding: 0 1rem !important;
    }
    
    .mantine-Group-root[data-justify="space-between"] {
      flex-direction: column !important;
      align-items: center !important;
      gap: 0.75rem !important;
    }
    
    .mantine-Group-root[data-justify="space-between"] > * {
      width: 100% !important;
      justify-content: center !important;
    }
  }
  
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
    
    .mantine-Button-root {
      height: 2.25rem !important;
      padding: 0 0.75rem !important;
      font-size: 0.85rem !important;
      min-width: 100px !important;
    }
    
    .mantine-Group-root .mantine-Button-root {
      width: 100% !important;
    }
  }
`;

function App() {
  const { mantineTheme } = useTheme();

  return (
    <>
      <style>{globalStyles}</style>
      <MantineProvider theme={mantineTheme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
