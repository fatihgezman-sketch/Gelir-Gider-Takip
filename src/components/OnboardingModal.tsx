import React, { useState } from 'react';
import { Wallet, Shield, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Currency } from '../types';
import { CURRENCY_SYMBOLS } from '../utils/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (currency: Currency, authMethod: 'google' | 'guest', loadDemo: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('TRY');
  const [selectedAuth, setSelectedAuth] = useState<'google' | 'guest'>('guest');
  const [loadDemoData, setLoadDemoData] = useState<boolean>(true);

  if (!isOpen) return null;

  const currencies: { code: Currency; label: string }[] = [
    { code: 'TRY', label: 'Türk Lirası (₺)' },
    { code: 'USD', label: 'Amerikan Doları ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'İngiliz Sterlini (£)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header Hero */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/20 p-1 flex items-center justify-center mb-4">
            <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center text-amber-400">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            PayBee'ye Hoş Geldiniz! 🐝
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Kişisel finans, varlık, banka hesapları ve kartlarınızı tek bir güvenli, mobil PWA uygulamasında yönetin.
          </p>
        </div>

        {/* Currency Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            1. Ana Para Birimi Seçin
          </label>
          <div className="grid grid-cols-2 gap-2">
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCurrency(c.code)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedCurrency === c.code
                    ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="text-sm">{c.label}</span>
                <span className="text-amber-400 font-bold">{CURRENCY_SYMBOLS[c.code]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auth Method */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            2. Oturum ve Senkronizasyon Modu
          </label>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedAuth('google')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                selectedAuth === 'google'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-100">Google Drive ile Bağlan</span>
                  {selectedAuth === 'google' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Verileriniz Google Drive özel klasörünüzde otomatik yedeklenir.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAuth('guest')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                selectedAuth === 'guest'
                  ? 'border-amber-400 bg-amber-400/10 text-white'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-100">Misafir Olarak Devam Et</span>
                  {selectedAuth === 'guest' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Veriler yerel cihazınızda saklanır. İstediğiniz zaman JSON indirebilir veya Google Drive bağlayabilirsiniz.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Demo Data Switch */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-200">Örnek Veriler İle Başla</p>
              <p className="text-[10px] text-zinc-400">Örnek banka hesapları, kartlar ve harcamalar eklenir</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={loadDemoData}
            onChange={(e) => setLoadDemoData(e.target.checked)}
            className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={() => onComplete(selectedCurrency, selectedAuth, loadDemoData)}
          className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all mt-1"
          id="onboarding-start-btn"
        >
          <span>Uygulamaya Başla</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
