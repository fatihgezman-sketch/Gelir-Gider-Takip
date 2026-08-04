import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeftRight, Building2 } from 'lucide-react';
import { BankAccount } from '../types';
import { formatCurrency } from '../utils/storage';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onConfirmTransfer: (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    fee: number,
    note: string
  ) => void;
  currencySymbol: string;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onConfirmTransfer,
  currencySymbol,
}) => {
  if (!isOpen) return null;

  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || accounts[0]?.id || '');
  const [amount, setAmount] = useState<number>(1000);
  const [transferFee, setTransferFee] = useState<number>(0);
  const [note, setNote] = useState<string>('Hesaplar arası bakiye aktarımı');

  const fromAccount = accounts.find((a) => a.id === fromAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId) return;
    if (fromAccountId === toAccountId) {
      alert('Lütfen farklı iki hesap seçiniz!');
      return;
    }
    if (amount <= 0) return;

    onConfirmTransfer(fromAccountId, toAccountId, amount, transferFee, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hesaplar Arası Transfer</h3>
              <p className="text-[11px] text-zinc-400">Genel bütçeyi etkilemeyen nötr bakiye hareketi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Account (A) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Gönderen Hesap (A)</span>
              {fromAccount && (
                <span className="text-[11px] text-emerald-400 font-normal">
                  Bakiye: {formatCurrency(fromAccount.currentBalance, currencySymbol)}
                </span>
              )}
            </label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.bankName} - {acc.accountAlias} ({formatCurrency(acc.currentBalance, currencySymbol)})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Account (B) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">Alıcı Hesap (B)</label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} disabled={acc.id === fromAccountId}>
                  {acc.bankName} - {acc.accountAlias} ({formatCurrency(acc.currentBalance, currencySymbol)})
                </option>
              ))}
            </select>
          </div>

          {/* Transfer Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">Transfer Tutarı ({currencySymbol})</label>
            <input
              type="number"
              step="any"
              min="1"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 font-bold text-lg focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Transfer Fee / Commission */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Transfer Ücreti / Komisyon (Opsiyonel)</span>
              <span className="text-[10px] text-zinc-400 font-normal">Gider olarak eklenir</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={transferFee}
              onChange={(e) => setTransferFee(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-rose-400 font-bold text-sm focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">Açıklama / Not</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Açıklama ekleyin"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all mt-2"
          >
            <span>Transferi Tamamla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
