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
            // const bchFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            // if(!bchFees){
            //     return false
            // }
            //
            // if(parseFloat(bchFees.medium) < 0.00001){
            //     return 0.00001.toFixed(8)
            // }
            //
            // return bchFees.medium

            return 0.00001.toFixed(8)

        case "ETH":
            console.log(amount)
            amountFloat = parseFloat(amount)
            amountInt = parseInt((amountFloat * 100000000).toString())
            amount = String(amountInt)
            console.log(fromAddress)
            console.log(merchantAddress)
            console.log(amount)
            const ethFees = await estimateEthFees(fromAddress,merchantAddress,amount)
            if(!ethFees || ethFees.gasPrice === "null"){
                return false
            }

            console.log(ethFees)

            gwei = parseFloat(ethFees.gasPrice) / parseFloat("1000000000")
            console.log(gwei)
            const ethPriceInGwei = parseInt((gwei * parseFloat(ethFees.gasLimit)).toString())
            console.log(ethPriceInGwei)
            const ethAmount = (ethPriceInGwei / 1000000000).toFixed(8)
            console.log(ethAmount)

            return {
                fees: ethAmount,
                gasLimit: ethFees.gasLimit,
                gasPrice: ethFees.gasPrice
            }

        case "MATIC":
            amountFloat = parseFloat(amount)
            amountInt = amountFloat * 100000000
            amount = String(amountInt)
            const maticFees = await estimateMaticFees(fromAddress,merchantAddress,amount)
            if(!maticFees || maticFees.gasPrice === "null"){
                return false
            }

            console.log(maticFees)

            gwei = parseFloat(maticFees.gasPrice) / parseFloat("1000000000")
            const maticPriceInGwei = gwei * parseFloat(maticFees.gasLimit)
            const maticAmount = (maticPriceInGwei / 1000000000).toFixed(8)
            return {
                fees: maticAmount,
                gasLimit: maticFees.gasLimit,
                gasPrice: maticFees.gasPrice
            }

        default:
            return false
    }
}