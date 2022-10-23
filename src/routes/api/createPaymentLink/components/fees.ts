import fetch from "node-fetch";
import type { ethFees, ledgerFees, maticFees} from "../models/feeModels";
import {getCryptoPrice} from "../utils";

export const estimateEthFees = async (from: string, to: string, amount: string) => {
    try {
        const res = await fetch("https://api-eu1.tatum.io/v3/ethereum/gas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.VITE_TATUM_API_KEY ?? "",
            },
            body: JSON.stringify({
                from: from,
                to: to,
                amount: amount
            })
        })
        const json = await res.json()
        return json as ethFees
    } catch(err){
        // @ts-ignore
        console.error(err)
        return false
    }
}

export const estimateMaticFees = async (from: string, to: string, amount: string) => {
    try {
        const res = await fetch("https://api-eu1.tatum.io/v3/polygon/gas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.VITE_TATUM_API_KEY ?? "",
            },
            body: JSON.stringify({
                from: from,
                to: to,
                amount: amount
            })
        })
        const json = await res.json()
        return json as maticFees
    } catch(err){
        // @ts-ignore
        console.error(err)
        return false
    }
}

export const estimateLedgerFees = async (senderAccountId: string, toAddress: string, amount: string, xpub: string) => {
    try {
        const res = await fetch(
            `https://api-eu1.tatum.io/v3/offchain/blockchain/estimate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.VITE_TATUM_API_KEY ?? "",
                },
                body: JSON.stringify({
                    senderAccountId: senderAccountId,
                    address: toAddress,
                    amount: amount,
                    xpub: xpub
                })
            }
        );

        const data = await res.json();
        console.log(JSON.stringify(data))
        return data as ledgerFees
    } catch(err){
        // @ts-ignore
        console.error(err)
        return false
    }
}

export const calculateFees = async (accountId: string, currency: string, xpub: string, merchantAddress: string, fromAddress: string, amount: string): Promise<false | string | {fees: string, gasPrice: string, gasLimit: string}> => {
    let amountFloat = 0
    let amountInt = 0
    let gwei = 0
    let price: number | boolean = 0
    let usdFees = 0
    switch (currency) {
        case "BTC":
            const btcFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            if(!btcFees){
                return false
            }

            if(parseFloat(btcFees.medium) < 0.00001){
                return 0.00001.toFixed(8)
            }

            return btcFees.medium
        case "LTC":
            const ltcFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            if(!ltcFees){
                return false
            }

            if(parseFloat(ltcFees.medium) < 0.00001){
                return 0.00001.toFixed(8)
            }

            return ltcFees.medium

        case "DOGE":
            const dogeFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            if(!dogeFees){
                return false
            }

            if(parseFloat(dogeFees.medium) < 0.00001){
                return 0.00001.toFixed(8)
            }

            return dogeFees.medium

        case "BCH":
            const bchFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            if(!bchFees){
                return false
            }

            if(parseFloat(bchFees.medium) < 0.00001){
                return 0.00001.toFixed(8)
            }

            return bchFees.medium

        case "ETH":
            amountFloat = parseFloat(amount)
            amountInt = amountFloat * 100000000
            amount = String(amountInt)
            const ethFees = await estimateEthFees(fromAddress,merchantAddress,amount)
            if(!ethFees){
                return false
            }

            gwei = parseInt(ethFees.gasPrice) / 100000000
            price = await getCryptoPrice("ETH", "USD")
            if(!price){
                return false
            }
            usdFees = gwei * price * 0.000000001

            return {
                fees: usdFees.toFixed(8),
                gasLimit: ethFees.gasLimit,
                gasPrice: ethFees.gasPrice
            }

        case "MATIC":
            amountFloat = parseFloat(amount)
            amountInt = amountFloat * 100000000
            amount = String(amountInt)
            const maticFees = await estimateMaticFees(fromAddress,merchantAddress,amount)
            if(!maticFees){
                return false
            }

            gwei = parseInt(maticFees.gasPrice) / 100000000
            price = await getCryptoPrice("MATIC", "USD")
            if(!price){
                return false
            }
            usdFees = gwei * price * 0.000000001
            return {
                fees: usdFees.toFixed(8),
                gasLimit: maticFees.gasLimit,
                gasPrice: maticFees.gasPrice
            }

        default:
            return false
    }
}