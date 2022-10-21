export const Currency = {
  BTC: "BTC",
  LTC: "LTC",
  BCH: "BCH",
  DOGE: "DOGE",
  ETH: "ETH",
  MATIC: "MATIC"
}

export const LocalCurrency = {
  USD: "USD",
  INR: "INR",
  EUR: "EUR",
  JPY: "JPY",
  GBP: "GBP",
  AUD: "AUD",
  CAD: "CAD",
  CHF: "CHF",
  CNH: "CNH",
  HKD: "HKD",
  NZD: "NZD"
}

export interface AccountBalance {
  accountBalance: string;
  availableBalance: string;
}

export interface Account {
  accountCode?: string;
  id: string;
  balance: AccountBalance;
  created: string;
  currency: string;
  customerId?: string;
  frozen: boolean;
  active: boolean;
  xpub?: string;
}

export declare enum SubscriptionType {
  ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION = "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION",
  ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION = "ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION",
}

export interface AttributeSubscription {
  id: string;
  url: string;
}

export interface CreateSubscription {
  type: string
  attr: AttributeSubscription
}

export interface Address {
  address: string;
  currency: string;
  derivationKey?: number;
  xpub?: string;
  destinatinTag?: number;
  message?: string;
}