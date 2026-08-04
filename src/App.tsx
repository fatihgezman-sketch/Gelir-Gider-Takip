import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  AppStateData,
  BankAccount,
  CreditCard,
  Currency,
  ExpenseItem,
  IncomeItem,
  InvestmentItem,
} from './types';
import {
  loadAppState,
  saveAppState,
  DEFAULT_SETTINGS,
  INITIAL_DEMO_DATA,
  CURRENCY_SYMBOLS,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { CashOutModal } from './components/CashOutModal';
import { TransferModal } from './components/TransferModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { HomeTab } from './components/tabs/HomeTab';
import { IncomeTab } from './components/tabs/IncomeTab';
import { ExpenseTab } from './components/tabs/ExpenseTab';
import { SavingsTab } from './components/tabs/SavingsTab';
import { AccountsTab } from './components/tabs/AccountsTab';
import { CalendarTab } from './components/tabs/CalendarTab';

export default function App() {
  const [appState, setAppState] = useState<AppStateData>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Modals & Overlay state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [cashOutInvestment, setCashOutInvestment] = useState<InvestmentItem | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    saveAppState(appState);

    // Apply dark/light theme to document element
    if (appState.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [appState]);

  // Onboarding Completion
  const handleOnboardingComplete = (
    currency: Currency,
    authMethod: 'google' | 'guest',
    loadDemo: boolean
  ) => {
    let nextData: AppStateData;

    if (loadDemo) {
      nextData = {
        ...INITIAL_DEMO_DATA,
        settings: {
          ...INITIAL_DEMO_DATA.settings,
          currency,
          currencySymbol: CURRENCY_SYMBOLS[currency] || '₺',
          authMethod,
          isSetupCompleted: true,
        },
      };
    } else {
      nextData = {
        settings: {
          ...DEFAULT_SETTINGS,
          currency,
          currencySymbol: CURRENCY_SYMBOLS[currency] || '₺',
          authMethod,
          isSetupCompleted: true,
        },
        accounts: [
          {
            id: 'acc_1',
            bankName: 'Ana Banka Hesabım',
            accountAlias: 'Vadesiz TL',
            initialBalance: 0,
            currentBalance: 0,
            currency,
            description: 'Varsayılan banka hesabı',
          },
        ],
        creditCards: [],
        transfers: [],
        incomes: [],
        expenses: [],
        investments: [],
      };
    }

    setAppState(nextData);
    showToast('PayBee kurulumu tamamlandı! Hoş geldiniz.', 'success');
  };

  // Theme Toggle Quick Handler
  const handleToggleTheme = () => {
    const nextTheme = appState.settings.theme === 'dark' ? 'light' : 'dark';
    setAppState((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme: nextTheme },
    }));
    showToast(`Tema ${nextTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} yapıldı.`, 'info');
  };

  // FINANCIAL ACTIONS

  // 1. Toggle Income Status
  const handleToggleIncomeStatus = (id: string) => {
    setAppState((prev) => {
      const targetIncome = prev.incomes.find((i) => i.id === id);
      if (!targetIncome) return prev;

      const nextStatus = targetIncome.status === 'received' ? 'pending' : 'received';
      const isNowReceived = nextStatus === 'received';

      // Update Income item
      const updatedIncomes = prev.incomes.map((i) =>
        i.id === id ? { ...i, status: nextStatus as any } : i
      );

      // Adjust Target Bank Account balance
      let updatedAccounts = [...prev.accounts];
      if (targetIncome.targetAccountId) {
        updatedAccounts = updatedAccounts.map((acc) => {
          if (acc.id === targetIncome.targetAccountId) {
            const delta = isNowReceived ? targetIncome.amount : -targetIncome.amount;
            return { ...acc, currentBalance: acc.currentBalance + delta };
          }
          return acc;
        });
      }

      showToast(
        isNowReceived
          ? `Gelir tahsil edildi, bakiyeye eklendi (+${targetIncome.amount} ${prev.settings.currencySymbol})`
          : 'Gelir bekliyor durumuna alındı.',
        'success'
      );

      return {
        ...prev,
        incomes: updatedIncomes,
        accounts: updatedAccounts,
      };
    });
  };

  // 2. Toggle Expense Status
  const handleToggleExpenseStatus = (id: string) => {
    setAppState((prev) => {
      const targetExp = prev.expenses.find((e) => e.id === id);
      if (!targetExp) return prev;

      const nextStatus = targetExp.status === 'paid' ? 'unpaid' : 'paid';
      const isNowPaid = nextStatus === 'paid';

      // Update Expense item
      const updatedExpenses = prev.expenses.map((e) =>
        e.id === id ? { ...e, status: nextStatus as any } : e
      );

      // Adjust Bank Account or Credit Card balance
      let updatedAccounts = [...prev.accounts];
      let updatedCards = [...prev.creditCards];

      if (targetExp.paymentSourceId) {
        if (targetExp.paymentSourceType === 'account') {
          updatedAccounts = updatedAccounts.map((acc) => {
            if (acc.id === targetExp.paymentSourceId) {
              const delta = isNowPaid ? -targetExp.amount : targetExp.amount;
              return { ...acc, currentBalance: acc.currentBalance + delta };
            }
            return acc;
          });
        } else if (targetExp.paymentSourceType === 'credit_card') {
          updatedCards = updatedCards.map((card) => {
            if (card.id === targetExp.paymentSourceId) {
              const delta = isNowPaid ? targetExp.amount : -targetExp.amount;
              return { ...card, currentDebt: card.currentDebt + delta };
            }
            return card;
          });
        }
      }

      showToast(
        isNowPaid
          ? `Gider ödendi olarak işaretlendi (-${targetExp.amount} ${prev.settings.currencySymbol})`
          : 'Gider ödenmedi durumuna alındı.',
        'info'
      );

      return {
        ...prev,
        expenses: updatedExpenses,
        accounts: updatedAccounts,
        creditCards: updatedCards,
      };
    });
  };

  // 3. Add Income
  const handleAddIncome = (item: Omit<IncomeItem, 'id'>) => {
    const newId = 'inc_' + Date.now();
    const newIncome: IncomeItem = { ...item, id: newId };

    setAppState((prev) => {
      let updatedAccounts = [...prev.accounts];

      // If status is received, immediately credit bank account
      if (newIncome.status === 'received' && newIncome.targetAccountId) {
        updatedAccounts = updatedAccounts.map((acc) => {
          if (acc.id === newIncome.targetAccountId) {
            return { ...acc, currentBalance: acc.currentBalance + newIncome.amount };
          }
          return acc;
        });
      }

      showToast(`Yeni gelir eklendi: ${newIncome.title}`, 'success');

      return {
        ...prev,
        incomes: [newIncome, ...prev.incomes],
        accounts: updatedAccounts,
      };
    });
  };

  // 4. Delete Income
  const handleDeleteIncome = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((i) => i.id !== id),
    }));
    showToast('Gelir kaydı silindi.', 'info');
  };

  // 5. Add Expense
  const handleAddExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newId = 'exp_' + Date.now();
    const newExpense: ExpenseItem = { ...item, id: newId };

    setAppState((prev) => {
      let updatedAccounts = [...prev.accounts];
      let updatedCards = [...prev.creditCards];

      if (newExpense.status === 'paid' && newExpense.paymentSourceId) {
        if (newExpense.paymentSourceType === 'account') {
          updatedAccounts = updatedAccounts.map((acc) => {
            if (acc.id === newExpense.paymentSourceId) {
              return { ...acc, currentBalance: acc.currentBalance - newExpense.amount };
            }
            return acc;
          });
        } else if (newExpense.paymentSourceType === 'credit_card') {
          updatedCards = updatedCards.map((card) => {
            if (card.id === newExpense.paymentSourceId) {
              return { ...card, currentDebt: card.currentDebt + newExpense.amount };
            }
            return card;
          });
        }
      }

      showToast(`Yeni gider eklendi: ${newExpense.title}`, 'success');

      return {
        ...prev,
        expenses: [newExpense, ...prev.expenses],
        accounts: updatedAccounts,
        creditCards: updatedCards,
      };
    });
  };

  // 6. Delete Expense
  const handleDeleteExpense = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    showToast('Gider kaydı silindi.', 'info');
  };

  // 7. Cash Out Investment (Bozdur / Hesaba Aktar)
  const handleConfirmCashOut = (
    investmentId: string,
    sellQuantity: number,
    cashReceived: number,
    targetAccountId: string
  ) => {
    setAppState((prev) => {
      const inv = prev.investments.find((i) => i.id === investmentId);
      if (!inv) return prev;

      const remainingQuantity = inv.quantity - sellQuantity;

      // Update or remove investment
      let updatedInvestments = prev.investments;
      if (remainingQuantity <= 0.0001) {
        updatedInvestments = prev.investments.filter((i) => i.id !== investmentId);
      } else {
        updatedInvestments = prev.investments.map((i) =>
          i.id === investmentId ? { ...i, quantity: remainingQuantity } : i
        );
      }

      // Add cashReceived to target bank account
      const updatedAccounts = prev.accounts.map((acc) => {
        if (acc.id === targetAccountId) {
          return { ...acc, currentBalance: acc.currentBalance + cashReceived };
        }
        return acc;
      });

      showToast(
        `${sellQuantity} ${inv.unit} ${inv.title} bozduruldu. +${cashReceived} ${prev.settings.currencySymbol} hesaba eklendi.`,
        'success'
      );

      return {
        ...prev,
        investments: updatedInvestments,
        accounts: updatedAccounts,
      };
    });
  };

  // 8. Inter-Account Transfer
  const handleConfirmTransfer = (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    fee: number,
    note: string
  ) => {
    setAppState((prev) => {
      const fromAcc = prev.accounts.find((a) => a.id === fromAccountId);
      const toAcc = prev.accounts.find((a) => a.id === toAccountId);
      if (!fromAcc || !toAcc) return prev;

      // Deduct (amount + fee) from source account
      // Add amount to destination account
      const updatedAccounts = prev.accounts.map((acc) => {
        if (acc.id === fromAccountId) {
          return { ...acc, currentBalance: acc.currentBalance - (amount + fee) };
        }
        if (acc.id === toAccountId) {
          return { ...acc, currentBalance: acc.currentBalance + amount };
        }
        return acc;
      });

      // Record transfer
      const newTransfer = {
        id: 'tr_' + Date.now(),
        fromAccountId,
        toAccountId,
        amount,
        transferFee: fee,
        date: new Date().toISOString().slice(0, 10),
        note,
      };

      // If fee > 0, record as an Expense under "Banka İşlem Ücreti"
      let updatedExpenses = prev.expenses;
      if (fee > 0) {
        updatedExpenses = [
          {
            id: 'exp_fee_' + Date.now(),
            title: `EFT/Komisyon Ücreti (${fromAcc.bankName} -> ${toAcc.bankName})`,
            amount: fee,
            category: 'Banka İşlem Ücreti',
            dueDate: new Date().toISOString().slice(0, 10),
            status: 'paid',
            paymentSourceId: fromAccountId,
            paymentSourceType: 'account',
            note: 'Hesaplar arası transfer komisyonu',
          },
          ...prev.expenses,
        ];
      }

      showToast(
        `${fromAcc.accountAlias} -> ${toAcc.accountAlias} hesabına ${amount} ${prev.settings.currencySymbol} transfer edildi.`,
        'success'
      );

      return {
        ...prev,
        transfers: [newTransfer, ...prev.transfers],
        accounts: updatedAccounts,
        expenses: updatedExpenses,
      };
    });
  };

  // 9. Add/Delete Bank Accounts & Cards
  const handleAddAccount = (acc: Omit<BankAccount, 'id'>) => {
    const newAcc: BankAccount = { ...acc, id: 'acc_' + Date.now() };
    setAppState((prev) => ({
      ...prev,
      accounts: [...prev.accounts, newAcc],
    }));
    showToast(`Banka hesabı eklendi: ${newAcc.accountAlias}`, 'success');
  };

  const handleDeleteAccount = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      accounts: prev.accounts.filter((a) => a.id !== id),
    }));
    showToast('Banka hesabı silindi.', 'info');
  };

  const handleAddCreditCard = (card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = { ...card, id: 'card_' + Date.now() };
    setAppState((prev) => ({
      ...prev,
      creditCards: [...prev.creditCards, newCard],
    }));
    showToast(`Kredi kartı eklendi: ${newCard.cardName}`, 'success');
  };

  const handleDeleteCreditCard = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      creditCards: prev.creditCards.filter((c) => c.id !== id),
    }));
    showToast('Kredi kartı silindi.', 'info');
  };

  // 10. Add/Delete Investments
  const handleAddInvestment = (item: Omit<InvestmentItem, 'id' | 'updatedAt'>) => {
    const newInv: InvestmentItem = {
      ...item,
      id: 'inv_' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    setAppState((prev) => ({
      ...prev,
      investments: [newInv, ...prev.investments],
    }));
    showToast(`Yeni birikim eklendi: ${newInv.title}`, 'success');
  };

  const handleDeleteInvestment = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      investments: prev.investments.filter((i) => i.id !== id),
    }));
    showToast('Birikim kaydı silindi.', 'info');
  };

  const pendingIncomesCount = appState.incomes.filter((i) => i.status === 'pending').length;
  const unpaidExpensesCount = appState.expenses.filter((e) => e.status === 'unpaid').length;

  return (
    <div className="min-h-screen bg-[#09090b] dark:bg-[#09090b] light:bg-zinc-50 text-zinc-100 dark:text-zinc-100 light:text-zinc-900 font-sans selection:bg-amber-400 selection:text-zinc-950 transition-colors">
      {/* Toast Overlay */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Onboarding Welcome Modal */}
      <OnboardingModal
        isOpen={!appState.settings.isSetupCompleted}
        onComplete={handleOnboardingComplete}
      />

      {/* Main Top Header */}
      <Header
        settings={appState.settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Active Tab Body */}
      <main className="min-h-[calc(100vh-120px)] pt-2">
        {activeTab === 'home' && (
          <HomeTab
            appState={appState}
            onNavigateTab={(t) => setActiveTab(t)}
            onToggleIncomeStatus={handleToggleIncomeStatus}
            onToggleExpenseStatus={handleToggleExpenseStatus}
          />
        )}

        {activeTab === 'income' && (
          <IncomeTab
            incomes={appState.incomes}
            accounts={appState.accounts}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
            onToggleIncomeStatus={handleToggleIncomeStatus}
            currencySymbol={appState.settings.currencySymbol}
          />
        )}

        {activeTab === 'expense' && (
          <ExpenseTab
            expenses={appState.expenses}
            accounts={appState.accounts}
            creditCards={appState.creditCards}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onToggleExpenseStatus={handleToggleExpenseStatus}
            currencySymbol={appState.settings.currencySymbol}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsTab
            investments={appState.investments}
            onAddInvestment={handleAddInvestment}
            onUpdateInvestment={(inv) => {
              setAppState((prev) => ({
                ...prev,
                investments: prev.investments.map((i) => (i.id === inv.id ? inv : i)),
              }));
            }}
            onDeleteInvestment={handleDeleteInvestment}
            onOpenCashOutModal={(inv) => setCashOutInvestment(inv)}
            currencySymbol={appState.settings.currencySymbol}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsTab
            accounts={appState.accounts}
            creditCards={appState.creditCards}
            onAddAccount={handleAddAccount}
            onDeleteAccount={handleDeleteAccount}
            onAddCreditCard={handleAddCreditCard}
            onDeleteCreditCard={handleDeleteCreditCard}
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
            onShowToast={showToast}
            currencySymbol={appState.settings.currencySymbol}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarTab
            incomes={appState.incomes}
            expenses={appState.expenses}
            onToggleIncomeStatus={handleToggleIncomeStatus}
            onToggleExpenseStatus={handleToggleExpenseStatus}
            currencySymbol={appState.settings.currencySymbol}
          />
        )}
      </main>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        appState={appState}
        onUpdateState={(newState) => setAppState(newState)}
        onShowToast={showToast}
      />

      <CashOutModal
        isOpen={!!cashOutInvestment}
        onClose={() => setCashOutInvestment(null)}
        investment={cashOutInvestment}
        accounts={appState.accounts}
        onConfirmCashOut={handleConfirmCashOut}
        currencySymbol={appState.settings.currencySymbol}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={appState.accounts}
        onConfirmTransfer={handleConfirmTransfer}
        currencySymbol={appState.settings.currencySymbol}
      />

      {/* Fixed Bottom Navigation (6 Tabs) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(t) => setActiveTab(t)}
        pendingIncomesCount={pendingIncomesCount}
        unpaidExpensesCount={unpaidExpensesCount}
      />
    </div>
  );
}
