import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getBalance } from '../utils/erc20'
import useBlock from './useBlock'

const useTokensBalance = (fundsListData: []) => {
  const [balances, setBalances] = useState([] as Array<string>)
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  const fetchBalances = useCallback(async () => {
    const _balances: Array<string> = await Promise.all(
      fundsListData.map(function(fundData) {
        return getBalance(ethereum, fundData.xToken.address, account)
      }),
    )
    setBalances(_balances)
  }, [account, ethereum, fundsListData])

  useEffect(() => {
    if (account && ethereum && fundsListData) {
      fetchBalances()
    }
  }, [account, ethereum, block, fundsListData])

  return balances
}

export default useTokensBalance
