export interface CreatePayment {
    address: string
    amount: string
    localCurrency: string
    webhookUrl: string
    currency: string
    metadata: string
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
    createdAt: number
    address: string
    merchantAddress: string
    localAmount: string
    localCurrency: string
    amount: string
    currency: string
    webhookUrl: string
    fees?: string
    gasLimit?: string
    gasPrice?: string
    totalAmount?: string
    pendingAmount?: string
    derivationKey: number | undefined
    metadata: string
}

export interface SubscriptionModel {
    date: number
    amount: string
    currency: string
    accountId: string
    reference: string
    txId: string
    blockHash: string
    blockHeight: number
    from: string
    to: string
    index: number
    subscriptionType: string
}