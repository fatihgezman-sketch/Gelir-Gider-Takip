import React, { useState } from 'react';
import {
  Building2,
  CreditCard as CardIcon,
  Plus,
  Copy,
  Check,
  ArrowLeftRight,
  Trash2,
  X,
  Wallet,
  ShieldAlert,
} from 'lucide-react';
import { BankAccount, CreditCard, Currency } from '../../types';
import { formatCurrency, formatIBAN } from '../../utils/storage';

interface AccountsTabProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  onAddAccount: (acc: Omit<BankAccount, 'id'>) => void;
  onDeleteAccount: (id: string) => void;
  onAddCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  onDeleteCreditCard: (id: string) => void;
  onOpenTransferModal: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  currencySymbol: string;
}

const CARD_COLORS = [
  { name: 'Yeşil / Teall', class: 'from-emerald-600 to-teal-800' },
  { name: 'Lacivert / Mavi', class: 'from-indigo-600 to-blue-800' },
  { name: 'Mor / Gece', class: 'from-purple-600 to-indigo-900' },
  { name: 'Kırmızı / Gül', class: 'from-rose-600 to-pink-800' },
  { name: 'Kehribar / Turuncu', class: 'from-amber-600 to-orange-800' },
  { name: 'Siyah / Karbon', class: 'from-slate-800 to-slate-950' },
];

export const AccountsTab: React.FC<AccountsTabProps> = ({
  accounts,
  creditCards,
  onAddAccount,
  onDeleteAccount,
  onAddCreditCard,
  onDeleteCreditCard,
  onOpenTransferModal,
  onShowToast,
  currencySymbol,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'cards'>('accounts');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [copiedIbanId, setCopiedIbanId] = useState<string | null>(null);

  // Bank Account Form State
  const [bankName, setBankName] = useState('Garanti BBVA');
  const [accountAlias, setAccountAlias] = useState('');
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>('TRY');
  const [iban, setIban] = useState('');
  const [description, setDescription] = useState('');

  // Credit Card Form State
  const [cardName, setCardName] = useState('');
  const [cardBankName, setCardBankName] = useState('Garanti BBVA');
  const [lastFourDigits, setLastFourDigits] = useState('1234');
  const [statementDay, setStatementDay] = useState<number>(15);
  const [dueDate, setDueDate] = useState<number>(25);
  const [limit, setLimit] = useState<number>(50000);
  const [currentDebt, setCurrentDebt] = useState<number>(0);
  const [cardColor, setCardColor] = useState(CARD_COLORS[0].class);

  // Copy IBAN Handler
  const handleCopyIBAN = (ibanStr: string, accId: string) => {
    if (!ibanStr) return;
    navigator.clipboard.writeText(ibanStr.replace(/\s+/g, ''));
    setCopiedIbanId(accId);
    onShowToast('IBAN numarası panoya kopyalandı! 📋', 'success');
    setTimeout(() => setCopiedIbanId(null), 2500);
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountAlias) return;

    onAddAccount({
      bankName,
      accountAlias,
      initialBalance,
      currentBalance: initialBalance,
      currency,
      iban,
      description,
    });

    setAccountAlias('');
    setInitialBalance(0);
    setIban('');
    setDescription('');
    setIsAccountModalOpen(false);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardBankName) return;

    onAddCreditCard({
      cardName,
      bankName: cardBankName,
      lastFourDigits,
      statementDay,
      dueDate,
      limit,
      currentDebt,
      cardColor,
    });

    setCardName('');
    setCurrentDebt(0);
    setIsCardModalOpen(false);
  };

  const totalBankCash = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalCardDebt = creditCards.reduce((sum, c) => sum + c.currentDebt, 0);

  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto">
      {/* Transfer Bar Banner */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-amber-400" /> Hesaplar Arası Transfer
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">Banka hesaplarınız arasında para aktarımı yapın.</p>
        </div>
        <button
          onClick={onOpenTransferModal}
          className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-xs shrink-0 shadow-md active:scale-95 transition-all"
        >
          Transfer Et
        </button>
      </div>

      {/* Sub Tabs Selector */}
      <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('accounts')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'accounts'
              ? 'bg-amber-400 text-zinc-900 font-bold shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Banka Hesapları ({accounts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('cards')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'cards'
              ? 'bg-amber-400 text-zinc-900 font-bold shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <CardIcon className="w-4 h-4" /> Kredi Kartları ({creditCards.length})
        </button>
      </div>

      {/* Accounts Sub-tab */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">
              Toplam Bakiye: <strong className="text-emerald-400 font-bold">{formatCurrency(totalBankCash, currencySymbol)}</strong>
            </span>
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Hesap Ekle
            </button>
          </div>

          <div className="space-y-2.5">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-2.5 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">{acc.bankName}</h4>
                      <p className="text-[11px] text-zinc-400 font-semibold">{acc.accountAlias}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-emerald-400">
                      {formatCurrency(acc.currentBalance, currencySymbol)}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-bold">{acc.currency}</span>
                  </div>
                </div>

                {/* IBAN Row */}
                {acc.iban && (
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-zinc-400 block font-bold">IBAN</span>
                      <code className="text-zinc-200 font-mono text-[11px]">{formatIBAN(acc.iban)}</code>
                    </div>
                    <button
                      onClick={() => handleCopyIBAN(acc.iban!, acc.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-[11px] font-bold shrink-0 flex items-center gap-1 transition-colors border border-amber-400/20"
                    >
                      {copiedIbanId === acc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> IBAN Kopyala
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800">
                  <span className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                    {acc.description || 'Açıklama yok'}
                  </span>
                  <button
                    onClick={() => onDeleteAccount(acc.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credit Cards Sub-tab */}
      {activeSubTab === 'cards' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">
              Toplam Kart Borcu: <strong className="text-rose-400 font-bold">{formatCurrency(totalCardDebt, currencySymbol)}</strong>
            </span>
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Kart Ekle
            </button>
          </div>

          <div className="space-y-3">
            {creditCards.map((card) => {
              const availableLimit = Math.max(0, card.limit - card.currentDebt);

              return (
                <div
                  key={card.id}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${card.cardColor} text-white shadow-xl space-y-3 relative overflow-hidden border border-white/10`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">{card.bankName}</p>
                      <h4 className="text-base font-bold tracking-tight">{card.cardName}</h4>
                    </div>
                    <CardIcon className="w-6 h-6 text-white/80" />
                  </div>

                  <p className="font-mono text-sm tracking-widest text-white/90">
                    •••• •••• •••• {card.lastFourDigits}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/20 pt-2.5">
                    <div>
                      <span className="text-[10px] text-white/70 block">Güncel Borç</span>
                      <strong className="text-sm font-bold text-rose-200">
                        {formatCurrency(card.currentDebt, currencySymbol)}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-white/70 block">Kullanılabilir Limit</span>
                      <strong className="text-xs font-bold text-emerald-200">
                        {formatCurrency(availableLimit, currencySymbol)} / {formatCurrency(card.limit, currencySymbol)}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-white/80 pt-1">
                    <span>Kesim Günü: {card.statementDay}. gün</span>
                    <span>Son Ödeme: {card.dueDate}. gün</span>
                    <button
                      onClick={() => onDeleteCreditCard(card.id)}
                      className="text-white/60 hover:text-white p-1"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" /> Banka Hesabı Ekle
              </h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-300">Banka Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Garanti BBVA, İş Bankası vb."
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">Hesap Takma Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Maaş Hesabı, Birikim Hesabı"
                  value={accountAlias}
                  onChange={(e) => setAccountAlias(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Açılış Bakiyesi ({currencySymbol})</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0"
                    value={initialBalance || ''}
                    onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold text-sm focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Para Birimi</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold focus:outline-none focus:border-amber-400 mt-1"
                  >
                    <option value="TRY">TL (₺)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">IBAN Numarası (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">Açıklama</label>
                <input
                  type="text"
                  placeholder="Hesap amacı / not"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm shadow-md active:scale-98 transition-transform mt-2"
              >
                Hesabı Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Credit Card Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CardIcon className="w-4 h-4 text-amber-400" /> Kredi Kartı Ekle
              </h3>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCardSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-300">Kart Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Bonus Flexi, Maximum Black"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Banka</label>
                  <input
                    type="text"
                    required
                    value={cardBankName}
                    onChange={(e) => setCardBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Son 4 Hane</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={lastFourDigits}
                    onChange={(e) => setLastFourDigits(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-xs focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Kesim Günü (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={statementDay}
                    onChange={(e) => setStatementDay(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Son Ödeme Günü</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Kart Limiti ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    value={limit || ''}
                    onChange={(e) => setLimit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold text-sm focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Mevcut Borç ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    value={currentDebt || ''}
                    onChange={(e) => setCurrentDebt(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-rose-400 font-bold text-sm focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>
              </div>

              {/* Theme Color selector */}
              <div>
                <label className="text-xs font-bold text-zinc-300">Kart Görsel Rengi</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {CARD_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setCardColor(c.class)}
                      className={`h-8 rounded-xl bg-gradient-to-r ${c.class} border-2 ${
                        cardColor === c.class ? 'border-amber-400 scale-105' : 'border-transparent'
                      } transition-all`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm shadow-md active:scale-98 transition-transform mt-2"
              >
                Kartı Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
