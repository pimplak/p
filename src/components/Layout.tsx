import { AppShell, NavLink, Group, Text, Title, Burger, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconCalendar, IconDashboard, IconStethoscope, IconSettings } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [opened, { toggle, close }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { label: 'Dashboard', icon: IconDashboard, path: '/' },
    { label: 'Pacjenci', icon: IconUsers, path: '/patients' },
    { label: 'Kalendarz', icon: IconCalendar, path: '/calendar' },
  ];

  const settingsNavItems = [
    { label: 'Ustawienia', icon: IconSettings, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    close(); // Zamknij menu na mobile po nawigacji
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap={8}>
              <IconStethoscope 
                size={28} 
                style={{ color: 'var(--color-primary)' }}
              />
              <Title 
                order={3} 
                style={{ color: 'var(--color-text)' }}
              >
                PsychFlow
              </Title>
            </Group>
          </Group>
          <Text 
            size="sm" 
            c="dimmed" 
            visibleFrom="md"
            style={{ color: 'var(--color-text)', opacity: 0.7 }}
          >
            Zarządzanie praktyką psychologiczną
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text 
          size="xs" 
          tt="uppercase" 
          fw={700} 
          mb="md"
          style={{ color: 'var(--color-text)', opacity: 0.6 }}
        >
          Główne
        </Text>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            active={location.pathname === item.path}
            label={item.label}
            leftSection={<item.icon size="1rem" />}
            onClick={() => handleNavigation(item.path)}
            variant="filled"
            mb={4}
          />
        ))}
        <Divider my="md" style={{ borderColor: 'var(--color-primary)' }} />
        <Text 
          size="xs" 
          tt="uppercase" 
          fw={700} 
          mb="md"
          style={{ color: 'var(--color-text)', opacity: 0.6 }}
        >
          Aplikacja
        </Text>
        {settingsNavItems.map((item) => (
          <NavLink
            key={item.path}
            active={location.pathname === item.path}
            label={item.label}
            leftSection={<item.icon size="1rem" />}
            onClick={() => handleNavigation(item.path)}
            variant="filled"
            mb={4}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
} 