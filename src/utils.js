import { POLL_DELAY_CONNECTIVITY } from "./constants";
import { getWeb3 } from "./web3-utils";
import { nftxClient, newSwapClient } from './apollo/client'
import {
  ALL_VAULTS,
  ALL_PAIRS,
  ALL_TOKENS
} from './apollo/queries'

export const pollConnectivity = pollEvery((providers = [], onConnectivity) => {
  let lastFound = null;
  return {
    request: async () => {
      try {
        await Promise.all(
          providers.map((p) => getWeb3(p).eth.net.getNetworkType())
        );
        return true;
      } catch (err) {
        return false;
      }
    },
    onResult: (connected) => {
      if (connected !== lastFound) {
        lastFound = connected;
        onConnectivity(connected);
      }
    },
  };
  // web.eth.net.isListening()
}, POLL_DELAY_CONNECTIVITY);

export function pollEvery(fn, delay) {
  let timer = -1;
  let stop = false;
  const poll = async (request, onResult) => {
    let result;
    try {
      result = await request();
    } catch (err) {
      log("Polling failed for fn:", fn);
      log("Error:", err);
      // Stop polling and let requester handle
      throw err;
    }

    if (!stop) {
      onResult(result);
      timer = setTimeout(poll.bind(null, request, onResult), delay);
    }
  };
  return (...params) => {
    const { request, onResult } = fn(...params);
    poll(request, onResult);
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  };
}

export function isElectron() {
  // See https://github.com/electron/electron/issues/2288
  return (
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0
  );
}

// return the first argument (named after lodash)
export const identity = (arg) => arg;

export function log(...params) {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== "test"
  ) {
    console.log(...params);
  }
}

export const iOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export const isSafari = /Version\/[\d.]+.*Safari/.test(navigator.userAgent);

const VAULTS_TO_FETCH = 500
export const getAllVaults = async () => {
  try {
    let allFound = false
    let vaults = []
    let skipCount = 0

    while (!allFound) {
      let result = await nftxClient.query({
        query: ALL_VAULTS,
        variables: {
          skip: skipCount
        },
        // fetchPolicy: 'cache-first'
        fetchPolicy: 'network-only'       
      })
      skipCount = skipCount + VAULTS_TO_FETCH
      console.log("getAllVaults----------->")
      console.log(result)
      console.log(result?.data?.vaults)

      vaults = vaults.concat(result?.data?.vaults)
      if (result?.data?.vaults.length < VAULTS_TO_FETCH || vaults.length > VAULTS_TO_FETCH) {
        allFound = true
      }
    }
    return vaults
  } catch (e) {
    console.log(e)
    return []
  }
}

const PAIRS_TO_FETCH = 500
// Loop through every pair on newSwap, used for search
export const getAllPairs = async () => {
  try {
    let allFound = false
    let pairs = []
    let skipCount = 0
    while (!allFound) {
      let result = await newSwapClient.query({
        query: ALL_PAIRS,
        variables: {
          skip: skipCount
        },
        fetchPolicy: 'cache-first'
      })
      skipCount = skipCount + PAIRS_TO_FETCH
      // console.log("getAllPairs----------->")
      // console.log(result)
      pairs = pairs.concat(result?.data?.pairs)
      if (result?.data?.pairs.length < PAIRS_TO_FETCH || pairs.length > PAIRS_TO_FETCH) {
        allFound = true
      }
    }
    return pairs
  } catch (e) {
    console.log(e)
    return []
  }
}

// Loop through every token on newSwap, used for search
export const getAllTokens = async () => {
  try {
    let allFound = false
    let tokens = []
    let skipCount = 0
    while (!allFound) {
      let result = await newSwapClient.query({
        query: ALL_TOKENS,
        variables: {
          skip: skipCount
        },
        fetchPolicy: 'cache-first'
      })
      skipCount = skipCount + 500
      // console.log("getAllTokens----------->")
      // console.log(result)
      tokens = tokens.concat(result?.data?.tokens)
      if (result?.data?.tokens.length < 500 || tokens.length > 500) {
        allFound = true
      }
    }
    return tokens
  } catch (e) {
    console.log(e)
    return []
  }
}