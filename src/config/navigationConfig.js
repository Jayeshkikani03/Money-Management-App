/**
 * Navigation Configuration
 * Centralized navigation structure for scalability
 */

import { Home, List, ArrowLeftRight, Wallet, BarChart3, Settings, Calendar, CreditCard } from 'lucide-react';

export const navigationConfig = {
    // Bottom Navigation (Mobile)
    bottomNav: [
        {
            path: '/',
            label: 'Home',
            icon: Home,
            enabled: true,
        },
        {
            path: '/transactions',
            label: 'Transactions',
            icon: List,
            enabled: true,
        },
        {
            path: '/accounts',
            label: 'Accounts',
            icon: Wallet,
            enabled: true,
        },
        {
            path: '/reports',
            label: 'Reports',
            icon: BarChart3,
            enabled: true,
        },
        {
            path: '/settings',
            label: 'Settings',
            icon: Settings,
            enabled: true,
        },
    ],

    // Additional Pages (accessible via routes but not in bottom nav)
    additionalRoutes: [
        {
            path: '/transfers',
            label: 'Transfers',
            icon: ArrowLeftRight,
            enabled: true,
        },
        {
            path: '/scheduled',
            label: 'Scheduled',
            icon: Calendar,
            enabled: true,
        },
        {
            path: '/bills',
            label: 'Bills',
            icon: CreditCard,
            enabled: true,
        },
        {
            path: '/recurring-management',
            label: 'Recurring Management',
            icon: Calendar,
            enabled: true,
        },
    ],

    // Accounts Section Submenu (Option B)
    accountsSubmenu: [
        {
            path: '/accounts',
            label: 'All Accounts',
            icon: Wallet,
        },
        {
            path: '/transfers',
            label: 'Transfers',
            icon: ArrowLeftRight,
        },
        {
            path: '/bills',
            label: 'Bills',
            icon: CreditCard,
        },
    ],

    // Finance Menu (Option C)
    financeMenu: [
        {
            path: '/transactions',
            label: 'Transactions',
            icon: List,
        },
        {
            path: '/transfers',
            label: 'Transfers',
            icon: ArrowLeftRight,
        },
        {
            path: '/scheduled',
            label: 'Scheduled',
            icon: Calendar,
        },
        {
            path: '/recurring-management',
            label: 'Recurring',
            icon: Calendar,
        },
    ],
};

/**
 * Get enabled bottom navigation items
 */
export const getBottomNavItems = () => {
    return navigationConfig.bottomNav.filter(item => item.enabled);
};

/**
 * Get all enabled routes
 */
export const getAllRoutes = () => {
    return [
        ...navigationConfig.bottomNav,
        ...navigationConfig.additionalRoutes,
    ].filter(item => item.enabled);
};

/**
 * Check if a route is enabled
 */
export const isRouteEnabled = (path) => {
    const allRoutes = getAllRoutes();
    const route = allRoutes.find(r => r.path === path);
    return route ? route.enabled : false;
};

export default navigationConfig;
