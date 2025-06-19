import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AppRouter } from './components/AppRouter';
import { globalStyles } from './theme/globalStyles';

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
