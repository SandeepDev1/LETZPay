import type {CreatePayment} from "./models/dbModels";
import {currencies, localCurrency} from "./models/paymentModels";

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