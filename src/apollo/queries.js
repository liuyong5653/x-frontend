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
      holdings
      isFinalized
      isClosed
      is1155
      rangeStart
      rangeEnd
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
    tokens(first: 500, skip: $skip, orderBy: tradeVolumeUSD, orderDirection: desc) {
      id
      name
      symbol
      tradeVolumeUSD
      derivedETH
      totalLiquidity
    }
  }
`

export const OWNER_ALL_NFT = gql`
  query ownerPerTokens($owner: String!, $contract: String!, $skip: Int!) {
    ownerPerTokens(where: {owner: $owner, contract: $contract}, skip: $skip, first: 500) {
      id
      token {
        id
        uri
        tokenId
      }
    }
  }
`