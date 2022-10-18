
export const sendWebhook = async (url: string, chargeId: string, amount: string, currency: string, txn: string) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chargeId,
            amount,
            currency,
            txn
        })
    })
}