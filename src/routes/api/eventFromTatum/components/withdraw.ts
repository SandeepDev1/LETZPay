import type {
    withdrawEstimateInputModel,
    withdrawLedgerInputModel,
    withdrawResponseModel
} from "../../createPaymentLink/models/withdrawModel";
import {currencyWithdrawName} from "../../createPaymentLink/models/withdrawModel";

export const withdrawLedger = async (data: withdrawLedgerInputModel, currency: string) => {
    try {
        if(!currency || !(currency in currencyWithdrawName)){
            return false
        }

        // @ts-ignore
        const currencyName = currencyWithdrawName[currency]
        console.log(currencyName)
        const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
            method: "POST",
            headers: {
                "x-api-key": import.meta.env.VITE_TATUM_API_KEY
            },
            body: JSON.stringify(
                {
                    "senderAccountId": data.senderAccountId,
                    "address": data.address,
                    "amount": data.amount,
                    "mnemonic": data.mnemonic,
                    "xpub": data.xpub,
                    "fees": data.fees
                }
            )
        })

        const json: withdrawResponseModel = await res.json()
        if(!json.completed){
            const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/withdrawal/${json.id}/${json.txId}`, {
                method: "PUT",
                headers: {
                    "x-api-key": import.meta.env.VITE_TATUM_API_KEY
                },
            })

            if(res.status == 204){
                return json.txId
            }

            const dataJson = await res.json()
            console.error(dataJson)

            return false
        }

        return json.txId
    } catch(err){
        console.log(err)
    }
}

export const withdrawEstimate = async (data: withdrawEstimateInputModel, currency: string) => {
    try {
        if(!currency || !(currency in currencyWithdrawName)){
            return false
        }

        // @ts-ignore
        const currencyName = currencyWithdrawName[currency]
        console.log(currencyName)
        const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
            method: "POST",
            headers: {
                "x-api-key": import.meta.env.VITE_TATUM_API_KEY
            },
            body: JSON.stringify(
                {
                    "senderAccountId": data.senderAccountId,
                    "address": data.address,
                    "amount": data.amount,
                    "mnemonic": data.mnemonic,
                    "gasLimit": data.gasLimit,
                    "gasPrice": data.gasPrice,
                    "index": data.derivationKey,
                }
            )
        })

        const json: withdrawResponseModel = await res.json()
        if(!json.completed){
            const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/withdrawal/${json.id}/${json.txId}`, {
                method: "PUT",
                headers: {
                    "x-api-key": import.meta.env.VITE_TATUM_API_KEY
                },
            })

            if(res.status == 204){
                return json.txId
            }

            const dataJson = await res.json()
            console.error(dataJson)

            return false
        }

        return json.txId
    } catch(err){
        console.log(err)
    }
}