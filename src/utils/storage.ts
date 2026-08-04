import { AppStateData, UserSettings } from '../types';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'TRY',
  currencySymbol: '₺',
  theme: 'dark',
  isSetupCompleted: false,
  authMethod: 'guest',
  userEmail: null,
  lastBackupDate: null,
};

export const INITIAL_DEMO_DATA: AppStateData = {
  settings: {
    ...DEFAULT_SETTINGS,
    isSetupCompleted: true,
  },
  accounts: [
    {
      id: 'acc_1',
      bankName: 'Garanti BBVA',
      accountAlias: 'Maaş Vadesiz Hesabı',
      initialBalance: 45000,
      currentBalance: 52400,
      currency: 'TRY',
      iban: 'TR12 0006 2000 0000 1234 5678 90',
      description: 'Ana harcama ve maaş hesabım',
    },
    {
      id: 'acc_2',
      bankName: 'İş Bankası',
      accountAlias: 'Acil Durum Fonu',
      initialBalance: 25000,
      currentBalance: 28500,
      currency: 'TRY',
      iban: 'TR64 0006 4000 0001 9876 5432 10',
      description: 'Birikim ve acil durum nakiti',
    },
    {
      id: 'acc_3',
      bankName: 'Enpara.com',
      accountAlias: 'Günlük Birikim Hesabı',
      initialBalance: 12000,
      currentBalance: 14200,
      currency: 'TRY',
      iban: 'TR98 0011 1000 0000 8888 7777 66',
      description: 'Yüksek faizli vadeli hesap',
    },
  ],
  creditCards: [
    {
      id: 'card_1',
      cardName: 'Bonus Flexi',
      bankName: 'Garanti BBVA',
      lastFourDigits: '4821',
      statementDay: 15,
      dueDate: 25,
      limit: 60000,
      currentDebt: 12850,
      cardColor: 'from-emerald-600 to-teal-800',
    },
    {
      id: 'card_2',
      cardName: 'Maximum Black',
      bankName: 'İş Bankası',
      lastFourDigits: '9012',
      statementDay: 5,
      dueDate: 15,
      limit: 100000,
      currentDebt: 24300,
      cardColor: 'from-indigo-600 to-blue-800',
    },
  ],
  transfers: [
    {
      id: 'tr_1',
      fromAccountId: 'acc_1',
      toAccountId: 'acc_2',
      amount: 5000,
      transferFee: 0,
      date: new Date().toISOString().slice(0, 10),
      note: 'Aylık otomatik birikim aktarımı',
    },
  ],
  incomes: [
    {
      id: 'inc_1',
      title: 'Aylık Şirket Maaşı',
      amount: 65000,
      category: 'Maaş',
      date: new Date().toISOString().slice(0, 7) + '-01',
      status: 'received',
      targetAccountId: 'acc_1',
      note: 'Ağustos maaş ödemesi',
    },
    {
      id: 'inc_2',
      title: 'Serbest Proje Danışmanlığı',
      amount: 12500,
      category: 'Yan Gelir',
      date: new Date().toISOString().slice(0, 7) + '-18',
      status: 'pending',
      targetAccountId: 'acc_1',
      note: 'Mobil uygulama tasarımı hakedişi',
    },
    {
      id: 'inc_3',
      title: 'Kira Geliri (Kadıköy Daire)',
      amount: 18000,
      category: 'Kira Geliri',
      date: new Date().toISOString().slice(0, 7) + '-10',
      status: 'received',
      targetAccountId: 'acc_2',
      note: 'Ağustos kirası',
    },
  ],
  expenses: [
    {
      id: 'exp_1',
      title: 'Ev Kirası',
      amount: 22000,
      category: 'Kira',
      dueDate: new Date().toISOString().slice(0, 7) + '-05',
      status: 'paid',
      paymentSourceId: 'acc_1',
      paymentSourceType: 'account',
      note: 'Ev sahibi IBAN transferi',
    },
    {
      id: 'exp_2',
      title: 'Elektrik & Su Faturası',
      amount: 1850,
      category: 'Fatura',
      dueDate: new Date().toISOString().slice(0, 7) + '-12',
      status: 'unpaid',
      paymentSourceId: 'card_1',
      paymentSourceType: 'credit_card',
      note: 'Otomatik ödeme talimatı',
    },
    {
      id: 'exp_3',
      title: 'Aylık Mutfak & Süpermarket',
      amount: 8400,
      category: 'Mutfak/Market',
      dueDate: new Date().toISOString().slice(0, 7) + '-15',
      status: 'paid',
      paymentSourceId: 'card_1',
      paymentSourceType: 'credit_card',
      note: 'Kredi kartı ile harcama',
    },
    {
      id: 'exp_4',
      title: 'İnternet & Dijital Abonelikler',
      amount: 1200,
      category: 'Abonelik',
      dueDate: new Date().toISOString().slice(0, 7) + '-20',
      status: 'unpaid',
      paymentSourceId: 'card_2',
      paymentSourceType: 'credit_card',
      note: 'Netflix, Spotify, Fiber İnternet',
    },
    {
      id: 'exp_5',
      title: 'Taşıt Kredisi Taksidi',
      amount: 11500,
      category: 'Borç/Kredi',
      dueDate: new Date().toISOString().slice(0, 7) + '-25',
      status: 'unpaid',
      paymentSourceId: 'acc_1',
      paymentSourceType: 'account',
      note: 'Garanti bankası kredi ödemesi',
    },
  ],
  investments: [
    {
      id: 'inv_1',
      title: 'Fiziki Gram Altın (24 Ayar)',
      category: 'Altın',
      unit: 'gram',
      quantity: 50,
      purchasePricePerUnit: 2850,
      currentPricePerUnit: 3150,
      note: 'Banka kasasında muhafaza ediliyor',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv_2',
      title: 'Gümüş Külçe',
      category: 'Gümüş',
      unit: 'gram',
      quantity: 500,
      purchasePricePerUnit: 32,
      currentPricePerUnit: 38.5,
      note: 'Uzun vadeli birikim',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv_3',
      title: 'THYAO & BIST 100 Portföyü',
      category: 'Hisse/Fon',
      unit: 'lot',
      quantity: 350,
      purchasePricePerUnit: 290,
      currentPricePerUnit: 325,
      note: 'Borsa İstanbul yatırım hesabı',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv_4',
      title: 'Bitcoin (BTC)',
      category: 'Kripto',
      unit: 'adet',
      quantity: 0.15,
      purchasePricePerUnit: 2100000,
      currentPricePerUnit: 2450000,
      note: 'Soğuk cüzdan muhafazası',
      updatedAt: new Date().toISOString(),
    },
  ],
};

const STORAGE_KEY = 'paybee_app_state_v1';

export function loadAppState(): AppStateData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        ...INITIAL_DEMO_DATA,
        settings: {
          ...DEFAULT_SETTINGS,
          isSetupCompleted: false, // forces onboarding on first load
        },
      };
    }
    const parsed = JSON.parse(raw) as AppStateData;
    return parsed;
  } catch (err) {
    console.error('Error loading app state from localStorage:', err);
    return INITIAL_DEMO_DATA;
  }
}

export function saveAppState(data: AppStateData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving app state to localStorage:', err);
  }
}

export function formatCurrency(amount: number, symbol = '₺'): string {
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${symbol}`;
}

export function formatDateTR(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  const monthNames = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} ${monthNames[monthIdx] || month} ${year}`;
}

export function formatIBAN(iban?: string): string {
  if (!iban) return '';
  const clean = iban.replace(/\s+/g, '').toUpperCase();
  return clean.replace(/(.{4})/g, '$1 ').trim();
}
