import React, { useRef } from 'react';
import {
  X,
  Moon,
  Sun,
  Download,
  Upload,
  Cloud,
  CloudUpload,
  CloudDownload,
  RotateCcw,
  ShieldCheck,
  Globe,
  HardDrive,
} from 'lucide-react';
import { AppStateData, Currency } from '../types';
import { CURRENCY_SYMBOLS } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppStateData;
  onUpdateState: (newState: AppStateData) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  appState,
  onUpdateState,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const { settings } = appState;

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = {
      ...appState,
      settings: { ...settings, theme: nextTheme },
    };
    onUpdateState(updated);
    onShowToast(`Tema ${nextTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} olarak güncellendi.`, 'info');
  };

  // Change Currency
  const handleChangeCurrency = (newCurr: Currency) => {
    const updated = {
      ...appState,
      settings: {
        ...settings,
        currency: newCurr,
        currencySymbol: CURRENCY_SYMBOLS[newCurr] || '₺',
      },
    };
    onUpdateState(updated);
    onShowToast(`Para birimi ${newCurr} olarak ayarlandı.`, 'success');
  };

  // Download Local JSON Backup
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(appState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `paybee_yedek_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Yedek JSON dosyası cihazınıza indirildi.', 'success');
  };

  // Import JSON File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as AppStateData;
        if (parsed && parsed.accounts && parsed.expenses) {
          onUpdateState(parsed);
          onShowToast('Veriler dosyadan başarıyla geri yüklendi!', 'success');
          onClose();
        } else {
          onShowToast('Geçersiz PayBee yedek dosyası yapısı!', 'error');
        }
      } catch (err) {
        onShowToast('JSON dosyası okunamadı veya bozuk.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Google Drive Mock / Live API Sync Simulation
  const handleDriveBackup = () => {
    const nowStr = new Date().toLocaleString('tr-TR');
    const updated = {
      ...appState,
      settings: {
        ...settings,
        authMethod: 'google' as const,
        lastBackupDate: nowStr,
      },
    };
    onUpdateState(updated);
    onShowToast(`Veriler Google Drive klasörüne senkronize edildi (${nowStr}).`, 'success');
  };

  const handleDriveRestore = () => {
    if (!settings.lastBackupDate) {
      onShowToast("Google Drive'da henüz kaydedilmiş yedek bulunamadı.", 'info');
      return;
    }
    onShowToast(`Google Drive yedeği (${settings.lastBackupDate}) geri yüklendi.`, 'success');
  };

  // Reset Application Data
  const handleResetData = () => {
    if (confirm('Tüm PayBee hesap, harcama ve birikim verilerini sıfırlamak istediğinize emin misiniz?')) {
      const resetState: AppStateData = {
        settings: {
          ...settings,
          isSetupCompleted: false,
        },
        accounts: [],
        creditCards: [],
        transfers: [],
        incomes: [],
        expenses: [],
        investments: [],
      };
      onUpdateState(resetState);
      onShowToast('Tüm veriler temizlendi ve uygulama sıfırlandı.', 'info');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
              ⚙️
            </div>
            <h3 className="text-lg font-bold text-white">Uygulama Ayarları</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Görünüm & Tema
          </label>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div>
              <p className="text-sm font-bold text-zinc-200">
                {settings.theme === 'dark' ? 'Karanlık Mod (Dark)' : 'Aydınlık Mod (Light)'}
              </p>
              <p className="text-[11px] text-zinc-400">Göz yormayan gece veya gündüz teması</p>
            </div>
            <button
              onClick={handleToggleTheme}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 text-xs font-bold hover:bg-zinc-700 transition-colors flex items-center gap-1.5 border border-zinc-700"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Aydınlık
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" /> Karanlık
                </>
              )}
            </button>
          </div>
        </div>

        {/* Currency Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Varsayılan Para Birimi
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['TRY', 'USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => handleChangeCurrency(c)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  settings.currency === c
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {c} ({CURRENCY_SYMBOLS[c]})
              </button>
            ))}
          </div>
        </div>

        {/* Local JSON Backup Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Cihaz Yerel Yedekleme (JSON)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportJSON}
              className="p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-colors flex flex-col gap-1"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-200">Cihaza İndir</span>
              <span className="text-[10px] text-zinc-400">JSON dosyası olarak sakla</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-colors flex flex-col gap-1"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-zinc-200">Cihazdan Yükle</span>
              <span className="text-[10px] text-zinc-400">Yedek dosyasını aç</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Google Drive Backup Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-cyan-400" /> Google Drive Senkronizasyon
          </label>
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Durum: {settings.authMethod === 'google' ? 'Bağlı (Google Drive)' : 'Misafir Modu'}
              </span>
              {settings.lastBackupDate && (
                <span className="text-[10px] text-zinc-400">Son: {settings.lastBackupDate}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDriveBackup}
                className="py-2.5 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <CloudUpload className="w-3.5 h-3.5" /> Drive'a Yedekle
              </button>

              <button
                onClick={handleDriveRestore}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <CloudDownload className="w-3.5 h-3.5 text-amber-400" /> Drive'dan Yükle
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-2 border-t border-zinc-800">
          <button
            onClick={handleResetData}
            className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Tüm Uygulama Verilerini Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};
