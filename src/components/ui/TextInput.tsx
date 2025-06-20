import { TextInput as MantineTextInput, type TextInputProps } from '@mantine/core';
import { forwardRef } from 'react';

interface CustomTextInputProps extends TextInputProps {
  variant?: 'default' | 'filled' | 'unstyled';
  hasError?: boolean;
  hasSuccess?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, CustomTextInputProps>(
  ({ variant = 'default', hasError, hasSuccess, style, styles, ...props }, ref) => {
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
          backgroundColor: '#FEF2F2',
          border: '1px solid var(--danger)',
          '&:focus, &:focus-within': {
            borderColor: 'var(--danger)',
            boxShadow: '0 0 0 1px var(--danger)',
            outline: 'none',
          }
        };
      }

      if (hasSuccess) {
        return {
          ...baseStyles,
          backgroundColor: '#F0FDF4',
          border: '1px solid var(--success)',
          '&:focus, &:focus-within': {
            borderColor: 'var(--success)',
            boxShadow: '0 0 0 1px var(--success)',
            outline: 'none',
          }
        };
      }

      switch (variant) {
        case 'filled':
          return {
            ...baseStyles,
            backgroundColor: 'var(--gray-50)',
            border: '1px solid var(--gray-200)',
            '&:focus, &:focus-within': {
              backgroundColor: 'white',
              borderColor: '#6366F1',
              boxShadow: '0 0 0 1px #6366F1',
              outline: 'none',
            },
            '&:hover:not(:focus):not(:focus-within)': {
              borderColor: 'var(--gray-300)',
            }
          };

        case 'unstyled':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '2px solid var(--gray-200)',
            borderRadius: '0',
            '&:focus, &:focus-within': {
              borderBottomColor: '#6366F1',
              outline: 'none',
            }
          };

        default:
          return {
            ...baseStyles,
            backgroundColor: 'white',
            border: '1px solid var(--gray-200)',
            '&:focus, &:focus-within': {
              borderColor: '#6366F1',
              boxShadow: '0 0 0 1px #6366F1',
              outline: 'none',
            },
            '&:hover:not(:focus):not(:focus-within)': {
              borderColor: 'var(--gray-300)',
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
            color: 'var(--gray-700)',
            marginBottom: '6px',
          },
          error: {
            fontSize: '0.875rem',
            color: 'var(--danger)',
            marginTop: '4px',
          },
          description: {
            fontSize: '0.875rem',
            color: 'var(--gray-600)',
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