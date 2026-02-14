/**
 * Responsive Breakpoints
 * Mobile-first design system
 */

export const breakpoints = {
    // Breakpoint values
    values: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    },

    // Media query helpers
    up: (breakpoint) => `@media (min-width: ${breakpoints.values[breakpoint]}px)`,
    down: (breakpoint) => `@media (max-width: ${breakpoints.values[breakpoint] - 1}px)`,
    between: (min, max) => `@media (min-width: ${breakpoints.values[min]}px) and (max-width: ${breakpoints.values[max] - 1}px)`,

    // Predefined media queries
    mobile: '@media (max-width: 639px)',
    tablet: '@media (min-width: 640px) and (max-width: 1023px)',
    desktop: '@media (min-width: 1024px)',
};

export default breakpoints;
