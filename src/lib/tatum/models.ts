export const Currency = {
  BTC: "BTC",
  LTC: "LTC",
  BCH: "BCH",
  DOGE: "DOGE"
  // ETH: "ETH",
  // MATIC: "MATIC"
};

export const CurrencyList = [
  {
    crypto: [
      {
        name: "Bitcoin",
        currency: "BTC",
        image: "/btc.svg"
      },
      {
        name: "Litecoin",
        currency: "LTC",
        image: "/ltc.svg"
      },
      {
        name: "Bitcoin Cash",
        currency: "BCH",
        image: "/bch.svg"
      },
      {
        name: "DogeCoin",
        currency: "DOGE",
        image: "/doge.svg"
      },
      {
        name: "Ethereum",
        currency: "ETH",
        image: "/eth.svg"
      },
      {
        name: "Polygon",
        currency: "MATIC",
        image: "/matic.svg"
      }
    ]
  },
  {
    currency: [
      {
        name: "USD",
        symbol: "$",
        image: "/usd.svg"
      },
      {
        name: "INR",
        symbol: "₹",
        image: "/inr.svg"
      },
      {
        name: "EUR",
        symbol: "€",
        image: "/euro.svg"
      },
      {
        name: "JPY",
        symbol: "¥",
        image: "/jpy.svg"
      },
      {
        name: "GBP",
        symbol: "£",
        image: "/gbp.svg"
      },
      {
        name: "HKD",
        symbol: "HK$",
        image: "/hkd.svg"
      }
    ]
  }
];

export const LocalCurrency = {
  USD: "USD",
  INR: "INR",
  EUR: "EUR",
  JPY: "JPY",
  GBP: "GBP",
  // AUD: "AUD",
  // CAD: "CAD",
  // CHF: "CHF",
  // CNH: "CNH",
  HKD: "HKD"
  // NZD: "NZD"
};

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

export const SubscriptionType = {
  ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION: "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION",
  ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION: "ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION"
};

export interface AttributeSubscription {
  id: string;
  url: string;
}

export interface CreateSubscription {
  type: string;
  attr: AttributeSubscription;
}

export interface Address {
  address: string;
  currency: string;
  derivationKey?: number;
  xpub?: string;
  destinatinTag?: number;
  message?: string;
}