import { MongoClient } from "mongodb"
import type {Wallet} from "../../routes/api/createPaymentLink/models/wallet";
const client = new MongoClient(import.meta.env.VITE_DB_URL)
const connection = await client.connect()
const db = connection.db(import.meta.env.VITE_DB_NAME)
console.log("Connected to database")

export const getCurrencyDetails: (currency: string) => Promise<Wallet | boolean> = async(currency: string) => {
    try {
        const collection = db.collection("currencyList")
        const result = await collection.findOne({currency})
        return result as unknown as Wallet
    } catch(err){
        console.error(err)
        return false
    }
}