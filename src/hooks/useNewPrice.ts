import { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getNewPrice } from '../utils'
import useBlock from './useBlock'
import UniswapV2Pair from '../contracts/UniswapV2Pair.json'

const wnewAddress = process.env.REACT_APP_WNEW_ADDRESS
const newNusdtAddress = process.env.REACT_APP_NEW_NUSDT_ADDRESS

const useNewPrice = () => {
  const [newPrice, setNewPrice] = useState(new BigNumber(0))
  const {
    ethereum,
  }: { ethereum: provider } = useWallet()

  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const web3 = new Web3(ethereum || window.ethereum)
    const newNUSDTPairContract = new web3.eth.Contract((UniswapV2Pair.abi as unknown) as AbiItem, newNusdtAddress)
    const price = await getNewPrice(newNUSDTPairContract, wnewAddress)
    setNewPrice(price)
  }, [ethereum, setNewPrice])

  useEffect(() => {
    if (ethereum || window.ethereum) {
      fetchBalance()
    }
  }, [ethereum, block])

  return newPrice
}

export default useNewPrice
