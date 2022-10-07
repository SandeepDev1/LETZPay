import type {RequestEvent} from '@sveltejs/kit'
import {generateAccount, generateWalletFromCurrency} from "./components/tatum";
import {checkIfWeSupportCurrency} from "./components/utils";
import {getCurrencyDetails} from "../../../lib/mongo/db";

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

    const result = await getCurrencyDetails(currency)
    console.log(result)
    if(!result){
        const wallet = await generateWalletFromCurrency(currency as keyof typeof String, true)
        console.log(wallet)

        const account = await generateAccount(currency,wallet.xpub)
    }

    return new Response(
        JSON.stringify(
            wallet
        ),
        {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        }
    )


}