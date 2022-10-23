import { addWebhookSubscriptionDetails, getWebhookSubscriptionDetails } from "../mongo/db";
import { generateWallet } from "./wallet";
import fetch from "node-fetch";
import type { Account, Address } from "./models";
import type { CreateSubscription } from "./models";
import { SubscriptionType } from "./models";

export const generateWalletFromCurrency = async (currency: string, testnet: boolean) => {
  return generateWallet(currency,testnet)
}

export const generateAccount = async (currency: string, xpub: string) => {
  try {
    const res = await fetch("https://api-eu1.tatum.io/v3/ledger/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_TATUM_API_KEY ?? "",
      },
      body: JSON.stringify({
        currency,
        xpub
      })
    })

    const json = await res.json()
    console.log(JSON.stringify(json))
    return json as unknown as Account
  } catch(err: any){
    console.error(err)
    return false
  }
}

const createNewSubscription = async (data: CreateSubscription) => {
  try {
    const res = await fetch("https://api-eu1.tatum.io/v3/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_TATUM_API_KEY ?? "",
      },
      body: JSON.stringify(data)
    })

    const json = await res.json()
    return json as unknown as {id: string}
  } catch(err: any) {
    console.error(err)
    return false
  }
}

export const createSubscription = async (accountId: string, url: string) => {
  try {
    console.log(accountId)
    console.log(url)
    if(!await getWebhookSubscriptionDetails(accountId,SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION)){
      const sub1 = await createNewSubscription({type: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION, attr: {id: accountId, url: url}})
      if (typeof sub1 !== "boolean") {
        await addWebhookSubscriptionDetails({
          accountId,
          subscriptionId: sub1.id,
          subscriptionType: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION
        });
      } else {
        return false
      }
    }

    if(!await getWebhookSubscriptionDetails(accountId, SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION)){
      const sub2 = await createNewSubscription({type: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION, attr: {id: accountId, url: url}})
      if (typeof sub2 !== "boolean") {
        await addWebhookSubscriptionDetails({
          accountId,
          subscriptionId: sub2.id,
          subscriptionType: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION
        });
      } else {
        return false
      }
    }

    return true
  } catch(err: any){
    console.error(err.toString())
    return false
  }
}

export const generateDepositAddress = async (accountId: string) => {
  try {
    const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/account/${accountId}/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_TATUM_API_KEY ?? "",
      },
    })

    let json = await res.json()
    const address = json as unknown as Address
    console.log(JSON.stringify(address))
    return {address: address.address, derivationKey: address.derivationKey}
  } catch(err: any){
    console.error(err.toString())
    return false
  }
}