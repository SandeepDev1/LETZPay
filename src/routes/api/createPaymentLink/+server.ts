import type {RequestEvent} from '@sveltejs/kit'
import {
    createSubscription,
    generateAccount, generateDepositAddress,
    generateWalletFromCurrency
} from "./components/tatum";
import {addCurrencyDetails, getCurrencyDetails} from "../../../lib/mongo/db";
import {verifyCreatePaymentRequest} from "./utils";

/** @type {import('./$types').RequestHandler} */
export async function POST(request: RequestEvent) {
    try {
        const json = await request.request.json()
        const paymentData = verifyCreatePaymentRequest(json)
        if("error" in paymentData) {
            return new Response(JSON.stringify({error: true, success: false, msg: paymentData.msg}), {status: 400, headers: {"Content-Type": "application/json"}})
        }

        try {
            let result = await getCurrencyDetails(paymentData.currency)
            if(!result){
                try {
                    const generatedWallet = await generateWalletFromCurrency(paymentData.currency as keyof typeof String, true)

                    if ("xpub" in generatedWallet && "mnemonic" in generatedWallet) {
                        // @ts-ignore
                        let xpub: string = generatedWallet.xpub
                        // @ts-ignore
                        let mnemonic: string = generatedWallet.mnemonic

                        try {
                            const account = await generateAccount(paymentData.currency, xpub)
                            result = {
                                accountId: account.id,
                                mnemonic: mnemonic,
                                xpub: xpub,
                                currency: paymentData.currency
                            }

                            const response = await addCurrencyDetails(result)
                            if(!response) {
                                return new Response(JSON.stringify({success: false, error: true, msg: "ACCOUNT_CREATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                            }

                        } catch(err){
                            console.error(err)
                            return new Response(JSON.stringify({success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED"}), {status: 500, headers: {
                                        "Content-Type": "application/json"
                                    }})
                        }
                    } else {
                        return new Response(JSON.stringify({success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                    }
                } catch(err){
                    console.error(err)
                    return new Response(JSON.stringify({success: false, error: true, msg: "WALLET_GENERATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                }
            }

            // @ts-ignore
            if ("accountId" in result) {
                const res1 = await createSubscription(result.accountId, import.meta.env.VITE_WEBHOOK_HOST + "/api/eventFromTatum")
                if(!res1){
                    return new Response(JSON.stringify({success: false, error: true, msg: "SUBSCRIPTION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                }

                const depositAddress = await generateDepositAddress(result.accountId)
                if(depositAddress) {
                    return new Response(JSON.stringify({success: true, error: false, result: {address: depositAddress, currency: paymentData.currency,}}), {status: 201, headers: {"Content-Type": "application/json"}})
                } else {
                    return new Response(JSON.stringify({success: false, error: true, msg: "ADDRESS_INCREMENTATION_FAILED"}), {status: 201, headers: {"Content-Type": "application/json"}})
                }

            }

            return new Response(JSON.stringify({success: false, error: true, msg: "ADDRESS_VERIFICATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})

        } catch(err){
            console.error(err)
            return new Response(JSON.stringify({success: false, error: true, msg: "UNABLE_TO_GET_DETAILS"}), {status: 500, headers: {"Content-Type": "application/json"}})
        }
    } catch(err){
        console.error(err)
        return new Response(JSON.stringify({success: false, error: true, msg: "BODY_SHOULD_BE_JSON"}))
    }
}