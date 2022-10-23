import type {CreatePayment, PaymentSchema} from "./models/dbModels";
import { STATUS} from "./models/paymentModels";
import { uuid as uuidv4 } from 'uuidv4';
import {addPaymentCharge} from "../../../lib/mongo/db";
import { LocalCurrency as localCurrency, Currency as currencies } from "../../../lib/tatum/models";

export const verifyCreatePaymentRequest = (data: Object) => {
    let paymentData: CreatePayment = {
        address: "",
        amount: "",
        localCurrency: "",
        webhookUrl: "",
        currency: "",
        metadata: ""
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

    if("metadata" in data){
        // @ts-ignore
        if(typeof(data["metadata"]) != "string"){
            return {error: true, msg: "metadata should be in string. Please stringify your data to convert into string"}
        }

        // @ts-ignore
        paymentData.metadata = data["metadata"]
    }

    return paymentData
}

export const getCryptoPrice = async (crypto: string, localCurrency: string) => {
    try {
        const res = await fetch(`https://api.coinbase.com/v2/prices/${crypto}-${localCurrency}/spot`)
        const text = await res.text()
        console.log(text)
        if(res.status == 200){
            const json = JSON.parse(text)
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


export const createCharge = async (data: CreatePayment, depositAddress: string, derivationKey: number | undefined, cryptoAmount: number, fees: string | {fees: string, gasPrice: string, gasLimit: string}) => {
    try {
        const uid = uuidv4().toString()
        console.log(uid)

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
            derivationKey: derivationKey,
            metadata: data.metadata
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
    } catch(err: any){
        console.error(err)
        return false
    }


}