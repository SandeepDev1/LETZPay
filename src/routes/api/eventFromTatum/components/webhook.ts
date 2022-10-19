import { logtail } from "../../../../lib/logs";

export const sendWebhook = async (url: string, chargeId: string, amount: string, currency: string, txn: string, metadata: string) => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chargeId,
                amount,
                currency,
                txn,
                metadata
            })
        })
    } catch(err: any){
        await logtail.error(err)
    }

}