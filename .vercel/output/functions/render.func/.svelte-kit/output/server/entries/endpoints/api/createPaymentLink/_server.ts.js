import Tatum, { Currency, SubscriptionType } from "@tatumio/tatum";
import { g as getWebhookSubscriptionDetails, a as addWebhookSubscriptionDetails, l as localCurrency, c as currencies, S as STATUS, b as addPaymentCharge, d as getCurrencyDetails, e as addCurrencyDetails } from "../../../../chunks/paymentModels.js";
import { v4 } from "uuid";
import fetch$1 from "node-fetch";
const generateWalletFromCurrency = async (currency, testnet) => {
  return Tatum.generateWallet(Currency[currency], testnet);
};
const generateAccount = async (currency, xpub) => {
  return Tatum.createAccount({ currency, xpub });
};
const createSubscription = async (accountId, url) => {
  try {
    if (!await getWebhookSubscriptionDetails(accountId, SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION)) {
      const sub1 = await Tatum.createNewSubscription({ type: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION, attr: { id: accountId, url } });
      await addWebhookSubscriptionDetails({ accountId, subscriptionId: sub1.id, subscriptionType: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION });
    }
    if (!await getWebhookSubscriptionDetails(accountId, SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION)) {
      const sub2 = await Tatum.createNewSubscription({ type: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION, attr: { id: accountId, url } });
      await addWebhookSubscriptionDetails({ accountId, subscriptionId: sub2.id, subscriptionType: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION });
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const generateDepositAddress = async (accountId) => {
  try {
    const address = await Tatum.generateDepositAddress(accountId);
    console.log(address);
    return { address: address.address, derivationKey: address.derivationKey };
  } catch (err) {
    console.error(err);
    return false;
  }
};
const verifyCreatePaymentRequest = (data) => {
  let paymentData = {
    address: "",
    amount: "",
    localCurrency: "",
    webhookUrl: "",
    currency: "",
    metadata: ""
  };
  if (!("address" in data)) {
    return { error: true, msg: "ADDRESS_FIELD_MISSING" };
  }
  paymentData.address = data["address"];
  if (!("amount" in data)) {
    return { error: true, msg: "AMOUNT_FIELD_MISSING" };
  }
  paymentData.amount = data["amount"];
  if (!("localCurrency" in data)) {
    return { error: true, msg: "LOCAL_CURRENCY_FIELD_MISSING" };
  }
  paymentData.localCurrency = data["localCurrency"];
  if (!(paymentData.localCurrency in localCurrency)) {
    return { error: true, msg: `We only support these local currencies ${Object.keys(localCurrency).join(" , ")}` };
  }
  if (!("webhookUrl" in data)) {
    return { error: true, msg: "WEBHOOK_URL_FIELD_MISSING" };
  }
  paymentData.webhookUrl = data["webhookUrl"];
  if (!("currency" in data)) {
    return { error: true, msg: "CURRENCY_FIELD_MISSING" };
  }
  paymentData.currency = data["currency"];
  if (!(paymentData.currency in currencies)) {
    return { error: true, msg: `We only support these crypto currencies ${Object.keys(currencies).join(" , ")}` };
  }
  if ("metadata" in data) {
    if (typeof data["metadata"] != "string") {
      return { error: true, msg: "metadata should be in string. Please stringify your data to convert into string" };
    }
    paymentData.metadata = data["metadata"];
  }
  return paymentData;
};
const getCryptoPrice = async (crypto, localCurrency2) => {
  try {
    const res = await fetch(`https://api.coinbase.com/v2/prices/${crypto}-${localCurrency2}/spot`);
    if (res.status == 200) {
      const json = await res.json();
      return parseFloat(json.data.amount);
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
const localCurrencyToCrypto = async (amount, localCurrency2, currency) => {
  const price = await getCryptoPrice(currency, localCurrency2);
  if (!price) {
    return false;
  }
  return parseFloat(amount) / price;
};
const createCharge = async (data, depositAddress, derivationKey, cryptoAmount, fees) => {
  try {
    const uid = v4().toString();
    const payment = {
      chargeId: uid,
      status: STATUS.CREATED,
      createdAt: Date.now(),
      address: depositAddress,
      merchantAddress: data.address,
      localCurrency: data.localCurrency,
      localAmount: data.amount,
      amount: cryptoAmount.toFixed(8),
      currency: data.currency,
      webhookUrl: data.webhookUrl,
      derivationKey,
      metadata: data.metadata
    };
    if (typeof fees == "string") {
      payment.fees = fees;
      payment.totalAmount = (parseFloat(fees) + parseFloat(cryptoAmount.toFixed(8))).toFixed(8);
    } else {
      payment.fees = fees.fees;
      payment.gasPrice = fees.gasPrice;
      payment.gasLimit = fees.gasLimit;
      payment.totalAmount = (parseFloat(fees.fees) + parseFloat(cryptoAmount.toFixed(8))).toFixed(8);
    }
    await addPaymentCharge(payment);
    return payment;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const estimateEthFees = async (from, to, amount) => {
  try {
    const data = await Tatum.ethEstimateGas({ from, to, amount });
    return data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const estimateCeloFees = async (from, to, amount) => {
  try {
    const res = await fetch$1("https://api-eu1.tatum.io/v3/celo/gas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
      },
      body: JSON.stringify({
        from,
        to,
        amount
      })
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const estimateKcsFees = async (from, to, amount) => {
  try {
    const res = await fetch$1("https://api-eu1.tatum.io/v3/kcs/gas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
      },
      body: JSON.stringify({
        from,
        to,
        amount
      })
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const estimateKlayFees = async (from, to, amount) => {
  try {
    const data = await Tatum.klaytnEstimateGas({ from, to, amount });
    return data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const estimateMaticFees = async (from, to, amount) => {
  try {
    const data = await Tatum.polygonEstimateGas({ from, to, amount });
    return data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const estimateXdcFees = async (from, to, amount) => {
  try {
    const data = await Tatum.xdcEstimateGas({ from, to, amount });
    return data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const estimateLedgerFees = async (senderAccountId, toAddress, amount, xpub) => {
  try {
    const res = await fetch$1(
      `https://api-eu1.tatum.io/v3/offchain/blockchain/estimate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
        },
        body: JSON.stringify({
          senderAccountId,
          address: toAddress,
          amount,
          xpub
        })
      }
    );
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const calculateFees = async (accountId, currency, xpub, merchantAddress, fromAddress, amount) => {
  let amountFloat = 0;
  let amountInt = 0;
  let gwei = 0;
  let price = 0;
  let usdFees = 0;
  switch (currency) {
    case "BTC":
      const btcFees = await estimateLedgerFees(accountId, merchantAddress, amount, xpub);
      if (!btcFees) {
        return false;
      }
      return btcFees.medium;
    case "LTC":
      const ltcFees = await estimateLedgerFees(accountId, merchantAddress, amount, xpub);
      if (!ltcFees) {
        return false;
      }
      return ltcFees.medium;
    case "DOGE":
      const dogeFees = await estimateLedgerFees(accountId, merchantAddress, amount, xpub);
      if (!dogeFees) {
        return false;
      }
      return dogeFees.medium;
    case "BCH":
      const bchFees = await estimateLedgerFees(accountId, merchantAddress, amount, xpub);
      if (!bchFees) {
        return false;
      }
      return bchFees.medium;
    case "ETH":
      amountFloat = parseFloat(amount);
      amountInt = amountFloat * 1e8;
      amount = String(amountInt);
      const ethFees = await estimateEthFees(fromAddress, merchantAddress, amount);
      if (!ethFees) {
        return false;
      }
      gwei = parseInt(ethFees.gasPrice) / 1e8;
      price = await getCryptoPrice("ETH", "USD");
      if (!price) {
        return false;
      }
      usdFees = gwei * price * 1e-9;
      return {
        fees: usdFees.toFixed(8),
        gasLimit: ethFees.gasLimit,
        gasPrice: ethFees.gasPrice
      };
    case "CELO":
      amountFloat = parseFloat(amount);
      amountInt = amountFloat * 1e8;
      amount = String(amountInt);
      const celoFees = await estimateCeloFees(fromAddress, merchantAddress, amount);
      if (!celoFees) {
        return false;
      }
      gwei = parseInt(celoFees.gasPrice) / 1e8;
      price = await getCryptoPrice("CELO", "USD");
      if (!price) {
        return false;
      }
      usdFees = gwei * price * 1e-9;
      return {
        fees: usdFees.toFixed(8),
        gasLimit: String(celoFees.gasLimit),
        gasPrice: celoFees.gasPrice
      };
    case "KCS":
      amountFloat = parseFloat(amount);
      amountInt = amountFloat * 1e8;
      amount = String(amountInt);
      const kcsFees = await estimateKcsFees(fromAddress, merchantAddress, amount);
      if (!kcsFees) {
        return false;
      }
      gwei = parseInt(kcsFees.gasPrice) / 1e8;
      price = await getCryptoPrice("KCS", "USD");
      if (!price) {
        return false;
      }
      usdFees = gwei * price * 1e-9;
      return {
        fees: usdFees.toFixed(8),
        gasLimit: kcsFees.gasLimit,
        gasPrice: kcsFees.gasPrice
      };
    case "KLAY":
      amountFloat = parseFloat(amount);
      amountInt = amountFloat * 1e8;
      amount = String(amountInt);
      const klayFees = await estimateKlayFees(fromAddress, merchantAddress, amount);
      if (!klayFees) {
        return false;
      }
      gwei = parseInt(klayFees.gasPrice) / 1e8;
      price = await getCryptoPrice("KLAY", "USD");
      if (!price) {
        return false;
      }
      usdFees = gwei * price * 1e-9;
      return {
        fees: usdFees.toFixed(8),
        gasLimit: klayFees.gasLimit,
        gasPrice: klayFees.gasPrice
      };
    case "MATIC":
      amountFloat = parseFloat(amount);
      amountInt = amountFloat * 1e8;
      amount = String(amountInt);
      const maticFees = await estimateMaticFees(fromAddress, merchantAddress, amount);
      if (!maticFees) {
        return false;
      }
      gwei = parseInt(maticFees.gasPrice) / 1e8;
      price = await getCryptoPrice("MATIC", "USD");
      if (!price) {
        return false;
      }
      usdFees = gwei * price * 1e-9;
      return {
        fees: usdFees.toFixed(8),
        gasLimit: maticFees.gasLimit,
        gasPrice: maticFees.gasPrice
      };
    case "XDC":
      amountFloat = parseFloat(amount);
      amountInt = amountFloat * 1e8;
      amount = String(amountInt);
      const xdcFees = await estimateXdcFees(fromAddress, merchantAddress, amount);
      if (!xdcFees) {
        return false;
      }
      gwei = parseInt(xdcFees.gasPrice) / 1e8;
      price = await getCryptoPrice("XDC", "USD");
      if (!price) {
        return false;
      }
      usdFees = gwei * price * 1e-9;
      return {
        fees: usdFees.toFixed(8),
        gasLimit: xdcFees.gasLimit,
        gasPrice: xdcFees.gasPrice
      };
    default:
      return false;
  }
};
async function POST(request) {
  try {
    const json = await request.request.json();
    const paymentData = verifyCreatePaymentRequest(json);
    if ("error" in paymentData) {
      return new Response(JSON.stringify({ error: true, success: false, msg: paymentData.msg }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    try {
      let result = await getCurrencyDetails(paymentData.currency);
      if (!result) {
        try {
          const generatedWallet = await generateWalletFromCurrency(paymentData.currency, true);
          if ("xpub" in generatedWallet && "mnemonic" in generatedWallet) {
            let xpub = generatedWallet.xpub;
            let mnemonic = generatedWallet.mnemonic;
            try {
              const account = await generateAccount(paymentData.currency, xpub);
              result = {
                accountId: account.id,
                mnemonic,
                xpub,
                currency: paymentData.currency
              };
              const response = await addCurrencyDetails(result);
              if (!response) {
                return new Response(JSON.stringify({ success: false, error: true, msg: "ACCOUNT_CREATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
              }
            } catch (err) {
              console.error(err);
              return new Response(JSON.stringify({ success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
          } else {
            return new Response(JSON.stringify({ success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
        } catch (err) {
          console.error(err);
          return new Response(JSON.stringify({ success: false, error: true, msg: "WALLET_GENERATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      }
      if ("accountId" in result) {
        const res1 = await createSubscription(result.accountId, "https://w-eight.vercel.app/webhook");
        if (!res1) {
          return new Response(JSON.stringify({ success: false, error: true, msg: "SUBSCRIPTION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        const depositAddress = await generateDepositAddress(result.accountId);
        if (depositAddress) {
          const cryptoAmount = await localCurrencyToCrypto(paymentData.amount, paymentData.localCurrency, paymentData.currency);
          if (!cryptoAmount) {
            return new Response(JSON.stringify({ success: false, error: true, msg: "LOCAL_CURRENCY_CONVERSION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
          const fees = await calculateFees(result.accountId, result.currency, result.xpub, paymentData.address, depositAddress.address, cryptoAmount.toFixed(8));
          if (!fees) {
            return new Response(JSON.stringify({ success: false, error: true, msg: "FEES_CALCULATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
          const paymentCharge = await createCharge(paymentData, depositAddress.address, depositAddress.derivationKey, cryptoAmount, fees);
          if (!paymentCharge) {
            return new Response(JSON.stringify({ success: false, error: true, msg: "CHARGE_CREATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
          delete paymentCharge["_id"];
          delete paymentCharge.derivationKey;
          return new Response(JSON.stringify({ success: false, error: true, result: paymentCharge }), { status: 201, headers: { "Content-Type": "application/json" } });
        } else {
          return new Response(JSON.stringify({ success: false, error: true, msg: "ADDRESS_INCREMENTATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      }
      return new Response(JSON.stringify({ success: false, error: true, msg: "ADDRESS_VERIFICATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ success: false, error: true, msg: "UNABLE_TO_GET_DETAILS" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: true, msg: "BODY_SHOULD_BE_JSON" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
export {
  POST
};
