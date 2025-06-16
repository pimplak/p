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
