import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useCurrency } from '../hooks/useCurrency';
import { safeNumber, safeSum } from '../utils/numberUtils';
import { getAccountTotals } from '../services/accountTransactionService';
import { ACCOUNT_TYPES } from '../constants/accountTypes';
import { Wallet, Landmark, CreditCard, DollarSign, IndianRupee, Euro, PoundSterling, Coins } from 'lucide-react';
import './AccountsOverview.css';

const AccountsOverview = () => {
    const { transactions, bankAccounts, creditCards } = useApp();
    const { format, currency } = useCurrency();

    // Dynamic currency icon based on selected currency
    const getCurrencyIcon = () => {
        const iconProps = { size: 24 };
        switch (currency) {
            case 'INR':
                return <IndianRupee {...iconProps} />;
            case 'USD':
            case 'CAD':
            case 'AUD':
            case 'NZD':
                return <DollarSign {...iconProps} />;
            case 'EUR':
                return <Euro {...iconProps} />;
            case 'GBP':
                return <PoundSterling {...iconProps} />;
            default:
                return <Coins {...iconProps} />;
        }
    };

    const totals = useMemo(() => {
        // Cash Balance with safe operations
        const cashStats = getAccountTotals(transactions, ACCOUNT_TYPES.CASH);
        const cashBalance = safeNumber(cashStats.balance);

        // Bank Balance with safe operations
        const bankBalances = bankAccounts.map(account => safeNumber(account.balance));
        const bankBalance = safeSum(bankBalances);

        // Credit Card Debt (Used Amount) with safe operations
        const creditDebts = creditCards.map(card => safeNumber(card.usedAmount));
        const creditDebt = safeSum(creditDebts);

        // Net Worth
        const netWorth = cashBalance + bankBalance - creditDebt;

        return {
            cash: cashBalance,
            bank: bankBalance,
            credit: creditDebt,
            netWorth: netWorth
        };
    }, [transactions, bankAccounts, creditCards]);

    return (
        <div className="accounts-overview">
            <div className="overview-card net-worth">
                <div className="overview-icon-wrapper">
                    {getCurrencyIcon()}
                </div>
                <div className="overview-content">
                    <span className="overview-label">Net Worth</span>
                    <span className={`overview-amount ${totals.netWorth >= 0 ? 'positive' : 'negative'}`}>
                        {format(totals.netWorth)}
                    </span>
                </div>
            </div>

            <div className="overview-grid">
                <div className="overview-card small">
                    <div className="overview-header">
                        <div className="overview-icon cash">
                            <Wallet size={16} />
                        </div>
                        <span className="overview-label">Cash</span>
                    </div>
                    <span className="overview-amount">{format(totals.cash)}</span>
                </div>

                <div className="overview-card small">
                    <div className="overview-header">
                        <div className="overview-icon bank">
                            <Landmark size={16} />
                        </div>
                        <span className="overview-label">Bank</span>
                    </div>
                    <span className="overview-amount">{format(totals.bank)}</span>
                </div>

                <div className="overview-card small">
                    <div className="overview-header">
                        <div className="overview-icon credit">
                            <CreditCard size={16} />
                        </div>
                        <span className="overview-label">Credit Used</span>
                    </div>
                    <span className="overview-amount negative">-{format(totals.credit)}</span>
                </div>
            </div>
        </div>
    );
};

export default AccountsOverview;
