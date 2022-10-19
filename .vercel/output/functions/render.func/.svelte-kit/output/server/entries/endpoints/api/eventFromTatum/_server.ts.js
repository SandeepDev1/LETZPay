import { u as updateChargeStatus, f as getChargeDetailsFromAddress, d as getCurrencyDetails, h as updatePendingAmount, S as STATUS } from "../../../../chunks/paymentModels.js";
const currencyWithdrawName = {
  "BTC": "bitcoin",
  "LTC": "litecoin",
  "BCH": "bcash",
  "DOGE": "dogecoin",
  "ETH": "ethereum",
  "MATIC": "polygon"
};
const isLedger = (currency) => {
  return !(currency == "ETH" || currency == "MATIC");
};
const withdrawLedger = async (data, currency) => {
  try {
    console.log(data);
    if (!currency || !(currency in currencyWithdrawName)) {
      return false;
    }
    data.fees = parseFloat(data.fees).toFixed(8);
    const currencyName = currencyWithdrawName[currency];
    console.log(currencyName);
    const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
      method: "POST",
      headers: {
        "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          "senderAccountId": data.senderAccountId,
          "address": data.address,
          "amount": data.amount,
          "mnemonic": data.mnemonic,
          "xpub": data.xpub,
          "fee": data.fees
        }
      )
    });
    const json = await res.json();
    console.log(json);
    if (!json.completed) {
      const res2 = await fetch(`https://api-eu1.tatum.io/v3/offchain/withdrawal/${json.id}/${json.txId}`, {
        method: "PUT",
        headers: {
          "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
        }
      });
      if (res2.status == 204) {
        return json.txId;
      }
      const dataJson = await res2.json();
      console.error(dataJson);
      return false;
    }
    return json.txId;
  } catch (err) {
    console.log(err);
  }
};
const withdrawEstimate = async (data, currency) => {
  try {
    if (!currency || !(currency in currencyWithdrawName)) {
      return false;
    }
    const currencyName = currencyWithdrawName[currency];
    console.log(currencyName);
    const res = await fetch(`https://api-eu1.tatum.io/v3/offchain/${currencyName}/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
      },
      body: JSON.stringify(
        {
          "senderAccountId": data.senderAccountId,
          "address": data.address,
          "amount": data.amount,
          "mnemonic": data.mnemonic,
          "gasLimit": data.gasLimit,
          "gasPrice": data.gasPrice,
          "index": data.derivationKey
        }
      )
    });
    const json = await res.json();
    if (!json.completed) {
      const res2 = await fetch(`https://api-eu1.tatum.io/v3/offchain/withdrawal/${json.id}/${json.txId}`, {
        method: "PUT",
        headers: {
          "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
        }
      });
      if (res2.status == 204) {
        return json.txId;
      }
      const dataJson = await res2.json();
      console.error(dataJson);
      return false;
    }
    return json.txId;
  } catch (err) {
    console.log(err);
  }
};
const sendWebhook = async (url, chargeId, amount, currency, txn, metadata) => {
  await fetch(url, {
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
  });
};
async function POST(request) {
  const data = await request.request.json();
  console.log(data);
  if (data.subscriptionType === "ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION") {
    await updateChargeStatus(data.to, STATUS.PENDING);
  } else if (data.subscriptionType === "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION") {
    const result = await getChargeDetailsFromAddress(data.to);
    console.log(result);
    if (result && result.totalAmount) {
      let chargeAmount;
      const userAmountPaid = parseFloat(data.amount);
      if (result.pendingAmount) {
        chargeAmount = parseFloat(result.pendingAmount);
      } else {
        chargeAmount = parseFloat(result.totalAmount);
      }
      if (userAmountPaid >= chargeAmount) {
        const wallet = await getCurrencyDetails(result.currency);
        console.log(wallet);
        if (typeof wallet == "boolean") {
          return new Response("OK", { status: 200 });
        }
        let txn;
        if (isLedger(result.currency)) {
          if (!result.fees) {
            return new Response("OK", { status: 200 });
          }
          txn = await withdrawLedger({ address: result.merchantAddress, fees: result.fees, senderAccountId: wallet.accountId, amount: result.amount, mnemonic: wallet.mnemonic, xpub: wallet.xpub }, result.currency);
        } else {
          if (!result.fees || !result.derivationKey || !result.gasLimit || !result.gasPrice) {
            return new Response("OK", { status: 200 });
          }
          txn = await withdrawEstimate({ address: result.merchantAddress, senderAccountId: wallet.accountId, amount: result.amount, mnemonic: wallet.mnemonic, derivationKey: result.derivationKey, gasPrice: result.gasPrice, gasLimit: result.gasLimit }, result.currency);
        }
        if (typeof txn == "string") {
          await updateChargeStatus(data.to, STATUS.COMPLETED);
          await sendWebhook(result.webhookUrl, result.chargeId, result.amount, result.currency, txn, result.metadata);
        } else {
          console.error("Withdraw failed for some reason");
          return new Response("OK", { status: 200 });
        }
      } else {
        await updateChargeStatus(data.to, STATUS.PENDING_PAYMENT);
        if (result.pendingAmount) {
          const paidAmount = parseFloat(data.amount);
          const totalAmount = parseFloat(result.totalAmount);
          const pendingAmountData = parseFloat(result.pendingAmount);
          await updatePendingAmount(data.to, (paidAmount - (totalAmount + pendingAmountData)).toFixed(8));
        } else {
          const paidAmount = parseFloat(data.amount);
          const totalAmount = parseFloat(result.totalAmount);
          await updatePendingAmount(data.to, (paidAmount - totalAmount).toFixed(8));
        }
      }
    }
  }
  return new Response("OK", { status: 200 });
}
export {
  POST
};
