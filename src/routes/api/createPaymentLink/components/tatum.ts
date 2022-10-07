import Tatum, {Currency} from '@tatumio/tatum'

export const generateWalletFromCurrency = async (currency: String, testnet: boolean) => {
    return Tatum.generateWallet(Currency[currency as keyof typeof Currency], testnet);
}

export const generateAccount = async (currency: string, xpub: string) => {
    return Tatum.createAccount({currency,xpub})
}