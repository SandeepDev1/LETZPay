import type {RequestEvent} from "@sveltejs/kit";
import type { SubscriptionModel} from "../createPaymentLink/models/dbModels";
import {
    getChargeDetailsFromAddress,
    getCurrencyDetails,
    updateChargeStatus,
    updatePendingAmount,
} from "../../../lib/mongo/db";
import {STATUS} from "../createPaymentLink/models/paymentModels";
import {isLedger} from "../createPaymentLink/models/withdrawModel";
import {withdrawEstimate, withdrawLedger} from "./components/withdraw";
import {sendWebhook} from "./components/webhook";

const handleWebhook = async (data: SubscriptionModel) => {
    console.log(JSON.stringify(data))
    if(data.subscriptionType === "ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION"){
        await updateChargeStatus(data.to,STATUS.PENDING)
    } else if(data.subscriptionType === "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION"){
        const result = await getChargeDetailsFromAddress(data.to)
        if(result && result.totalAmount){
            console.log(JSON.stringify(result))
            let chargeAmount: number
            const userAmountPaid = parseFloat(data.amount)
            if(result.pendingAmount){
                chargeAmount = parseFloat(result.pendingAmount)
            } else {
                chargeAmount = parseFloat(result.totalAmount)
            }
            console.log(userAmountPaid.toString())
            console.log(chargeAmount.toString())
            if(userAmountPaid >= chargeAmount){
                const wallet = await getCurrencyDetails(result.currency)
                if(typeof(wallet) == "boolean"){
                    return new Response("OK", {status: 200})
                }
                console.log(JSON.stringify(wallet))
                let txn: string | false | undefined
                if(isLedger(result.currency)){
                    if(!result.fees){
                        return new Response("OK", {status: 200})
                    }
                    txn = await withdrawLedger({address: result.merchantAddress, fees: result.fees, senderAccountId: wallet.accountId, amount: result.amount, mnemonic: wallet.mnemonic, xpub: wallet.xpub}, result.currency)
                } else {
                    if(!result.fees || !result.derivationKey || !result.gasLimit || !result.gasPrice){
                        return new Response("OK", {status: 200})
                    }

                    txn = await withdrawEstimate({address: result.merchantAddress,senderAccountId: wallet.accountId, amount: result.amount, mnemonic: wallet.mnemonic, derivationKey: result.derivationKey,gasPrice: result.gasPrice, gasLimit: result.gasLimit}, result.currency)
                }
                if(typeof(txn) == "string"){
                    console.log(txn)
                    await updateChargeStatus(data.to,STATUS.COMPLETED)
                    await sendWebhook(result.webhookUrl,result.chargeId,result.amount,result.currency,txn,result.metadata)
                } else {
                    console.error("Withdraw failed for some reason")
                    return new Response("OK", {status: 200})
                }

            } else {
                await updateChargeStatus(data.to, STATUS.PENDING_PAYMENT)
                if(result.pendingAmount){
                    const paidAmount = parseFloat(data.amount)
                    const totalAmount = parseFloat(result.totalAmount)
                    const pendingAmountData = parseFloat(result.pendingAmount)
                    await updatePendingAmount(data.to,(paidAmount - (totalAmount + pendingAmountData)).toFixed(8))
                } else {
                    const paidAmount = parseFloat(data.amount)
                    const totalAmount = parseFloat(result.totalAmount)
                    await updatePendingAmount(data.to,(paidAmount - totalAmount).toFixed(8))
                }
            }
        }
    }
}

/** @type {import('./$types').RequestHandler} */
export async function POST(request: RequestEvent) {
    const data: SubscriptionModel = await request.request.json()
    handleWebhook(data)
    return new Response("OK", {status: 200})
}