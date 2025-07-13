import { Button as MantineButton, type ButtonProps } from '@mantine/core';
import { useTheme } from '../../hooks/useTheme';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  children,
  style,
  ...props
}) => {
  const { currentPalette, mantineTheme, isDark } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: currentPalette.primary,
          border: 'none',
          color: isDark ? currentPalette.background : currentPalette.surface,
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: currentPalette.accent,
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${currentPalette.primary}40`,
          },
          '&:focus-visible': {
            outline: `2px solid ${currentPalette.primary}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 4px ${currentPalette.primary}30, 0 4px 12px rgba(0, 0, 0, 0.15)`,
            transform: 'translateY(-1px)',
          },
        };

      case 'secondary':
        return {
          backgroundColor: 'transparent',
          border: `1px solid ${currentPalette.primary}60`,
          color: currentPalette.text,
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: `${currentPalette.primary}20`,
            borderColor: currentPalette.primary,
            transform: 'translateY(-1px)',
          },
          '&:focus-visible': {
            outline: `2px solid ${currentPalette.primary}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 4px ${currentPalette.primary}30`,
            backgroundColor: `${currentPalette.primary}20`,
            borderColor: currentPalette.primary,
          },
        };

      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          color: `${currentPalette.text}80`,
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: `${currentPalette.accent}30`,
            color: currentPalette.text,
          },
          '&:focus-visible': {
            outline: `2px solid ${currentPalette.primary}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 4px ${currentPalette.primary}30`,
            backgroundColor: `${currentPalette.accent}30`,
            color: currentPalette.text,
          },
        };

      default:
        return {};
    }
  };

  return (
    <MantineButton
      radius={mantineTheme.radius?.md}
      size='md'
      style={{
        ...getVariantStyles(),
        minHeight: '44px', // Mobile-friendly touch target
        ...style,
      }}
      {...props}
    >
      {children}
    </MantineButton>
  );
};
