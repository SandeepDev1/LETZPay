import type {
    withdrawEstimateInputModel,
    withdrawLedgerInputModel,
    withdrawResponseModel
} from "../../createPaymentLink/models/withdrawModel";
import {currencyWithdrawName} from "../../createPaymentLink/models/withdrawModel";
import { percentFees } from "../../../../lib/tatum/constants";

export const withdrawLedger = async (data: withdrawLedgerInputModel, currency: string) => {
    try {
        console.log(JSON.stringify(data))
        if(!currency || !(currency in currencyWithdrawName)){
            return false
        }

        data.fees = parseFloat(data.fees).toFixed(8)
        const percentLeft = parseFloat(data.amount) * (percentFees / 100)
        data.amount = (parseFloat(data.amount) - percentLeft).toFixed(8)

        // @ts-ignore
        const currencyName = currencyWithdrawName[currency]
        console.log(currencyName)
        const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
            method: "POST",
            headers: {
                "x-api-key": process.env.VITE_TATUM_API_KEY ?? "",
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
        console.log(JSON.stringify(json))
        if(!json.completed){
            const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/withdrawal/${json.id}/${json.txId}`, {
                method: "PUT",
                headers: {
                    "x-api-key": process.env.VITE_TATUM_API_KEY ?? "",
                },
            })

            if(res.status == 204){
                return json.txId
            }

            const dataJson = await res.json()
            console.log(JSON.stringify(dataJson))

            return false
        }

        return json.txId
    } catch(err: any){
        console.error(err)
        return false
    }
}

export const withdrawEstimate = async (data: withdrawEstimateInputModel, currency: string) => {
    try {
        console.log(JSON.stringify(data))
        if(!currency || !(currency in currencyWithdrawName)){
            return false
        }

        // @ts-ignore
        const currencyName = currencyWithdrawName[currency]
        console.log(currencyName)
        const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.VITE_TATUM_API_KEY ?? "",
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
        console.log(JSON.stringify(json))
        if(!json.completed){
            const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/withdrawal/${json.id}/${json.txId}`, {
                method: "PUT",
                headers: {
                    "x-api-key": process.env.VITE_TATUM_API_KEY ?? "",
                },
            })

            if(res.status == 204){
                return json.txId
            }

            const dataJson = await res.json()
            console.error(JSON.stringify(dataJson))

            return false
        }

        return json.txId
    } catch(err: any){
        console.error(err)
        return false
    }
}