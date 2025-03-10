import type { Config } from 'tailwindcss';
// @ts-expect-error - no types
import nativewind from 'nativewind/preset';
import { radixColors, tailwindSafelist } from 'radi-color-css';

import baseConfig from '@1up/tailwind-config/native';

const { hairlineWidth } = require('nativewind/theme');

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [baseConfig, nativewind],
  safelist: [
    {
      ...tailwindSafelist
    }
  ],
  theme: {
    // Override the base theme completely instead of extending it
    colors: {
      ...radixColors,
      border: 'var(--sand-6)',
      input: 'var(--sand-6)',
      ring: 'var(--sand-6)',
      background: 'var(--sand-2)',
      foreground: 'var(--sand-12)',
      primary: {
        DEFAULT: 'var(--sand-12)',
        foreground: 'var(--sand-1)'
      },
      secondary: {
        DEFAULT: 'var(--sand-9)',
        foreground: 'var(--sand-1)'
      },
      destructive: {
        DEFAULT: 'var(--red-9)',
        foreground: 'var(--red-1)'
      },
      muted: {
        DEFAULT: 'var(--sand-10)',
        foreground: 'var(--sand-1)'
      },
      accent: {
        DEFAULT: 'var(--orange-9)',
        foreground: 'var(--orange-1)'
      },
      popover: {
        DEFAULT: 'var(--popover)',
        foreground: 'var(--popover-foreground)'
      },
      card: {
        DEFAULT: 'var(--card)',
        foreground: 'var(--card-foreground)'
      }
    },
    extend: {
      fontFamily: {
        // Remove old Geist font configurations
        sans: ['JetBrainsMono', 'monospace'], // Use JetBrainsMono as the default sans font
        mono: ['JetBrainsMono', 'monospace'], // Regular weight
        'mono-medium': ['JetBrainsMono-Medium', 'JetBrainsMono', 'monospace'],
        'mono-bold': ['JetBrainsMono-Bold', 'JetBrainsMono', 'monospace'],
        'mono-light': ['JetBrainsMono-Light', 'JetBrainsMono', 'monospace'],
        'mono-semibold': [
          'JetBrainsMono-SemiBold',
          'JetBrainsMono',
          'monospace'
        ],
        system: ['system-ui', 'sans-serif'] // Use this when you need system font
      },
      borderWidth: {
        hairline: hairlineWidth()
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    },
    plugins: [require('tailwindcss-animate')]
  }
} satisfies Config;
