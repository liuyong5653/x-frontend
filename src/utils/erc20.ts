import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC20 from '../contracts/ERC20.json'

export const getContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (ERC20.abi as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getAllowance = async (
  contract: Contract,
  owner: string,
  spender: string,
): Promise<string> => {
  try {
    const allowance: string = await contract.methods
      .allowance(owner, spender)
      .call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getSymbol = async (
  contract: Contract,
): Promise<string> => {
  try {
    const symbol: string = await contract.methods
      .symbol()
      .call()
    return symbol
  } catch (e) {
    return ''
  }
}

export const getDecimals = async (
  contract: Contract,
): Promise<string> => {
  try {
    const decimals: string = await contract.methods
      .decimals()
      .call()
    return decimals
  } catch (e) {
    return '0'
  }
}

export const getTotalSupply = async (
  provider: provider,
  tokenAddress: string,
): Promise<string> => {
  try {
    const contract = getContract(provider, tokenAddress)
    const totalSupply: string = await contract.methods
      .totalSupply()
      .call()
    return totalSupply
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  try {
    const lpContract = getContract(provider, tokenAddress)
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}
