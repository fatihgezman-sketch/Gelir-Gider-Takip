import React, { useState } from 'react';
import {
  Plus,
  PiggyBank,
  Coins,
  TrendingUp,
  DollarSign,
  Building,
  Car,
  Layers,
  ArrowRightLeft,
  Trash2,
  X,
  Edit2,
} from 'lucide-react';
import { InvestmentCategory, InvestmentItem } from '../../types';
import { formatCurrency } from '../../utils/storage';

interface SavingsTabProps {
  investments: InvestmentItem[];
  onAddInvestment: (item: Omit<InvestmentItem, 'id' | 'updatedAt'>) => void;
  onUpdateInvestment: (item: InvestmentItem) => void;
  onDeleteInvestment: (id: string) => void;
  onOpenCashOutModal: (investment: InvestmentItem) => void;
  currencySymbol: string;
}

const CATEGORIES: { name: InvestmentCategory; icon: string; bg: string }[] = [
  { name: 'Altın', icon: '🥇', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { name: 'Nakit', icon: '💵', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { name: 'Gümüş', icon: '🥈', bg: 'bg-slate-400/10 text-slate-300 border-slate-400/20' },
  { name: 'Hisse/Fon', icon: '📈', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { name: 'Kripto', icon: '🪙', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Gayrimenkul', icon: '🏠', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { name: 'Araç', icon: '🚗', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { name: 'Diğer', icon: '💎', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
];

export const SavingsTab: React.FC<SavingsTabProps> = ({
  investments,
  onAddInvestment,
  onUpdateInvestment,
  onDeleteInvestment,
  onOpenCashOutModal,
  currencySymbol,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Add form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<InvestmentCategory>('Altın');
  const [unit, setUnit] = useState('gram');
  const [quantity, setQuantity] = useState<number>(10);
  const [purchasePricePerUnit, setPurchasePricePerUnit] = useState<number>(3000);
  const [currentPricePerUnit, setCurrentPricePerUnit] = useState<number>(3200);
  const [note, setNote] = useState('');

  const filteredInvestments = investments.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const totalPortfolioValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPricePerUnit,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || quantity <= 0) return;

    onAddInvestment({
      title,
      category,
      unit,
      quantity,
      purchasePricePerUnit,
      currentPricePerUnit,
      note,
    });

    setTitle('');
    setQuantity(0);
    setNote('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto">
      {/* Portfolio Total Highlight Card */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-amber-400" /> Birikim & Yatırım Portföyü
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
            Ayrı Bütçe
          </span>
        </div>
        <p className="text-3xl font-bold text-white">{formatCurrency(totalPortfolioValue, currencySymbol)}</p>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          * Birikimleriniz likit banka bakiyesinden ayrı tutulur. Gerektiğinde "Bozdur / Hesaba Aktar" seçeneğiyle doğrudan vadesiz hesabınıza nakit aktarabilirsiniz.
        </p>
      </div>

      {/* Category Filter Pills & Add Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs font-bold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-zinc-900 font-bold'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            Tümü ({investments.length})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1 ${
                selectedCategory === c.name
                  ? 'bg-amber-400 text-zinc-900 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Varlık Ekle
        </button>
      </div>

      {/* Investment Items List */}
      <div className="space-y-3">
        {filteredInvestments.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-zinc-900/50 border border-zinc-800 text-zinc-400">
            <PiggyBank className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm font-bold text-zinc-300">Seçili kategoride birikim kaydı bulunamadı</p>
            <p className="text-xs text-zinc-500 mt-1">"Varlık Ekle" butonuna basarak Altın, Fon, Döviz veya Kripto ekleyin.</p>
          </div>
        ) : (
          filteredInvestments.map((inv) => {
            const currentValue = inv.quantity * inv.currentPricePerUnit;
            const catMeta = CATEGORIES.find((c) => c.name === inv.category) || CATEGORIES[7];

            return (
              <div
                key={inv.id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{catMeta.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">{inv.title}</h4>
                      <p className="text-[11px] text-zinc-400 font-semibold">
                        {inv.quantity} {inv.unit} • Birim: {formatCurrency(inv.currentPricePerUnit, currencySymbol)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-amber-400">
                      {formatCurrency(currentValue, currencySymbol)}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${catMeta.bg}`}>
                      {inv.category}
                    </span>
                  </div>
                </div>

                {/* Actions: Bozdur / Hesaba Aktar + Delete */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <button
                    onClick={() => onOpenCashOutModal(inv)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" /> Bozdur / Hesaba Aktar
                  </button>

                  <button
                    onClick={() => onDeleteInvestment(inv.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Investment Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-amber-400" /> Yeni Birikim / Varlık Ekle
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
                <label className="text-xs font-bold text-zinc-300">Varlık / Birikim Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 24 Ayar Gram Altın, THYAO Hisse, BTC"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InvestmentCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold focus:outline-none focus:border-amber-400 mt-1"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Birim (gram/lot/adet)</label>
                  <input
                    type="text"
                    required
                    placeholder="gram, lot, adet..."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Miktar / Adet</label>
                  <input
                    type="number"
                    step="any"
                    min="0.0001"
                    required
                    placeholder="0"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 font-bold text-sm focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Güncel Birim Fiyat ({currencySymbol})</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="0"
                    value={currentPricePerUnit || ''}
                    onChange={(e) => setCurrentPricePerUnit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold text-sm focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">Açıklama / Not</label>
                <input
                  type="text"
                  placeholder="Kasa no, hesap ayrıntısı vb."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm shadow-md active:scale-98 transition-transform mt-2"
              >
                Varlık Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
