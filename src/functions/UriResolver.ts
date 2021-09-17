
export const IPFS_GATEWAY_HOST = process.env.REACT_APP_IPFS_GATEWAY_HOST
export const IPFS_GATEWAY_PORT = '443'
export const IPFS_GATEWAY_PROTOCOL = 'https'
export const IPFS_GATEWAY_URL = `${IPFS_GATEWAY_PROTOCOL}://${IPFS_GATEWAY_HOST}:${IPFS_GATEWAY_PORT}/ipfs/`

// FOR SOLVING AN URI
/* USAGE
  A. for solving an URI:
    UriResolver(uri)
  B. for solving an tokenURI while the contract has a baseURI:
    UriResolver(tokenURI, baseURI)
*/
export function UriResolver(uri = '', baseUri = '') {
  // `uri` is the uri to be resolved
  // `baseUri` is the addtional baseUri provided, like a contract has a baseUri, can be empty.

  /* Set gateway base urls
    Default URI gateway
    IPFS gateway, currently default is IPFS gateway
    AR gateway
  */
  let DEFAULT_GATEWAY_BASE_URL = IPFS_GATEWAY_URL
  let IPFS_GATEWAY_BASE_URL = IPFS_GATEWAY_URL
  let AR_GATEWAY_BASE_URL = 'https://arweave.net/'

  switch (GetUriProtocol(uri)) {
    case 'http':
    case 'https':
    case 'base64':
      return uri
    case 'ipfs':
      // use IPFS gateway
      return IPFS_GATEWAY_BASE_URL + GetIpfsCid(uri)
    case 'ar':
      // use AR gateway
      return AR_GATEWAY_BASE_URL + GetArTxnId(uri)
    default:
      // unable to resolve protocol, using baseUri or default gateway
      if (baseUri !== '') {
        return baseUri + uri
      }
      return DEFAULT_GATEWAY_BASE_URL + uri
  }
}

// GET PROTOCOL OF AN URI
export function GetUriProtocol(uri = '') {
  uri = uri.toLowerCase()
  if (uri.substring(0, 7) === 'http://') {
    return 'http'
  }
  if (uri.substring(0, 8) === 'https://') {
    return 'https'
  }
  if (uri.substring(0, 5) === 'ipfs:') {
    return 'ipfs'
  }
  if (uri.substring(0, 3) === 'ar:' || uri.substring(0, 8) === 'arweave:') {
    return 'ar'
  }
  if (uri.startsWith('data:')) {
    return 'base64'
  }
  return 'unknown'
}

// EXTRACT CID FOR IPFS URI
export function GetIpfsCid(uri = '') {
  return uri
    .replace(/^(ipfs:)/i, '')
    .replace(/^(\/\/)/, '')
    .replace(/^(ipfs\/)/i, '')
  // `ipfs://<CID>/<path>`
  // from [Dweb addressing in brief](https://docs.ipfs.io/how-to/address-ipfs-on-web/#dweb-addressing-in-brief)
  // This implementation adds compatible supports to
  // `ipfs://ipfs//<CID>/<path>` and`ipfs:<CID>/<path>`
}

// EXTRACT TxnID FOR AR URI
export function GetArTxnId(uri = '') {
  return uri
    .replace(/^(ar:)/i, '')
    .replace(/^(arweave:)/i, '')
    .replace(/^(\/\/)/, '')
}
