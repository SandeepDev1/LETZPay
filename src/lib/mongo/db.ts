import {MongoClient} from "mongodb"
import type {PaymentSchema, SubscriptionDetails, Wallet} from "../../routes/api/createPaymentLink/models/dbModels";
import { logtail } from "../logs";

const client = new MongoClient(import.meta.env.VITE_DB_URL)
const connection = await client.connect()
const db = connection.db(import.meta.env.VITE_DB_NAME)
await logtail.info("Connected to database")

export const getCurrencyDetails: (currency: string) => Promise<Wallet | boolean> = async(currency: string) => {
    try {
        const collection = db.collection("currencyList")
        const result = await collection.findOne({currency})
        return result as unknown as Wallet
    } catch(err: any){
        await logtail.error(err.toString())
        return false
    }
}

export const addCurrencyDetails = async (data: Wallet) => {
    try {
        const collection = db.collection("currencyList")
        await collection.insertOne(data)
        return true
    } catch(err: any){
        await logtail.error(err.toString())
        return false
    }
}

export const addWebhookSubscriptionDetails = async (data: SubscriptionDetails) => {
    try {
        const collection = db.collection("subscriptionList")
        await collection.insertOne(data)
        return true
    } catch(err: any){
        await logtail.error(err.toString())
        return false
    }
}

export const getWebhookSubscriptionDetails = async (accountId: string, subscriptionType: string) => {
    try {
        const collection = db.collection("subscriptionList")
        const result = await collection.findOne({accountId,subscriptionType})
        return result as unknown as SubscriptionDetails
    } catch(err: any){
        await logtail.error(err.toString())
        return false
    }
}

export const addPaymentCharge = async (data: PaymentSchema) => {
    try {
        const collection = db.collection("charges")
        await collection.insertOne(data)
        return true
    } catch(err: any){
        await logtail.error(err.toString())
        return false
    }
}

export const updateChargeStatus = async (address: string, status: string) => {
    try {
        const collection = db.collection("charges")
        await collection.updateOne({address}, {$set: {status}})
        return true
    } catch(err: any){
        await logtail.error(err.toString())
        return false
    }
}

export const updatePendingAmount = async (address: string, amount: string) => {
    try {
        const collection = db.collection("charges")
        await collection.updateOne({address}, {$set: {pendingAmount: amount}})
        return true
    } catch(err: any){
        await logtail.error(err.toString())
        return false
    }
}

export const getChargeDetailsFromAddress = async (address: string) => {
    try {
        const collection = db.collection("charges")
        const result = await collection.findOne({address})
        return result as unknown as PaymentSchema
    } catch(err){
        console.error(err)
        return false
    }
}