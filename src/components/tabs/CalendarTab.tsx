import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, TrendingDown, CheckCircle2, Clock } from 'lucide-react';
import { ExpenseItem, IncomeItem } from '../../types';
import { formatCurrency, formatDateTR } from '../../utils/storage';

interface CalendarTabProps {
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  onToggleIncomeStatus: (id: string) => void;
  onToggleExpenseStatus: (id: string) => void;
  currencySymbol: string;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  incomes,
  expenses,
  onToggleIncomeStatus,
  onToggleExpenseStatus,
  currencySymbol,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayString, setSelectedDayString] = useState<string | null>(
    new Date().toISOString().slice(0, 10)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDayIndex = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(currentDate);

  const eventsByDate: Record<string, { incomes: IncomeItem[]; expenses: ExpenseItem[] }> = {};

  incomes.forEach((inc) => {
    if (!eventsByDate[inc.date]) {
      eventsByDate[inc.date] = { incomes: [], expenses: [] };
    }
    eventsByDate[inc.date].incomes.push(inc);
  });

  expenses.forEach((exp) => {
    if (!eventsByDate[exp.dueDate]) {
      eventsByDate[exp.dueDate] = { incomes: [], expenses: [] };
    }
    eventsByDate[exp.dueDate].expenses.push(exp);
  });

  const selectedDayEvents = selectedDayString ? eventsByDate[selectedDayString] : null;

  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto">
      {/* Month Header Navigation */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-base font-bold text-white capitalize">{monthName}</h3>
          <p className="text-[10px] text-zinc-400">Aylık Finansal Takvim</p>
        </div>

        <button
          onClick={handleNextMonth}
          className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid Card */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-3">
        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-zinc-400">
          <span>Pzt</span>
          <span>Sal</span>
          <span>Çar</span>
          <span>Per</span>
          <span>Cum</span>
          <span>Cmt</span>
          <span>Paz</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-11 rounded-xl bg-zinc-950/20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateKey = `${year}-${monthStr}-${dayStr}`;

            const dayEvents = eventsByDate[dateKey];
            const isSelected = selectedDayString === dateKey;
            const isToday = new Date().toISOString().slice(0, 10) === dateKey;

            const hasIncomes = dayEvents?.incomes.length > 0;
            const hasExpenses = dayEvents?.expenses.length > 0;

            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDayString(dateKey)}
                className={`h-12 rounded-xl flex flex-col items-center justify-between p-1 transition-all border ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 text-white font-bold ring-2 ring-amber-400/30'
                    : isToday
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs">{dayNum}</span>

                <div className="flex items-center gap-0.5 min-h-[6px]">
                  {hasIncomes && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  {hasExpenses && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-400 pt-2 border-t border-zinc-800">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Beklenen Gelir
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Son Ödeme / Gider
          </span>
        </div>
      </div>

      {/* Selected Day Events Card */}
      {selectedDayString && (
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-zinc-200 flex items-center justify-between">
            <span>📅 {formatDateTR(selectedDayString)} Etkinlikleri</span>
            <span className="text-[10px] text-zinc-400">
              {(selectedDayEvents?.incomes.length || 0) + (selectedDayEvents?.expenses.length || 0)} İşlem
            </span>
          </h4>

          {!selectedDayEvents ||
          (selectedDayEvents.incomes.length === 0 && selectedDayEvents.expenses.length === 0) ? (
            <p className="text-xs text-zinc-500 text-center py-4">Bu tarihte planlanmış ödeme veya gelir bulunmuyor.</p>
          ) : (
            <div className="space-y-2">
              {selectedDayEvents.incomes.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-100">{inc.title}</p>
                      <p className="text-[10px] text-zinc-400">{inc.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">{formatCurrency(inc.amount, currencySymbol)}</p>
                    <button
                      onClick={() => onToggleIncomeStatus(inc.id)}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      {inc.status === 'received' ? '✓ Alındı' : 'Tahsil Et'}
                    </button>
                  </div>
                </div>
              ))}

              {selectedDayEvents.expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-100">{exp.title}</p>
                      <p className="text-[10px] text-zinc-400">{exp.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-400">{formatCurrency(exp.amount, currencySymbol)}</p>
                    <button
                      onClick={() => onToggleExpenseStatus(exp.id)}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      {exp.status === 'paid' ? '✓ Ödendi' : 'Öde Yap'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
