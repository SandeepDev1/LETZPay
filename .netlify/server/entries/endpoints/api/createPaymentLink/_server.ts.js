import { l as logtail, g as getWebhookSubscriptionDetails, a as addWebhookSubscriptionDetails, S as STATUS, b as addPaymentCharge, c as getCurrencyDetails, d as addCurrencyDetails } from "../../../../chunks/paymentModels.js";
import bip39 from "bip39";
import bitcoinjs_lib from "bitcoinjs-lib";
import EthereumHDKey from "ethereumjs-wallet/hdkey.js";
import hdkey_1 from "hdkey";
import fetch$1 from "node-fetch";
import { uuid } from "uuidv4";
const ETH_DERIVATION_PATH = "m/44'/60'/0'/0";
const MATIC_DERIVATION_PATH = "m/44'/966'/0'/0";
const BTC_DERIVATION_PATH = "m/44'/0'/0'/0";
const LTC_DERIVATION_PATH = "m/44'/2'/0'/0";
const DOGE_DERIVATION_PATH = "m/44'/3'/0'/0";
const BCH_DERIVATION_PATH = "m/44'/145'/0'/0";
const TESTNET_DERIVATION_PATH = "m/44'/1'/0'/0";
const Currency = {
  BTC: "BTC",
  LTC: "LTC",
  BCH: "BCH",
  DOGE: "DOGE",
  ETH: "ETH",
  MATIC: "MATIC"
};
const LocalCurrency = {
  USD: "USD",
  INR: "INR",
  EUR: "EUR",
  JPY: "JPY",
  GBP: "GBP",
  AUD: "AUD",
  CAD: "CAD",
  CHF: "CHF",
  CNH: "CNH",
  HKD: "HKD",
  NZD: "NZD"
};
const SubscriptionType = {
  ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION: "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION",
  ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION: "ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION"
};
const generateEthWallet = async (testnet, mnem) => {
  const path = testnet ? TESTNET_DERIVATION_PATH : ETH_DERIVATION_PATH;
  const hdwallet = EthereumHDKey.fromMasterSeed(await bip39.mnemonicToSeed(mnem));
  const derivePath = hdwallet.derivePath(path);
  return {
    xpub: derivePath.publicExtendedKey().toString(),
    mnemonic: mnem
  };
};
const generatePolygonWallet = async (testnet, mnem) => {
  const path = testnet ? TESTNET_DERIVATION_PATH : MATIC_DERIVATION_PATH;
  const hdwallet = EthereumHDKey.fromMasterSeed(await bip39.mnemonicToSeed(mnem));
  const derivePath = hdwallet.derivePath(path);
  return {
    xpub: derivePath.publicExtendedKey().toString(),
    mnemonic: mnem
  };
};
const generateBchWallet = async (testnet, mnem) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? bitcoinjs_lib.networks.testnet.bip32 : bitcoinjs_lib.networks.bitcoin.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : BCH_DERIVATION_PATH).toJSON().xpub
  };
};
const generateBtcWallet = async (testnet, mnem) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? bitcoinjs_lib.networks.testnet.bip32 : bitcoinjs_lib.networks.bitcoin.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : BTC_DERIVATION_PATH).toJSON().xpub
  };
};
const generateDogeWallet = async (testnet, mnem) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? DOGE_TEST_NETWORK.bip32 : DOGE_NETWORK.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : DOGE_DERIVATION_PATH).toJSON().xpub
  };
};
const generateLtcWallet = async (testnet, mnem) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? LTC_TEST_NETWORK.bip32 : LTC_NETWORK.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : LTC_DERIVATION_PATH).toJSON().xpub
  };
};
const generateWallet = (currency, testnet) => {
  const mnem = bip39.generateMnemonic(256);
  switch (currency) {
    case Currency.BTC:
      return generateBtcWallet(testnet, mnem);
    case Currency.DOGE:
      return generateDogeWallet(testnet, mnem);
    case Currency.LTC:
      return generateLtcWallet(testnet, mnem);
    case Currency.BCH:
      return generateBchWallet(testnet, mnem);
    case Currency.ETH:
      return generateEthWallet(testnet, mnem);
    case Currency.MATIC:
      return generatePolygonWallet(testnet, mnem);
    default:
      throw new Error("Unsupported blockchain.");
  }
};
const generateWalletFromCurrency = async (currency, testnet) => {
  return generateWallet(currency, testnet);
};
const generateAccount = async (currency, xpub) => {
  try {
    const res = await fetch$1("https://api-eu1.tatum.io/v3/ledger/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
      },
      body: JSON.stringify({
        currency,
        xpub
      })
    });
    const json = await res.json();
    await logtail.info(JSON.stringify(json));
    return json;
  } catch (err) {
    await logtail.error(err);
    return false;
  }
};
const createNewSubscription = async (data) => {
  try {
    const res = await fetch$1("https://api-eu1.tatum.io/v3/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    await logtail.error(err);
    return false;
  }
};
const createSubscription = async (accountId, url) => {
  try {
    if (!await getWebhookSubscriptionDetails(accountId, SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION)) {
      const sub1 = await createNewSubscription({ type: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION, attr: { id: accountId, url } });
      if (typeof sub1 !== "boolean") {
        await addWebhookSubscriptionDetails({
          accountId,
          subscriptionId: sub1.id,
          subscriptionType: SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION
        });
      } else {
        return false;
      }
    }
    if (!await getWebhookSubscriptionDetails(accountId, SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION)) {
      const sub2 = await createNewSubscription({ type: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION, attr: { id: accountId, url } });
      if (typeof sub2 !== "boolean") {
        await addWebhookSubscriptionDetails({
          accountId,
          subscriptionId: sub2.id,
          subscriptionType: SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION
        });
      } else {
        return false;
      }
    }
    return true;
  } catch (err) {
    await logtail.error(err.toString());
    return false;
  }
};
const generateDepositAddress = async (accountId) => {
  try {
    const res = await fetch$1(`https://api-eu1.tatum.io/v3/offchain/account/${accountId}/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "d5e48d10-1eeb-4a8f-b6c4-0cb4238e31ae_100"
      }
    });
    let json = await res.json();
    const address = json;
    await logtail.info(JSON.stringify(address));
    return { address: address.address, derivationKey: address.derivationKey };
  } catch (err) {
    await logtail.error(err.toString());
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
  if (!(paymentData.localCurrency in LocalCurrency)) {
    return { error: true, msg: `We only support these local currencies ${Object.keys(LocalCurrency).join(" , ")}` };
  }
  if (!("webhookUrl" in data)) {
    return { error: true, msg: "WEBHOOK_URL_FIELD_MISSING" };
  }
  paymentData.webhookUrl = data["webhookUrl"];
  if (!("currency" in data)) {
    return { error: true, msg: "CURRENCY_FIELD_MISSING" };
  }
  paymentData.currency = data["currency"];
  if (!(paymentData.currency in Currency)) {
    return { error: true, msg: `We only support these crypto currencies ${Object.keys(Currency).join(" , ")}` };
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
    const text = await res.text();
    await logtail.info(text);
    if (res.status == 200) {
      const json = JSON.parse(text);
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
    const uid = uuid().toString();
    await logtail.info(uid);
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
    await logtail.error(err);
    return false;
  }
};
const estimateEthFees = async (from, to, amount) => {
  try {
    const res = await fetch$1("https://api-eu1.tatum.io/v3/ethereum/gas", {
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
    await logtail.error(err);
    return false;
  }
};
const estimateMaticFees = async (from, to, amount) => {
  try {
    const res = await fetch$1("https://api-eu1.tatum.io/v3/polygon/gas", {
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
    await logtail.error(err);
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
    await logtail.info(JSON.stringify(data));
    return data;
  } catch (err) {
    await logtail.error(err);
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
    default:
      return false;
  }
};
async function POST(request) {
  try {
    const json = await request.request.json();
    await logtail.info(JSON.stringify(json));
    const paymentData = verifyCreatePaymentRequest(json);
    await logtail.info(JSON.stringify(paymentData));
    if ("error" in paymentData) {
      await logtail.error(paymentData.msg);
      return new Response(JSON.stringify({ error: true, success: false, msg: paymentData.msg }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    try {
      let result = await getCurrencyDetails(paymentData.currency);
      await logtail.info(JSON.stringify(result));
      if (!result) {
        try {
          const generatedWallet = await generateWalletFromCurrency(paymentData.currency, true);
          await logtail.info(JSON.stringify(generatedWallet));
          if ("xpub" in generatedWallet && "mnemonic" in generatedWallet) {
            let xpub = generatedWallet.xpub;
            let mnemonic = generatedWallet.mnemonic;
            try {
              const account = await generateAccount(paymentData.currency, xpub);
              await logtail.info(JSON.stringify(account));
              if (!account) {
                await logtail.error("ACCOUNT_CREATION_FAILED");
                return new Response(JSON.stringify({ success: false, error: true, msg: "ACCOUNT_CREATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
              }
              result = {
                accountId: account.id,
                mnemonic,
                xpub,
                currency: paymentData.currency
              };
              await logtail.info(JSON.stringify(result));
              const response = await addCurrencyDetails(result);
              await logtail.info(JSON.stringify(response));
              if (!response) {
                await logtail.error("CURRENCY_CONVERSION_FAILED");
                return new Response(JSON.stringify({ success: false, error: true, msg: "CURRENCY_CONVERSION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
              }
            } catch (err) {
              await logtail.error(err);
              return new Response(JSON.stringify({ success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
          } else {
            await logtail.error("ACCOUNT_GENERATE_FAILED");
            return new Response(JSON.stringify({ success: false, error: true, msg: "ACCOUNT_GENERATE_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
        } catch (err) {
          await logtail.error(err);
          return new Response(JSON.stringify({ success: false, error: true, msg: "WALLET_GENERATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      }
      if ("accountId" in result) {
        const res1 = await createSubscription(result.accountId, "https://letz-chi.vercel.app/eventFromTatum");
        await logtail.info(JSON.stringify(res1));
        if (!res1) {
          await logtail.error("SUBSCRIPTION_FAILED");
          return new Response(JSON.stringify({ success: false, error: true, msg: "SUBSCRIPTION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        const depositAddress = await generateDepositAddress(result.accountId);
        await logtail.info(JSON.stringify(depositAddress));
        if (depositAddress) {
          const cryptoAmount = await localCurrencyToCrypto(paymentData.amount, paymentData.localCurrency, paymentData.currency);
          await logtail.info(cryptoAmount.toString());
          if (!cryptoAmount) {
            await logtail.error("LOCAL_CURRENCY_CONVERSION_FAILED");
            return new Response(JSON.stringify({ success: false, error: true, msg: "LOCAL_CURRENCY_CONVERSION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
          const fees = await calculateFees(result.accountId, result.currency, result.xpub, paymentData.address, depositAddress.address, cryptoAmount.toFixed(8));
          await logtail.info(fees.toString());
          if (!fees) {
            await logtail.error("FEES_CALCULATION_FAILED");
            return new Response(JSON.stringify({ success: false, error: true, msg: "FEES_CALCULATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
          const paymentCharge = await createCharge(paymentData, depositAddress.address, depositAddress.derivationKey, cryptoAmount, fees);
          await logtail.info(JSON.stringify(paymentData));
          if (!paymentCharge) {
            await logtail.error("CHARGE_CREATION_FAILED");
            return new Response(JSON.stringify({ success: false, error: true, msg: "CHARGE_CREATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
          delete paymentCharge["_id"];
          delete paymentCharge.derivationKey;
          return new Response(JSON.stringify({ success: false, error: true, result: paymentCharge }), { status: 201, headers: { "Content-Type": "application/json" } });
        } else {
          await logtail.error("ADDRESS_INCREMENTATION_FAILED");
          return new Response(JSON.stringify({ success: false, error: true, msg: "ADDRESS_INCREMENTATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      }
      await logtail.error("ADDRESS_VERIFICATION_FAILED");
      return new Response(JSON.stringify({ success: false, error: true, msg: "ADDRESS_VERIFICATION_FAILED" }), { status: 500, headers: { "Content-Type": "application/json" } });
    } catch (err) {
      await logtail.error(err);
      return new Response(JSON.stringify({ success: false, error: true, msg: "UNABLE_TO_GET_DETAILS" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    await logtail.error(err);
    return new Response(JSON.stringify({ success: false, error: true, msg: "BODY_SHOULD_BE_JSON" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
export {
  POST
};
