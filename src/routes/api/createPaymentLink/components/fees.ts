import fetch from "node-fetch";
import Tatum from "@tatumio/tatum";
import type {celoFees, ethFees, kcsFees, klayFees, ledgerFees, maticFees, xdcFees} from "../models/feeModels";
import {getCryptoPrice} from "../utils";

export const estimateEthFees = async (from: string, to: string, amount: string) => {
    try {
        const data: ethFees = await Tatum.ethEstimateGas({from, to, amount})
        return data
    } catch(err){
        console.error(err)
        return false
    }
}

export const estimateCeloFees = async(from: string, to: string, amount: string) => {
    try {
        const res = await fetch("https://api-eu1.tatum.io/v3/celo/gas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_TATUM_API_KEY
            },
            body: JSON.stringify({
                from: from,
                to: to,
                amount: amount
            })
        })

        const json = await res.json()
        return json as celoFees
    } catch(err){
        console.error(err)
        return false
    }
}

export const estimateKcsFees = async (from: string, to: string, amount: string) => {
    try {
        const res = await fetch("https://api-eu1.tatum.io/v3/kcs/gas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_TATUM_API_KEY
            },
            body: JSON.stringify({
                from: from,
                to: to,
                amount: amount
            })
        })

        const json = await res.json()
        return json as kcsFees
    } catch(err){
        console.error(err)
        return false
    }
}

export const estimateKlayFees = async (from: string, to: string, amount: string) => {
    try {
        const data: klayFees = await Tatum.klaytnEstimateGas({from,to,amount})
        return data
    } catch(err){
        console.error(err)
        return false
    }
}

export const estimateMaticFees = async (from: string, to: string, amount: string) => {
    try {
        const data: maticFees = await Tatum.polygonEstimateGas({from, to, amount})
        return data
    } catch(err){
        console.error(err)
        return false
    }
}

export const estimateXdcFees = async (from: string, to: string, amount: string) => {
    try {
        const data: xdcFees = await Tatum.xdcEstimateGas({from, to, amount})
        return data
    } catch(err){
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
                    'x-api-key': import.meta.env.VITE_TATUM_API_KEY
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
        console.log(data)
        return data as ledgerFees
    } catch(err){
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

            return btcFees.medium
        case "LTC":
            const ltcFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            if(!ltcFees){
                return false
            }

            return ltcFees.medium

        case "DOGE":
            const dogeFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            if(!dogeFees){
                return false
            }

            return dogeFees.medium

        case "BCH":
            const bchFees = await estimateLedgerFees(accountId,merchantAddress,amount,xpub)
            if(!bchFees){
                return false
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

        case "CELO":
            amountFloat = parseFloat(amount)
            amountInt = amountFloat * 100000000
            amount = String(amountInt)
            const celoFees = await estimateCeloFees(fromAddress,merchantAddress,amount)
            if(!celoFees){
                return false
            }

            gwei = parseInt(celoFees.gasPrice) / 100000000
            price = await getCryptoPrice("CELO", "USD")
            if(!price){
                return false
            }
            usdFees = gwei * price * 0.000000001
            return {
                fees: usdFees.toFixed(8),
                gasLimit: String(celoFees.gasLimit),
                gasPrice: celoFees.gasPrice
            }

        case "KCS":
            amountFloat = parseFloat(amount)
            amountInt = amountFloat * 100000000
            amount = String(amountInt)
            const kcsFees = await estimateKcsFees(fromAddress,merchantAddress,amount)
            if(!kcsFees){
                return false
            }

            gwei = parseInt(kcsFees.gasPrice) / 100000000
            price = await getCryptoPrice("KCS", "USD")
            if(!price){
                return false
            }
            usdFees = gwei * price * 0.000000001
            return {
                fees: usdFees.toFixed(8),
                gasLimit: kcsFees.gasLimit,
                gasPrice: kcsFees.gasPrice
            }

        case "KLAY":
            amountFloat = parseFloat(amount)
            amountInt = amountFloat * 100000000
            amount = String(amountInt)
            const klayFees = await estimateKlayFees(fromAddress,merchantAddress,amount)
            if(!klayFees){
                return false
            }

            gwei = parseInt(klayFees.gasPrice) / 100000000
            price = await getCryptoPrice("KLAY", "USD")
            if(!price){
                return false
            }
            usdFees = gwei * price * 0.000000001
            return {
                fees: usdFees.toFixed(8),
                gasLimit: klayFees.gasLimit,
                gasPrice: klayFees.gasPrice
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

        case "XDC":
            amountFloat = parseFloat(amount)
            amountInt = amountFloat * 100000000
            amount = String(amountInt)
            const xdcFees = await estimateXdcFees(fromAddress,merchantAddress,amount)
            if(!xdcFees){
                return false
            }

            gwei = parseInt(xdcFees.gasPrice) / 100000000
            price = await getCryptoPrice("XDC", "USD")
            if(!price){
                return false
            }
            usdFees = gwei * price * 0.000000001
            return {
                fees: usdFees.toFixed(8),
                gasLimit: xdcFees.gasLimit,
                gasPrice: xdcFees.gasPrice
            }

        default:
            return false
    }
}