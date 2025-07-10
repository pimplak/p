import { TextInput as MantineTextInput, type TextInputProps } from '@mantine/core';
import { forwardRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface CustomTextInputProps extends TextInputProps {
  variant?: 'default' | 'filled' | 'unstyled';
  hasError?: boolean;
  hasSuccess?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, CustomTextInputProps>(
  ({ variant = 'default', hasError, hasSuccess, style, styles, ...props }, ref) => {
    const { currentPalette, utilityColors } = useTheme();

    const getVariantStyles = () => {
      const baseStyles = {
        minHeight: '44px',
        fontSize: '1rem',
        fontWeight: 400,
        borderRadius: '8px',
        transition: 'all 200ms ease-out',
      };

      if (hasError) {
        return {
          ...baseStyles,
          backgroundColor: currentPalette.surface,
          border: `1px solid ${utilityColors.error}`,
          color: currentPalette.text,
          '&:focus, &:focus-within': {
            borderColor: utilityColors.error,
            boxShadow: `0 0 0 1px ${utilityColors.error}`,
            outline: 'none',
          }
        };
      }

      if (hasSuccess) {
        return {
          ...baseStyles,
          backgroundColor: currentPalette.surface,
          border: `1px solid ${utilityColors.success}`,
          color: currentPalette.text,
          '&:focus, &:focus-within': {
            borderColor: utilityColors.success,
            boxShadow: `0 0 0 1px ${utilityColors.success}`,
            outline: 'none',
          }
        };
      }

      switch (variant) {
        case 'filled':
          return {
            ...baseStyles,
            backgroundColor: currentPalette.surface,
            border: `1px solid ${currentPalette.primary}`,
            color: currentPalette.text,
            '&:focus, &:focus-within': {
              backgroundColor: currentPalette.surface,
              borderColor: currentPalette.primary,
              boxShadow: `0 0 0 3px ${currentPalette.primary}20`,
              outline: `2px solid ${currentPalette.primary}`,
              outlineOffset: '2px',
            },
            '&:hover:not(:focus):not(:focus-within)': {
              borderColor: `${currentPalette.primary}80`,
            }
          };

        case 'unstyled':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${currentPalette.text}40`,
            borderRadius: '0',
            '&:focus, &:focus-within': {
              borderBottomColor: currentPalette.primary,
              outline: 'none',
            }
          };

        default:
          return {
            ...baseStyles,
            backgroundColor: currentPalette.surface,
            border: `1px solid ${currentPalette.primary}`,
            color: currentPalette.text,
            '&:focus, &:focus-within': {
              borderColor: currentPalette.primary,
              boxShadow: `0 0 0 3px ${currentPalette.primary}20`,
              outline: `2px solid ${currentPalette.primary}`,
              outlineOffset: '2px',
            },
            '&:hover:not(:focus):not(:focus-within)': {
              borderColor: `${currentPalette.primary}80`,
            }
          };
      }
    };

    return (
      <MantineTextInput
        ref={ref}
        radius="md"
        size="md"
        style={style}
        styles={{
          input: getVariantStyles(),
          label: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: currentPalette.text,
            marginBottom: '6px',
          },
          error: {
            fontSize: '0.875rem',
            color: utilityColors.error,
            marginTop: '4px',
          },
          description: {
            fontSize: '0.875rem',
            color: `${currentPalette.text}80`,
            marginTop: '4px',
          },
          ...styles,
        }}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput'; 