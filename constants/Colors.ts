import { ThemePalette } from './ThemeContext';

export const Colors: Record<'light' | 'dark', ThemePalette> = {
  light: {
    background: '#f8fafc',
    card: '#fff',
    text: '#232946',
    icon: '#64748b',
    accent: '#6366f1',
    tint: '#4338ca',
    border: '#e5e7eb',
    cardGradient: ['#6366f1', '#818cf8'] as const,
    shadow: 'rgba(0,0,0,0.08)',
    overlay: 'rgba(255,255,255,0.8)',
    primary: '#6366f1',
    secondary: '#818cf8',
    textLight: '#64748b',
    danger: '#ef4444',
    success: '#22c55e',
  },
  dark: {
    background: '#18181b',
    card: '#232946',
    text: '#f3f4f6',
    icon: '#a1a1aa',
    accent: '#a78bfa',
    tint: '#fff',
    border: '#334155',
    cardGradient: ['#232946', '#6366f1'] as const,
    shadow: 'rgba(67,56,202,0.13)',
    overlay: 'rgba(31,41,55,0.8)',
    primary: '#a78bfa',
    secondary: '#6366f1',
    textLight: '#a1a1aa',
    danger: '#f87171',
    success: '#4ade80',
  }
};