import React, { useState } from 'react';
import { X, ArrowRight, Wallet, DollarSign } from 'lucide-react';
import { BankAccount, InvestmentItem } from '../types';
import { formatCurrency } from '../utils/storage';

interface CashOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: InvestmentItem | null;
  accounts: BankAccount[];
  onConfirmCashOut: (
    investmentId: string,
    sellQuantity: number,
    cashReceived: number,
    targetAccountId: string
  ) => void;
  currencySymbol: string;
}

export const CashOutModal: React.FC<CashOutModalProps> = ({
  isOpen,
  onClose,
  investment,
  accounts,
  onConfirmCashOut,
  currencySymbol,
}) => {
  if (!isOpen || !investment) return null;

  const [sellQuantity, setSellQuantity] = useState<number>(Math.min(10, investment.quantity));
  const [cashReceived, setCashReceived] = useState<number>(
    Math.round(sellQuantity * investment.currentPricePerUnit)
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');

  const handleQuantityChange = (val: number) => {
    const q = Math.max(0.01, Math.min(val, investment.quantity));
    setSellQuantity(q);
    setCashReceived(Math.round(q * investment.currentPricePerUnit));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellQuantity <= 0 || sellQuantity > investment.quantity) return;
    if (cashReceived <= 0) return;
    if (!selectedAccountId) return;

    onConfirmCashOut(investment.id, sellQuantity, cashReceived, selectedAccountId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
              💰
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bozdur & Hesaba Aktar</h3>
              <p className="text-[11px] text-zinc-400">{investment.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Asset Info */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Mevcut Birikim</span>
            <p className="text-sm font-bold text-amber-400">
              {investment.quantity} {investment.unit}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Birim Fiyat</span>
            <p className="text-sm font-bold text-zinc-200">
              {formatCurrency(investment.currentPricePerUnit, currencySymbol)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sell Quantity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Bozdurulacak Miktar ({investment.unit})</span>
              <span className="text-[10px] text-amber-400 font-normal">
                Maksimum: {investment.quantity} {investment.unit}
              </span>
            </label>
            <input
              type="number"
              step="any"
              min="0.0001"
              max={investment.quantity}
              value={sellQuantity}
              onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Cash Received Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Elde Edilecek Nakit Tutarı ({currencySymbol})
            </label>
            <input
              type="number"
              step="any"
              min="1"
              value={cashReceived}
              onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold text-lg focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-zinc-400">
              * Bu tutar seçtiğiniz banka hesabınızın bakiyesine eklenecektir.
            </p>
          </div>

          {/* Target Bank Account */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-cyan-400" />
              Aktarılacak Banka Hesabı
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
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

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all mt-2"
          >
            <span>Bozdur ve Bakiyeye Ekle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
