import { MongoClient } from "mongodb";
import { Logtail } from "@logtail/node";
const logtail = new Logtail("cAUQqc5bu75Fc5DUc9DcXPTw", { ignoreExceptions: true });
var connection;
const client = new MongoClient("mongodb+srv://root:letzpay@cluster0.hqx9syq.mongodb.net/?retryWrites=true&w=majority");
if (!connection) {
  connection = await client.connect();
}
const db = connection.db("paymentGateway");
await logtail.info("Connected to database");
const getCurrencyDetails = async (currency) => {
  try {
    const collection = db.collection("currencyList");
    const result = await collection.findOne({ currency });
    return result;
  } catch (err) {
    await logtail.error(err.toString());
    return false;
  }
};
const addCurrencyDetails = async (data) => {
  try {
    const collection = db.collection("currencyList");
    await collection.insertOne(data);
    return true;
  } catch (err) {
    await logtail.error(err.toString());
    return false;
  }
};
const addWebhookSubscriptionDetails = async (data) => {
  try {
    const collection = db.collection("subscriptionList");
    await collection.insertOne(data);
    return true;
  } catch (err) {
    await logtail.error(err.toString());
    return false;
  }
};
const getWebhookSubscriptionDetails = async (accountId, subscriptionType) => {
  try {
    const collection = db.collection("subscriptionList");
    const result = await collection.findOne({ accountId, subscriptionType });
    return result;
  } catch (err) {
    await logtail.error(err.toString());
    return false;
  }
};
const addPaymentCharge = async (data) => {
  try {
    const collection = db.collection("charges");
    await collection.insertOne(data);
    return true;
  } catch (err) {
    await logtail.error(err.toString());
    return false;
  }
};
const updateChargeStatus = async (address, status) => {
  try {
    const collection = db.collection("charges");
    await collection.updateOne({ address }, { $set: { status } });
    return true;
  } catch (err) {
    await logtail.error(err.toString());
    return false;
  }
};
const updatePendingAmount = async (address, amount) => {
  try {
    const collection = db.collection("charges");
    await collection.updateOne({ address }, { $set: { pendingAmount: amount } });
    return true;
  } catch (err) {
    await logtail.error(err.toString());
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
  getCurrencyDetails as c,
  addCurrencyDetails as d,
  getChargeDetailsFromAddress as e,
  updatePendingAmount as f,
  getWebhookSubscriptionDetails as g,
  logtail as l,
  updateChargeStatus as u
};
