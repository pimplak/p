import { Select as MantineSelect, type SelectProps } from '@mantine/core';
import { forwardRef } from 'react';

interface CustomSelectProps extends SelectProps {
  variant?: 'default' | 'filled' | 'unstyled';
  hasError?: boolean;
  hasSuccess?: boolean;
}

export const Select = forwardRef<HTMLInputElement, CustomSelectProps>(
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
            backgroundColor: 'var(--color-input-bg)',
            border: '1px solid var(--color-input-border)',
            color: 'var(--color-text)',
            '&:focus, &:focus-within': {
              borderColor: 'var(--color-primary)',
              boxShadow: '0 0 0 1px var(--color-primary)',
              outline: 'none',
            },
            '&:hover:not(:focus):not(:focus-within)': {
              borderColor: 'var(--color-primary-light)',
            }
          };
      }
    };

    return (
      <MantineSelect
        ref={ref}
        radius="md"
        size="md"
        searchable
        clearable
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
          dropdown: {
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-input-border)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '4px',
            color: 'var(--color-text)',
          },
          option: {
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.875rem',
            transition: 'all 150ms ease-out',
            color: 'var(--color-text)',
            '&[data-hovered]': {
              backgroundColor: 'var(--color-accent-light)',
            },
            '&[data-selected]': {
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-button-text)',
              '&[data-hovered]': {
                backgroundColor: 'var(--color-primary-hover)',
              }
            }
          },
          ...styles,
        }}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select'; 