import type {
    withdrawEstimateInputModel,
    withdrawLedgerInputModel,
    withdrawResponseModel
} from "../../createPaymentLink/models/withdrawModel";
import {currencyWithdrawName} from "../../createPaymentLink/models/withdrawModel";
import { logtail } from "../../../../lib/logs";

export const withdrawLedger = async (data: withdrawLedgerInputModel, currency: string) => {
    try {
        await logtail.info(JSON.stringify(data))
        if(!currency || !(currency in currencyWithdrawName)){
            return false
        }

        data.fees = parseFloat(data.fees).toFixed(8)

        // @ts-ignore
        const currencyName = currencyWithdrawName[currency]
        await logtail.info(currencyName)
        const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
            method: "POST",
            headers: {
                "x-api-key": import.meta.env.VITE_TATUM_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "senderAccountId": data.senderAccountId,
                    "address": data.address,
                    "amount": data.amount,
                    "mnemonic": data.mnemonic,
                    "xpub": data.xpub,
                    "fee": data.fees
                }
            )
        })

        const json: withdrawResponseModel = await res.json()
        await logtail.info(JSON.stringify(json))
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
            await logtail.info(JSON.stringify(dataJson))

            return false
        }

        return json.txId
    } catch(err: any){
        await logtail.error(err)
        return false
    }
}

export const withdrawEstimate = async (data: withdrawEstimateInputModel, currency: string) => {
    try {
        await logtail.info(JSON.stringify(data))
        if(!currency || !(currency in currencyWithdrawName)){
            return false
        }

        // @ts-ignore
        const currencyName = currencyWithdrawName[currency]
        await logtail.info(currencyName)
        const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
        await logtail.info(JSON.stringify(json))
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
            await logtail.error(JSON.stringify(dataJson))

            return false
        }

        return json.txId
    } catch(err: any){
        await logtail.error(err)
        return false
    }
}