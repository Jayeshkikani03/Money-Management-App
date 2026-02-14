import React from 'react';
import {
    Utensils,
    Car,
    Receipt,
    ShoppingBag,
    Film,
    Heart,
    GraduationCap,
    MoreHorizontal,
    Briefcase,
    DollarSign,
    TrendingUp,
    Wallet
} from 'lucide-react';

// Category icon mapping
export const getCategoryIcon = (categoryName) => {
    const iconMap = {
        // Expense categories
        'Food': Utensils,
        'Travel': Car,
        'Bills': Receipt,
        'Shopping': ShoppingBag,
        'Entertainment': Film,
        'Health': Heart,
        'Education': GraduationCap,
        'Other Expense': MoreHorizontal,

        // Income categories
        'Salary': Briefcase,
        'Freelance': DollarSign,
        'Investment': TrendingUp,
        'Other Income': Wallet
    };

    return iconMap[categoryName] || MoreHorizontal;
};

const CategoryIcon = ({ category, type }) => {
    const Icon = getCategoryIcon(category);

    return (
        <div className={`category-icon ${type}`}>
            <Icon size={20} />
        </div>
    );
};

export default CategoryIcon;
