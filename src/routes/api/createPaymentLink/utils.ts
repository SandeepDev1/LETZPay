import type {CreatePayment, PaymentSchema} from "./models/dbModels";
import {currencies, localCurrency, STATUS} from "./models/paymentModels";
import { v4 as uuidv4 } from 'uuid';
import {addPaymentCharge} from "../../../lib/mongo/db";

export const verifyCreatePaymentRequest = (data: Object) => {
    let paymentData: CreatePayment = {
        address: "",
        amount: "",
        localCurrency: "",
        webhookUrl: "",
        currency: ""
    }

    if(!("address" in data)){
        return {error: true, msg: "ADDRESS_FIELD_MISSING"}
    }

    // @ts-ignore
    paymentData.address = data["address"]

    if(!("amount" in data)){
        return {error: true, msg: "AMOUNT_FIELD_MISSING"}
    }

    // @ts-ignore
    paymentData.amount = data["amount"]

    if(!("localCurrency" in data)){
        return {error: true, msg: "LOCAL_CURRENCY_FIELD_MISSING"}
    }

    // @ts-ignore
    paymentData.localCurrency = data["localCurrency"]

    if(!(paymentData.localCurrency in localCurrency)){
        return {error: true, msg: `We only support these local currencies ${Object.keys(localCurrency).join(" , ")}`}
    }

    if(!("webhookUrl" in data)){
        return {error: true, msg: "WEBHOOK_URL_FIELD_MISSING"}
    }

    // @ts-ignore
    paymentData.webhookUrl = data["webhookUrl"]

    if(!("currency" in data)){
        return {error: true, msg: "CURRENCY_FIELD_MISSING"}
    }

    // @ts-ignore
    paymentData.currency = data["currency"]

    if(!(paymentData.currency in currencies)){
        return {error: true, msg: `We only support these crypto currencies ${Object.keys(currencies).join(" , ")}`}
    }

    return paymentData
}

export const getCryptoPrice = async (crypto: string, localCurrency: string) => {
    try {
        const res = await fetch(`https://api.coinbase.com/v2/prices/${crypto}-${localCurrency}/spot`)
        if(res.status == 200){
            const json = await res.json()
            return parseFloat(json.data.amount)
        } else {
            return false
        }
    } catch(err){
        console.error(err)
        return false
    }

}

export const localCurrencyToCrypto = async (amount: string, localCurrency: string, currency: string) => {
    const price = await getCryptoPrice(currency,localCurrency)
    if(!price){
        return false
    }

    return parseFloat(amount) / price
}


export const createCharge = async (data: CreatePayment, depositAddress: string, cryptoAmount: number, fees: string | {fees: string, gasPrice: string, gasLimit: string}) => {
    try {
        const uid = uuidv4().toString()

        const payment: PaymentSchema = {
            chargeId: uid,
            status: STATUS.CREATED,
            createdAt: Date.now(),
            address: depositAddress,
            merchantAddress: data.address,
            localCurrency: data.localCurrency,
            localAmount: data.amount,
            amount: cryptoAmount.toFixed(8),
            currency: data.currency,
            webhookUrl: data.webhookUrl,
        }

        if(typeof(fees) == "string"){
            payment.fees = fees
            payment.totalAmount = (parseFloat(fees) + parseFloat(cryptoAmount.toFixed(8))).toFixed(8)
        } else {
            payment.fees = fees.fees
            payment.gasPrice = fees.gasPrice
            payment.gasLimit = fees.gasLimit
            payment.totalAmount = (parseFloat(fees.fees) + parseFloat(cryptoAmount.toFixed(8))).toFixed(8)
        }

        await addPaymentCharge(payment)

        return payment
    } catch(err){
        console.error(err)
        return false
    }


}