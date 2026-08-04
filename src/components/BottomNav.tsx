import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Building2,
  CalendarDays,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  pendingIncomesCount: number;
  unpaidExpensesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  pendingIncomesCount,
  unpaidExpensesCount,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Ana Sayfa',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: 'income' as ActiveTab,
      label: 'Gelir',
      icon: TrendingUp,
      badge: pendingIncomesCount,
      badgeColor: 'bg-emerald-500',
    },
    {
      id: 'expense' as ActiveTab,
      label: 'Gider',
      icon: TrendingDown,
      badge: unpaidExpensesCount,
      badgeColor: 'bg-rose-500',
    },
    {
      id: 'savings' as ActiveTab,
      label: 'Birikim',
      icon: PiggyBank,
      badge: 0,
    },
    {
      id: 'accounts' as ActiveTab,
      label: 'Hesaplar',
      icon: Building2,
      badge: 0,
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'Takvim',
      icon: CalendarDays,
      badge: 0,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/90 dark:bg-[#09090b]/90 light:bg-white/95 backdrop-blur-md border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200 py-2 px-3 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-6 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-500 hover:text-zinc-200'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2 text-[10px] font-bold text-white px-1 py-0.2 rounded-full min-w-[16px] h-[16px] flex items-center justify-center border border-zinc-900 ${
                      tab.badgeColor || 'bg-amber-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
