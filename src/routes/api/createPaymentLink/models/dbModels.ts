export interface CreatePayment {
    address: string
    amount: string
    localCurrency: string
    webhookUrl: string
    currency: string
}

export interface SubscriptionDetails {
    accountId: string
    subscriptionId: string
    subscriptionType: string
}

export interface Wallet {
    currency: string
    mnemonic: string
    xpub: string
    accountId: string
}

export interface PaymentSchema {
    chargeId: string
    status: string
    createdAt: Date
    address: string
    localAmount: string
    localCurrency: string
    amount: string
    currency: string
    webhookUrl: string
}