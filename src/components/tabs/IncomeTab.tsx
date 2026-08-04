import React, { useState } from 'react';
import { Plus, TrendingUp, CheckCircle2, Clock, Trash2, Calendar, Wallet, Filter, X } from 'lucide-react';
import { BankAccount, IncomeCategory, IncomeItem } from '../../types';
import { formatCurrency, formatDateTR } from '../../utils/storage';

interface IncomeTabProps {
  incomes: IncomeItem[];
  accounts: BankAccount[];
  onAddIncome: (item: Omit<IncomeItem, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  onToggleIncomeStatus: (id: string) => void;
  currencySymbol: string;
}

const CATEGORIES: IncomeCategory[] = [
  'Maaş',
  'Yan Gelir',
  'Prim/Bonus',
  'Yatırım/Kâr',
  'Kira Geliri',
  'Diğer',
];

export const IncomeTab: React.FC<IncomeTabProps> = ({
  incomes,
  accounts,
  onAddIncome,
  onDeleteIncome,
  onToggleIncomeStatus,
  currencySymbol,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'received' | 'pending'>('all');

  // New Income Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<IncomeCategory>('Maaş');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<'received' | 'pending'>('received');
  const [targetAccountId, setTargetAccountId] = useState<string>(accounts[0]?.id || '');
  const [note, setNote] = useState('');

  const filteredIncomes = incomes.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
  const receivedTotal = incomes.filter((i) => i.status === 'received').reduce((sum, i) => sum + i.amount, 0);
  const pendingTotal = incomes.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    onAddIncome({
      title,
      amount,
      category,
      date,
      status,
      targetAccountId,
      note,
    });

    // Reset Form
    setTitle('');
    setAmount(0);
    setNote('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto">
      {/* Summary Header Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tahsil Edilen</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">{formatCurrency(receivedTotal, currencySymbol)}</p>
        </div>

        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bekleyen Gelir</span>
          <p className="text-xl font-bold text-amber-400 mt-1">{formatCurrency(pendingTotal, currencySymbol)}</p>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex items-center justify-between gap-2">
        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-2xl border border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              statusFilter === 'all' ? 'bg-amber-400 text-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tümü ({incomes.length})
          </button>
          <button
            onClick={() => setStatusFilter('received')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              statusFilter === 'received' ? 'bg-emerald-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Alındı
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              statusFilter === 'pending' ? 'bg-amber-500 text-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bekleyen
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Gelir Ekle
        </button>
      </div>

      {/* Income Items List */}
      <div className="space-y-2.5">
        {filteredIncomes.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-zinc-900/50 border border-zinc-800 text-zinc-400">
            <TrendingUp className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm font-bold text-zinc-300">Henüz kaydedilmiş gelir bulunmuyor</p>
            <p className="text-xs text-zinc-500 mt-1">"Gelir Ekle" butonuna basarak yeni gelir ekleyebilirsiniz.</p>
          </div>
        ) : (
          filteredIncomes.map((item) => {
            const isReceived = item.status === 'received';
            const targetAcc = accounts.find((a) => a.id === item.targetAccountId);

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md flex items-center justify-between gap-3 transition-all hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isReceived ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-zinc-100">{item.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                      <span>{formatDateTR(item.date)}</span>
                      {targetAcc && <span>• {targetAcc.accountAlias}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-emerald-400">{formatCurrency(item.amount, currencySymbol)}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <button
                      onClick={() => onToggleIncomeStatus(item.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                        isReceived
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                    >
                      {isReceived ? '✓ Alındı' : '⏳ Bekliyor'}
                    </button>
                    <button
                      onClick={() => onDeleteIncome(item.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Income Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Yeni Gelir Kaydı
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-300">Gelir Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Aylık Maaş, Proje Hakedişi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Tutar ({currencySymbol})</label>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    placeholder="0"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold text-base focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IncomeCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold focus:outline-none focus:border-amber-400 mt-1"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Tarih</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Durum</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold focus:outline-none focus:border-amber-400 mt-1"
                  >
                    <option value="received">Alındı (Hesaba Ekle)</option>
                    <option value="pending">Bekliyor (Tahsil Edilecek)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">Aktarılacak Banka Hesabı</label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold focus:outline-none focus:border-amber-400 mt-1"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} - {acc.accountAlias} ({formatCurrency(acc.currentBalance, currencySymbol)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">Not (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Ek açıklama"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm shadow-md active:scale-98 transition-transform mt-2"
              >
                Gelir Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
