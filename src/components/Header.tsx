import React from 'react';
import { Settings, Wallet, Moon, Sun, ShieldCheck } from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  settings: UserSettings;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, onOpenSettings, onToggleTheme }) => {
  const currentMonthName = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/80 dark:bg-[#09090b]/80 light:bg-white/90 backdrop-blur-md border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200 px-6 py-3.5 text-zinc-100 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <div className="w-4 h-4 bg-zinc-900 rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-white dark:text-white light:text-zinc-900 flex items-center gap-1.5">
                PayBee <span className="text-amber-400 font-bold text-[10px] px-1.5 py-0.5 bg-amber-400/10 rounded-full border border-amber-400/20">PRO</span>
              </h1>
            </div>
            <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-400 light:text-zinc-500 capitalize flex items-center gap-1">
              <span>{currentMonthName}</span>
              {settings.authMethod === 'google' && (
                <span className="inline-flex items-center text-[10px] text-emerald-400 gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Drive
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors border border-zinc-700/50 active:scale-95"
            title="Tema Değiştir"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors border border-zinc-700/50 active:scale-95"
            title="Ayarlar"
            id="settings-gear-btn"
          >
            <Settings className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
