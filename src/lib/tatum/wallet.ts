
import bip39 from "bip39"
import bitcoinjs_lib from "bitcoinjs-lib"
import { hdkey} from "ethereumjs-wallet"
import hdkey_1 from "hdkey"
import {
  BCH_DERIVATION_PATH, BTC_DERIVATION_PATH, DOGE_DERIVATION_PATH, DOGE_NETWORK,
  DOGE_TEST_NETWORK,
  ETH_DERIVATION_PATH, LTC_DERIVATION_PATH, LTC_NETWORK, LTC_TEST_NETWORK,
  MATIC_DERIVATION_PATH,
  TESTNET_DERIVATION_PATH
} from "./constants";
import { Currency } from "./models";

export const generateEthWallet = async (testnet: boolean, mnem: string) => {
  const path = testnet ? TESTNET_DERIVATION_PATH : ETH_DERIVATION_PATH;
  const hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnem));
  const derivePath = hdwallet.derivePath(path);
  return {
    xpub: derivePath.publicExtendedKey().toString(),
    mnemonic: mnem,
  };
};

export const generatePolygonWallet = async (testnet: boolean, mnem: string) => {
  const path = testnet ? TESTNET_DERIVATION_PATH : MATIC_DERIVATION_PATH;
  const hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnem));
  const derivePath = hdwallet.derivePath(path);
  return {
    xpub: derivePath.publicExtendedKey().toString(),
    mnemonic: mnem,
  };
};

export const generateBchWallet = async (testnet: boolean, mnem: string) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? bitcoinjs_lib.networks.testnet.bip32 : bitcoinjs_lib.networks.bitcoin.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : BCH_DERIVATION_PATH).toJSON().xpub,
  };
};

export const generateBtcWallet = async (testnet: boolean, mnem: string) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? bitcoinjs_lib.networks.testnet.bip32 : bitcoinjs_lib.networks.bitcoin.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : BTC_DERIVATION_PATH).toJSON().xpub,
  };
};

export const generateDogeWallet = async (testnet: boolean, mnem: string) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? DOGE_TEST_NETWORK.bip32 : DOGE_NETWORK.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : DOGE_DERIVATION_PATH).toJSON().xpub,
  };
};

export const generateLtcWallet = async (testnet: boolean, mnem: string) => {
  const hdwallet = hdkey_1.fromMasterSeed(await bip39.mnemonicToSeed(mnem), testnet ? LTC_TEST_NETWORK.bip32 : LTC_NETWORK.bip32);
  return {
    mnemonic: mnem,
    xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : LTC_DERIVATION_PATH).toJSON().xpub,
  };
};

export const generateWallet = (currency: string, testnet: boolean) => {
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
      throw new Error('Unsupported blockchain.');
  }
};
