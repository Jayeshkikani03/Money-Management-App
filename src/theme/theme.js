/**
 * Central Theme Configuration
 * All UI components must reference this theme
 */

export const theme = {
    // Color System
    colors: {
        // Primary
        primary: '#2563EB',
        primaryHover: '#1D4ED8',
        primaryLight: '#DBEAFE',

        // Semantic Colors
        success: '#16A34A',
        successLight: '#DCFCE7',
        danger: '#DC2626',
        dangerLight: '#FEE2E2',
        warning: '#F59E0B',
        warningLight: '#FEF3C7',
        info: '#0EA5E9',
        infoLight: '#E0F2FE',

        // Neutrals
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceHover: '#F1F5F9',
        border: '#E2E8F0',
        borderLight: '#F1F5F9',

        // Text
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        textInverse: '#FFFFFF',

        // Finance Specific
        income: '#16A34A',
        expense: '#DC2626',
        transfer: '#0EA5E9',
        charge: '#F59E0B',

        // Dark Mode
        dark: {
            background: '#0F172A',
            surface: '#1E293B',
            surfaceHover: '#334155',
            border: '#334155',
            borderLight: '#475569',
            textPrimary: '#F1F5F9',
            textSecondary: '#CBD5E1',
            textTertiary: '#94A3B8',
        }
    },

    // Typography System
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

        h1: {
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        body: {
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.5,
        },
        small: {
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.4,
        },
        amountLarge: {
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        button: {
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1,
        }
    },

    // Spacing System (8px grid)
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },

    // Border Radius
    borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        full: '9999px',
    },

    // Shadows
    shadows: {
        card: '0 4px 16px rgba(0, 0, 0, 0.05)',
        cardHover: '0 8px 24px rgba(0, 0, 0, 0.08)',
        modal: '0 8px 30px rgba(0, 0, 0, 0.15)',
        dropdown: '0 4px 20px rgba(0, 0, 0, 0.1)',
        focus: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },

    // Transitions
    transitions: {
        fast: '150ms ease',
        normal: '250ms ease',
        slow: '350ms ease',
    },

    // Z-Index Scale
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
        toast: 1080,
    },

    // Breakpoints (mobile-first)
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
    },
};

export default theme;
