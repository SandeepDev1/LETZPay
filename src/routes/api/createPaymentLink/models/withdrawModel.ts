export interface withdrawLedgerInputModel {
    address: string
    fees: string
    senderAccountId: string
    amount: string
    mnemonic: string
    xpub: string
}

export interface withdrawResponseModel {
    id: string
    txId: string
    completed: boolean
}

export interface withdrawEstimateInputModel {
    address: string
    senderAccountId: string
    amount: string
    mnemonic: string
    derivationKey: number | undefined
    gasLimit: string
    gasPrice: string
}

export const currencyWithdrawName = {
    "BTC": "bitcoin",
    "LTC": "litecoin",
    "BCH": "bcash",
    "DOGE": "dogecoin",
    "ETH": "ethereum",
    "MATIC": "polygon"
}

export const isLedger = (currency: string) => {
    return !(currency == "ETH" || currency == "MATIC");
}