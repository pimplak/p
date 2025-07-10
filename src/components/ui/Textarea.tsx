import { Textarea as MantineTextarea, type TextareaProps } from '@mantine/core';
import { useTheme } from '../../hooks/useTheme';

interface CustomTextareaProps extends TextareaProps {
  variant?: 'default' | 'filled' | 'unstyled';
}

export const Textarea: React.FC<CustomTextareaProps> = ({ 
  variant = 'default',
  style,
  styles,
  ...props 
}) => {
  const { currentPalette, mantineTheme, utilityColors } = useTheme();

  const getVariantStyles = () => {
    const baseStyles = {
      input: {
        backgroundColor: currentPalette.surface,
        color: currentPalette.text,
        borderColor: `${currentPalette.primary}60`,
        borderRadius: mantineTheme.radius?.md,
        fontFamily: mantineTheme.fontFamily,
        fontSize: mantineTheme.fontSizes?.md,
        minHeight: '88px',
        padding: mantineTheme.spacing?.sm,
        lineHeight: 1.5,
        '&:focus': {
          borderColor: currentPalette.primary,
          boxShadow: `0 0 0 1px ${currentPalette.primary}`,
          backgroundColor: currentPalette.surface,
          outline: 'none',
        },
        '&:hover': {
          borderColor: `${currentPalette.primary}80`,
        },
        '&::placeholder': {
          color: `${currentPalette.text}60`,
          opacity: 1,
        },
        resize: 'vertical' as const,
      },
      label: {
        color: currentPalette.text,
        fontWeight: 500,
        fontSize: mantineTheme.fontSizes?.sm,
        marginBottom: mantineTheme.spacing?.xs,
      },
      description: {
        color: `${currentPalette.text}70`,
        fontSize: mantineTheme.fontSizes?.sm,
        marginTop: mantineTheme.spacing?.xs,
      },
      error: {
        color: utilityColors.error,
        fontSize: mantineTheme.fontSizes?.sm,
        marginTop: mantineTheme.spacing?.xs,
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
              outline: 'none',
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
              outline: 'none',
            },
          },
        };
      
      default:
        return baseStyles;
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <MantineTextarea
      radius={mantineTheme.radius?.md}
      size="md"
      autosize
      minRows={3}
      maxRows={8}
      style={{
        ...style
      }}
      styles={{
        input: variantStyles.input,
        label: variantStyles.label,
        description: variantStyles.description,
        error: variantStyles.error,
        ...styles,
      }}
      {...props}
    />
  );
};