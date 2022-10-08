import type {RequestEvent} from '@sveltejs/kit'
import {generateAccount, generateWalletFromCurrency} from "./components/tatum";
import {checkIfWeSupportCurrency} from "./components/utils";
import {addCurrencyDetails, getCurrencyDetails} from "../../../lib/mongo/db";

/** @type {import('./$types').RequestHandler} */
export async function GET(request: RequestEvent) {
    const currency = request.url.searchParams.get("currency")
    if(!currency || currency.length == 0){
        return new Response(
            JSON.stringify({
                success: false,
                error: true,
                msg: "currency parameter is missing"
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }

    if(!checkIfWeSupportCurrency(currency)){
        return new Response(JSON.stringify(
            {
                success: false,
                error: true,
                msg: "currency is not supported"
            }
        ), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    try {

        let result = await getCurrencyDetails(currency)
        if(!result){
            try {
                const generatedWallet = await generateWalletFromCurrency(currency as keyof typeof String, true)

                if ("xpub" in generatedWallet && "mnemonic" in generatedWallet) {
                    // @ts-ignore
                    let xpub: string = generatedWallet.xpub
                    // @ts-ignore
                    let mnemonic: string = generatedWallet.mnemonic

                    try {
                        const account = await generateAccount(currency, xpub)
                        result = {
                            accountId: account.id,
                            mnemonic: mnemonic,
                            xpub: xpub,
                            currency: currency
                        }

                        const response = await addCurrencyDetails(result)
                        if(!response) {
                            return new Response(
                                JSON.stringify({
                                    success: false,
                                    error: true,
                                    msg: "ACCOUNT_CREATION_FAILED"
                                }), {
                                    status: 500,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }
                            )
                        }
                    } catch(err){
                        console.error(err)
                        return new Response(
                            JSON.stringify({
                                success: false,
                                error: true,
                                msg: "ACCOUNT_GENERATE_FAILED"
                            }), {
                                status: 500,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }
                        )
                    }
                } else {
                    return new Response(
                        JSON.stringify({
                            success: false,
                            error: true,
                            msg: "ACCOUNT_GENERATE_FAILED"
                        }), {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )
                }
            } catch(err){
                console.error(err)
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: true,
                        msg: "WALLET_GENERATION_FAILED"
                    }), {
                        status: 500,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
            }
        }

        return new Response(
            JSON.stringify(
                result
            ),
            {
                status: 201,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

    } catch(err){
        console.error(err)
        return new Response(
            JSON.stringify({
                success: false,
                error: true,
                msg: "UNABLE_TO_GET_DETAILS"
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }

}