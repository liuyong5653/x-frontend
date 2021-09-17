import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http' 

const NFTX_URL = process.env.REACT_APP_NFTX_SUBGRAPHS_URL
const NEWSWAP_CLIENT_URL = process.env.REACT_APP_NEWSWAP_SUBGRAPHS_URL
const NEWMALL_EXCHANGE_URL = process.env.REACT_APP_NEWMALL_EXCHANGE

export const nftxClient = new ApolloClient({
  link: new HttpLink({
    uri: NFTX_URL
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const newSwapClient = new ApolloClient({
  link: new HttpLink({
    uri: NEWSWAP_CLIENT_URL
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const newMallClient = new ApolloClient({
  link: new HttpLink({
    uri: NEWMALL_EXCHANGE_URL
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})