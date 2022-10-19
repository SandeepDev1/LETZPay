import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017");
const connection = await client.connect();
const db = connection.db("paymentGateway");
console.log("Connected to database");
const getCurrencyDetails = async (currency) => {
  try {
    const collection = db.collection("currencyList");
    const result = await collection.findOne({ currency });
    return result;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const addCurrencyDetails = async (data) => {
  try {
    const collection = db.collection("currencyList");
    await collection.insertOne(data);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const addWebhookSubscriptionDetails = async (data) => {
  try {
    const collection = db.collection("subscriptionList");
    await collection.insertOne(data);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const getWebhookSubscriptionDetails = async (accountId, subscriptionType) => {
  try {
    const collection = db.collection("subscriptionList");
    const result = await collection.findOne({ accountId, subscriptionType });
    return result;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const addPaymentCharge = async (data) => {
  try {
    const collection = db.collection("charges");
    await collection.insertOne(data);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const updateChargeStatus = async (address, status) => {
  try {
    const collection = db.collection("charges");
    await collection.updateOne({ address }, { $set: { status } });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const updatePendingAmount = async (address, amount) => {
  try {
    const collection = db.collection("charges");
    await collection.updateOne({ address }, { $set: { pendingAmount: amount } });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const getChargeDetailsFromAddress = async (address) => {
  try {
    const collection = db.collection("charges");
    const result = await collection.findOne({ address });
    return result;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const currencies = {
  BTC: "BTC",
  LTC: "LTC",
  BCH: "BCH",
  DOGE: "DOGE",
  ETH: "ETH",
  MATIC: "MATIC"
};
const localCurrency = {
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
const STATUS = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  PENDING_PAYMENT: "PENDING_PAYMENT"
};
export {
  STATUS as S,
  addWebhookSubscriptionDetails as a,
  addPaymentCharge as b,
  currencies as c,
  getCurrencyDetails as d,
  addCurrencyDetails as e,
  getChargeDetailsFromAddress as f,
  getWebhookSubscriptionDetails as g,
  updatePendingAmount as h,
  localCurrency as l,
  updateChargeStatus as u
};
