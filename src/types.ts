export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

export interface UserSettings {
  currency: Currency;
  currencySymbol: string;
  theme: 'dark' | 'light';
  isSetupCompleted: boolean;
  authMethod: 'google' | 'guest';
  userEmail: string | null;
  lastBackupDate: string | null;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountAlias: string;
  initialBalance: number;
  currentBalance: number;
  currency: Currency;
  iban?: string;
  description?: string;
}

export interface CreditCard {
  id: string;
  cardName: string;
  bankName: string;
  lastFourDigits: string;
  statementDay: number; // Kesim günü (1-31)
  dueDate: number; // Son ödeme günü (1-31)
  limit: number;
  currentDebt: number;
  cardColor: string; // Tailwind color class name or hex
}

export interface AccountTransfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  transferFee: number; // Opsiyonel komisyon (Gider olarak "Banka İşlem Ücreti" kategorisine yazılır)
  date: string; // YYYY-MM-DD
  note?: string;
}

export type IncomeCategory = 'Maaş' | 'Yan Gelir' | 'Prim/Bonus' | 'Yatırım/Kâr' | 'Kira Geliri' | 'Diğer';

export interface IncomeItem {
  id: string;
  title: string;
  amount: number;
  category: IncomeCategory;
  date: string; // YYYY-MM-DD
  status: 'received' | 'pending'; // Alındı / Bekliyor
  targetAccountId?: string;
  note?: string;
}

export type ExpenseCategory =
  | 'Fatura'
  | 'Kira'
  | 'Mutfak/Market'
  | 'Eğlence/Sosyalleşme'
  | 'Borç/Kredi'
  | 'Ulaşım'
  | 'Abonelik'
  | 'Banka İşlem Ücreti'
  | 'Diğer';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: string; // YYYY-MM-DD
  status: 'paid' | 'unpaid'; // Ödendi / Ödenmedi
  paymentSourceId?: string; // Account ID or Credit Card ID
  paymentSourceType?: 'account' | 'credit_card';
  isRecurring?: boolean;
  note?: string;
}

export type InvestmentCategory =
  | 'Altın'
  | 'Nakit'
  | 'Gümüş'
  | 'Hisse/Fon'
  | 'Kripto'
  | 'Gayrimenkul'
  | 'Araç'
  | 'Diğer';

export interface InvestmentItem {
  id: string;
  title: string;
  category: InvestmentCategory;
  unit: string; // e.g. "gram", "adet", "lot", "TL", "USD", "m²"
  quantity: number;
  purchasePricePerUnit: number;
  currentPricePerUnit: number;
  note?: string;
  updatedAt: string;
}

export interface CashOutModalData {
  investment: InvestmentItem;
  sellQuantity: number;
  cashReceived: number;
  targetAccountId: string;
}

export interface AppStateData {
  settings: UserSettings;
  accounts: BankAccount[];
  creditCards: CreditCard[];
  transfers: AccountTransfer[];
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  investments: InvestmentItem[];
}

export type ActiveTab = 'home' | 'income' | 'expense' | 'savings' | 'accounts' | 'calendar';
