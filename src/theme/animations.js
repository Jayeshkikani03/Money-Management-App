/**
 * Animation System
 * Centralized animation and transition constants
 */

export const animations = {
    // Timing Functions
    timing: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
    },

    // Easing Functions
    easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // Common Transitions
    transitions: {
        fast: '150ms ease',
        normal: '250ms ease',
        slow: '350ms ease',
        all: 'all 250ms ease',
        color: 'color 150ms ease',
        background: 'background-color 150ms ease',
        transform: 'transform 250ms ease',
        opacity: 'opacity 250ms ease',
    },

    // Keyframe Animations
    keyframes: {
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
        fadeOut: {
            from: { opacity: 1 },
            to: { opacity: 0 },
        },
        slideUp: {
            from: { transform: 'translateY(20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
            from: { transform: 'translateY(-20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
        },
        scaleIn: {
            from: { transform: 'scale(0.95)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
        },
        scaleOut: {
            from: { transform: 'scale(1)', opacity: 1 },
            to: { transform: 'scale(0.95)', opacity: 0 },
        },
    },

    // Hover Effects
    hover: {
        lift: 'transform 150ms ease',
        scale: 'transform 200ms ease',
        glow: 'box-shadow 200ms ease',
    },

    // Press Effects
    press: {
        scale: 'transform 100ms ease',
    },
};

export default animations;
