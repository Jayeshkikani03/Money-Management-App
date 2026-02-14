import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { getAccountTotals } from '../services/accountTransactionService';
import { ACCOUNT_TYPES } from '../constants/accountTypes';
import { Wallet, Landmark, CreditCard, DollarSign } from 'lucide-react';
import './AccountsOverview.css';

const AccountsOverview = () => {
    const { transactions, bankAccounts, creditCards, settings } = useApp();

    const totals = useMemo(() => {
        // Cash Balance
        const cashStats = getAccountTotals(transactions, ACCOUNT_TYPES.CASH);
        const cashBalance = cashStats.balance;

        // Bank Balance
        const bankBalance = bankAccounts.reduce((acc, account) => acc + account.balance, 0);

        // Credit Card Debt (Used Amount)
        const creditDebt = creditCards.reduce((acc, card) => acc + card.usedAmount, 0);

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
                    <DollarSign size={24} />
                </div>
                <div className="overview-content">
                    <span className="overview-label">Net Worth</span>
                    <span className={`overview-amount ${totals.netWorth >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(totals.netWorth, settings.currency)}
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
                    <span className="overview-amount">{formatCurrency(totals.cash, settings.currency)}</span>
                </div>

                <div className="overview-card small">
                    <div className="overview-header">
                        <div className="overview-icon bank">
                            <Landmark size={16} />
                        </div>
                        <span className="overview-label">Bank</span>
                    </div>
                    <span className="overview-amount">{formatCurrency(totals.bank, settings.currency)}</span>
                </div>

                <div className="overview-card small">
                    <div className="overview-header">
                        <div className="overview-icon credit">
                            <CreditCard size={16} />
                        </div>
                        <span className="overview-label">Credit Used</span>
                    </div>
                    <span className="overview-amount negative">-{formatCurrency(totals.credit, settings.currency)}</span>
                </div>
            </div>
        </div>
    );
};

export default AccountsOverview;
