import type {RequestEvent} from '@sveltejs/kit'
import {
    createSubscription,
    generateAccount, generateDepositAddress,
    generateWalletFromCurrency
} from "../../../lib/tatum";
import {addCurrencyDetails, getCurrencyDetails} from "../../../lib/mongo/db";
import {createCharge, localCurrencyToCrypto, verifyCreatePaymentRequest} from "./utils";
import {calculateFees} from "./components/fees";

/** @type {import('./$types').RequestHandler} */
export async function POST(request: RequestEvent) {
    try {
        const json = await request.request.json()
        console.log(JSON.stringify(json))
        const paymentData = verifyCreatePaymentRequest(json)
        console.log(JSON.stringify(paymentData))
        if("error" in paymentData) {
            console.error(paymentData.msg)
            return new Response(JSON.stringify({error: true, success: false, msg: paymentData.msg}), {status: 400, headers: {"Content-Type": "application/json"}})
        }

        try {
            let result = await getCurrencyDetails(paymentData.currency)
            console.log(JSON.stringify(result))
            if(!result){
                try {
                    const generatedWallet = await generateWalletFromCurrency(paymentData.currency as keyof typeof String, true)
                    console.log(JSON.stringify(generatedWallet))
                    if ("xpub" in generatedWallet && "mnemonic" in generatedWallet) {
                        // @ts-ignore
                        let xpub: string = generatedWallet.xpub
                        // @ts-ignore
                        let mnemonic: string = generatedWallet.mnemonic

                        try {
                            const account = await generateAccount(paymentData.currency, xpub)
                            console.log(JSON.stringify(account))
                            if(!account){
                                console.error("ACCOUNT_CREATION_FAILED")
                                return new Response(JSON.stringify({success: false, error: true, msg: "ACCOUNT_CREATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                            }

                            result = {
                                accountId: account.id,
                                mnemonic: mnemonic,
                                xpub: xpub,
                                currency: paymentData.currency
                            }

                            console.log(JSON.stringify(result))

                            const response = await addCurrencyDetails(result)
                            console.log(JSON.stringify(response))
                            if(!response) {
                                console.error("CURRENCY_CONVERSION_FAILED")
                                return new Response(JSON.stringify({success: false, error: true, msg: "CURRENCY_CONVERSION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                            }

                        } catch(err: any){
                            console.error(err)
                            return new Response(JSON.stringify({success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                        }
                    } else {
                        console.error("ACCOUNT_GENERATE_FAILED")
                        return new Response(JSON.stringify({success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                    }
                } catch(err: any){
                    console.error(err)
                    return new Response(JSON.stringify({success: false, error: true, msg: "WALLET_GENERATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                }
            }

            // @ts-ignore
            if ("accountId" in result) {
                if(!process.env.VITE_WEBHOOK_HOST){
                    return new Response(JSON.stringify({success: false, error: true, msg: "ENV_MISSING"}), {status: 500,  headers: {"Content-Type": "application/json"}})
                }
                const res1 = await createSubscription(result.accountId, process.env.VITE_WEBHOOK_HOST + "/api/eventFromTatum")
                console.log(JSON.stringify(res1))
                if(!res1){
                    console.error("SUBSCRIPTION_FAILED")
                    return new Response(JSON.stringify({success: false, error: true, msg: "SUBSCRIPTION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                }

                const depositAddress = await generateDepositAddress(result.accountId)
                console.log(JSON.stringify(depositAddress))
                if(depositAddress) {
                    const cryptoAmount = await localCurrencyToCrypto(paymentData.amount,paymentData.localCurrency,paymentData.currency)
                    console.log(cryptoAmount.toString())
                    if(!cryptoAmount){
                        console.error("LOCAL_CURRENCY_CONVERSION_FAILED")
                        return new Response(JSON.stringify({success: false, error: true, msg: "LOCAL_CURRENCY_CONVERSION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                    }

                    const fees = await calculateFees(result.accountId,result.currency,result.xpub,paymentData.address,depositAddress.address,cryptoAmount.toFixed(8))
                    console.log(fees.toString())
                    if(!fees){
                        console.error("FEES_CALCULATION_FAILED")
                        return new Response(JSON.stringify({success: false, error: true, msg: "FEES_CALCULATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                    }

                    const paymentCharge = await createCharge(paymentData,depositAddress.address,depositAddress.derivationKey,cryptoAmount,fees)
                    console.log(JSON.stringify(paymentData))
                    if(!paymentCharge){
                        console.error("CHARGE_CREATION_FAILED")
                        return new Response(JSON.stringify({success: false, error: true, msg: "CHARGE_CREATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                    }

                    // @ts-ignore
                    delete paymentCharge['_id']
                    delete paymentCharge.derivationKey

                    return new Response(JSON.stringify({success: false, error: true, result: paymentCharge}), {status: 201, headers: {"Content-Type": "application/json"}})
                } else {
                    console.error("ADDRESS_INCREMENTATION_FAILED")
                    return new Response(JSON.stringify({success: false, error: true, msg: "ADDRESS_INCREMENTATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})
                }

            }

            console.error("ADDRESS_VERIFICATION_FAILED")
            return new Response(JSON.stringify({success: false, error: true, msg: "ADDRESS_VERIFICATION_FAILED"}), {status: 500, headers: {"Content-Type": "application/json"}})

        } catch(err: any){
            console.error(err)
            return new Response(JSON.stringify({success: false, error: true, msg: "UNABLE_TO_GET_DETAILS"}), {status: 500, headers: {"Content-Type": "application/json"}})
        }
    } catch(err: any){
        console.error(err)
        return new Response(JSON.stringify({success: false, error: true, msg: "BODY_SHOULD_BE_JSON"}), {status: 500, headers: {"Content-Type": "application/json"}})
    }
}