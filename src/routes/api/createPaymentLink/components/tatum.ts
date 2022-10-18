import Tatum, {Currency, SubscriptionType} from '@tatumio/tatum'
import {addWebhookSubscriptionDetails, getWebhookSubscriptionDetails} from "../../../../lib/mongo/db";

export const generateWalletFromCurrency = async (currency: String, testnet: boolean) => {
    return Tatum.generateWallet(Currency[currency as keyof typeof Currency], testnet);
}

export const generateAccount = async (currency: string, xpub: string) => {
    return Tatum.createAccount({currency,xpub})
}

export const createSubscription = async (accountId: string, url: string) => {
    try {
        if(!await getWebhookSubscriptionDetails(accountId,SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION)){
            const sub1 = await Tatum.createNewSubscription({type: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION, attr: {id: accountId, url: url}})
            await addWebhookSubscriptionDetails({accountId, subscriptionId:sub1.id, subscriptionType: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION})
        }

        if(!await getWebhookSubscriptionDetails(accountId, SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION)){
            const sub2 = await Tatum.createNewSubscription({type: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION, attr: {id: accountId, url: url}})
            await addWebhookSubscriptionDetails({accountId, subscriptionId:sub2.id, subscriptionType: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION})
        }

        return true
    } catch(err){
        console.error(err)
        return false
    }
}

export const generateDepositAddress = async (accountId: string) => {
    try {
        const address = await Tatum.generateDepositAddress(accountId)
        console.log(address)
        return {address: address.address, derivationKey: address.derivationKey}
    } catch(err){
        console.error(err)
        return false
    }

}