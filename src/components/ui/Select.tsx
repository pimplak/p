import { Select as MantineSelect, type SelectProps } from '@mantine/core';
import { useTheme } from '../../hooks/useTheme';

interface CustomSelectProps extends SelectProps {
  variant?: 'default' | 'filled' | 'unstyled';
}

export const Select: React.FC<CustomSelectProps> = ({
  variant = 'default',
  style,
  styles,
  ...props
}) => {
  const { currentPalette, mantineTheme, isDark } = useTheme();

  const getVariantStyles = () => {
    const baseStyles = {
      input: {
        backgroundColor: currentPalette.surface,
        color: currentPalette.text,
        borderColor: `${currentPalette.primary}60`,
        borderRadius: mantineTheme.radius?.md,
        fontFamily: mantineTheme.fontFamily,
        fontSize: mantineTheme.fontSizes?.md,
        '&:focus': {
          borderColor: currentPalette.primary,
          boxShadow: `0 0 0 1px ${currentPalette.primary}`,
          backgroundColor: currentPalette.surface,
        },
        '&:hover': {
          borderColor: `${currentPalette.primary}80`,
        },
        '&::placeholder': {
          color: `${currentPalette.text}60`,
          opacity: 1,
        },
      },
      label: {
        color: currentPalette.text,
        fontWeight: 500,
        fontSize: mantineTheme.fontSizes?.sm,
      },
      dropdown: {
        backgroundColor: currentPalette.surface,
        border: `1px solid ${currentPalette.primary}`,
        borderRadius: mantineTheme.radius?.md,
        boxShadow: `0 4px 12px ${currentPalette.primary}20`,
      },
      option: {
        color: currentPalette.text,
        fontSize: mantineTheme.fontSizes?.sm,
        padding: `${mantineTheme.spacing?.sm} ${mantineTheme.spacing?.md}`,
        '&:hover': {
          backgroundColor: `${currentPalette.accent}30`,
        },
        '&[data-selected]': {
          backgroundColor: currentPalette.primary,
          color: isDark ? currentPalette.background : currentPalette.surface,
          '&:hover': {
            backgroundColor: currentPalette.accent,
          },
        },
      },
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          input: {
            ...baseStyles.input,
            backgroundColor: `${currentPalette.primary}10`,
            border: 'none',
            '&:focus': {
              backgroundColor: currentPalette.surface,
              boxShadow: `0 0 0 2px ${currentPalette.primary}`,
            },
          },
        };

      case 'unstyled':
        return {
          ...baseStyles,
          input: {
            ...baseStyles.input,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${currentPalette.text}40`,
            borderRadius: '0',
            '&:focus': {
              borderBottomColor: currentPalette.primary,
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          },
        };

      default:
        return baseStyles;
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <MantineSelect
      radius={mantineTheme.radius?.md}
      size='md'
      comboboxProps={{
        shadow: 'sm',
        radius: mantineTheme.radius?.md,
      }}
      style={{
        ...style,
      }}
      styles={{
        input: variantStyles.input,
        label: variantStyles.label,
        dropdown: variantStyles.dropdown,
        option: variantStyles.option,
        ...styles,
      }}
      {...props}
    />
  );
};
