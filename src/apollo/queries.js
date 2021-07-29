import gql from 'graphql-tag'

export const ALL_VAULTS = gql`
  query vaults($skip: Int!) {
    vaults(first: 500, skip: $skip, orderBy: id, orderDirection: asc) {
      vaultId: id
      manager
      asset {
        address: id
        symbol
        name
      }
      xToken {
        address: id
        symbol
        name
        totalSupply     
      }
      negateEligibility
      eligibilities
      eligibilityRange
      holdings
      is1155
      isFinalized
      isClosed
      flipEligOnRedeem
      allowMintRequests
      createdAtTimestamp
      createdAtBlockNumber
    }
  }
`

export const ALL_PAIRS = gql`
  query pairs($skip: Int!) {
    pairs(first: 500, skip: $skip, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

export const ALL_TOKENS = gql`
  query tokens($skip: Int!) {
    tokens(first: 500, skip: $skip, orderBy: totalLiquidity, orderDirection: desc) {
      id
      name
      symbol
      derivedETH
      totalLiquidity
    }
  }
`