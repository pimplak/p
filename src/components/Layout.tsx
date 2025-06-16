import { AppShell, NavLink, Group, Text, Title, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconCalendar, IconDashboard, IconStethoscope } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: IconDashboard, path: '/' },
    { label: 'Pacjenci', icon: IconUsers, path: '/patients' },
    { label: 'Kalendarz', icon: IconCalendar, path: '/calendar' },
  ];

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
              <IconStethoscope size={28} color="#339af0" />
              <Title order={3} c="psychFlowBlue.6">
                PsychFlow
              </Title>
            </Group>
          </Group>
          <Text size="sm" c="dimmed">
            Zarządzanie praktyką psychologiczną
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="md">
          Nawigacja
        </Text>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            active={location.pathname === item.path}
            label={item.label}
            leftSection={<item.icon size="1rem" />}
            onClick={() => navigate(item.path)}
            variant="filled"
            mb={4}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
} 