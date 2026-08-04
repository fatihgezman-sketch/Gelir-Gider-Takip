import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard as CreditCardIcon,
  PiggyBank,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { AppStateData } from '../../types';
import { formatCurrency, formatDateTR } from '../../utils/storage';

interface HomeTabProps {
  appState: AppStateData;
  onNavigateTab: (tab: any) => void;
  onToggleIncomeStatus: (id: string) => void;
  onToggleExpenseStatus: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Kira: '#f43f5e',
  Fatura: '#fb923c',
  'Mutfak/Market': '#eab308',
  'Eğlence/Sosyalleşme': '#a855f7',
  'Borç/Kredi': '#ec4899',
  Ulaşım: '#3b82f6',
  Abonelik: '#06b6d4',
  'Banka İşlem Ücreti': '#64748b',
  Diğer: '#94a3b8',
};

export const HomeTab: React.FC<HomeTabProps> = ({
  appState,
  onNavigateTab,
  onToggleIncomeStatus,
  onToggleExpenseStatus,
}) => {
  const symbol = appState.settings.currencySymbol;

  // Total Liquid Cash from Bank Accounts
  const totalBankBalance = appState.accounts.reduce((sum, a) => sum + a.currentBalance, 0);

  // Total Credit Card Debt
  const totalCardDebt = appState.creditCards.reduce((sum, c) => sum + c.currentDebt, 0);

  // Net Liquid Wealth = Bank Cash - Card Debt
  const netLiquidBalance = totalBankBalance - totalCardDebt;

  // Separate Investments Total
  const totalInvestmentValue = appState.investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPricePerUnit,
    0
  );

  // Monthly Income Totals
  const totalIncome = appState.incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const receivedIncome = appState.incomes
    .filter((inc) => inc.status === 'received')
    .reduce((sum, inc) => sum + inc.amount, 0);

  // Monthly Expense Totals
  const totalExpense = appState.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpense = appState.expenses
    .filter((exp) => exp.status === 'paid')
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Monthly Net Savings Balance
  const monthlyBalance = totalIncome - totalExpense;

  // Expense Category Aggregation for Chart
  const expenseByCategoryMap: Record<string, number> = {};
  appState.expenses.forEach((exp) => {
    expenseByCategoryMap[exp.category] = (expenseByCategoryMap[exp.category] || 0) + exp.amount;
  });

  const pieChartData = Object.entries(expenseByCategoryMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#64748b',
  }));

  // Bar Chart Data (Incomes vs Expenses)
  const barChartData = [
    { name: 'Gelirler', Tutarlı: totalIncome, Alınan: receivedIncome, fill: '#10b981' },
    { name: 'Giderler', Tutarlı: totalExpense, Ödenen: paidExpense, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6 pb-24 pt-3 px-4 max-w-md mx-auto">
      {/* Primary Net Liquid Wealth Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <p className="text-zinc-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-amber-400" /> TOPLAM LİKİT VARLIK
          </p>
          <span className="bg-amber-400/10 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/20">
            Likit Bakiye
          </span>
        </div>

        <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
          {formatCurrency(netLiquidBalance, symbol)}
        </h2>
        <p className="text-zinc-500 text-[11px] mb-5 uppercase tracking-widest">
          BANKA & KART BAKİYELERİ DAHİL
        </p>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800 text-xs mb-4">
          <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/50">
            <span className="text-zinc-400 text-[10px] uppercase block">Banka Nakiti</span>
            <span className="text-emerald-400 font-bold text-sm">{formatCurrency(totalBankBalance, symbol)}</span>
          </div>
          <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/50">
            <span className="text-zinc-400 text-[10px] uppercase block">Kart Borcu</span>
            <span className="text-rose-400 font-bold text-sm">{formatCurrency(totalCardDebt, symbol)}</span>
          </div>
        </div>

        {/* Action Buttons in Wealth Card */}
        <div className="flex gap-3">
          <button
            onClick={() => onNavigateTab('income')}
            className="flex-1 h-11 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold rounded-xl active:scale-95 text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <TrendingUp className="w-4 h-4" /> Gelir Ekle
          </button>
          <button
            onClick={() => onNavigateTab('accounts')}
            className="flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl active:scale-95 text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all border border-zinc-700/50"
          >
            <Wallet className="w-4 h-4 text-amber-400" /> Hesaplar
          </button>
        </div>

        {/* Separate Investments Banner */}
        <div
          onClick={() => onNavigateTab('savings')}
          className="mt-4 p-3.5 rounded-2xl bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-800 flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/20">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Ayrı Birikim & Yatırım</p>
              <p className="text-sm font-bold text-white">{formatCurrency(totalInvestmentValue, symbol)}</p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-bold hover:underline">Detay →</span>
        </div>
      </div>

      {/* Monthly Budget Progress Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200">Aylık Bütçe Dengesi</h3>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              monthlyBalance >= 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {monthlyBalance >= 0 ? '+' : ''}
            {formatCurrency(monthlyBalance, symbol)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/50">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Toplam Gelir</span>
            </div>
            <p className="text-lg font-bold text-white">{formatCurrency(totalIncome, symbol)}</p>
            <p className="text-[10px] text-zinc-500 mt-1">Tahsil Edilen: {formatCurrency(receivedIncome, symbol)}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/50">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Toplam Gider</span>
            </div>
            <p className="text-lg font-bold text-white">{formatCurrency(totalExpense, symbol)}</p>
            <p className="text-[10px] text-zinc-500 mt-1">Ödenen: {formatCurrency(paidExpense, symbol)}</p>
          </div>
        </div>
      </div>

      {/* Expense Category Breakdown Chart */}
      {pieChartData.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-400" /> Gider Dağılımı
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">Bu Ay</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val), symbol)}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', borderColor: '#27272a', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pieChartData.map((item) => (
              <span
                key={item.name}
                className="text-[11px] font-medium px-2.5 py-1 rounded-xl text-zinc-300 bg-zinc-950/60 border border-zinc-800 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}: {formatCurrency(item.value, symbol)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Income vs Expense Bar Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" /> Gelir - Gider Karşılaştırması
        </h3>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={10} />
              <Tooltip
                formatter={(val: any) => formatCurrency(Number(val), symbol)}
                contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', borderColor: '#27272a', color: '#fff' }}
              />
              <Bar dataKey="Tutarlı" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming & Pending Items Preview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200">Yaklaşan İşlemler</h3>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            Takvim →
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Pending Expenses */}
          {appState.expenses
            .filter((e) => e.status === 'unpaid')
            .slice(0, 3)
            .map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-100">{exp.title}</p>
                    <p className="text-[10px] text-zinc-500">Son Ödeme: {formatDateTR(exp.dueDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-rose-400">{formatCurrency(exp.amount, symbol)}</p>
                  <button
                    onClick={() => onToggleExpenseStatus(exp.id)}
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    Öde Yap ✓
                  </button>
                </div>
              </div>
            ))}

          {/* Pending Incomes */}
          {appState.incomes
            .filter((i) => i.status === 'pending')
            .slice(0, 2)
            .map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-100">{inc.title}</p>
                    <p className="text-[10px] text-zinc-500">Tarih: {formatDateTR(inc.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-emerald-400">{formatCurrency(inc.amount, symbol)}</p>
                  <button
                    onClick={() => onToggleIncomeStatus(inc.id)}
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    Tahsil Et ✓
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
