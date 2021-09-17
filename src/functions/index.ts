import axios from 'axios'

export async function getInfo(url) {
  try {
    if (url.startsWith('data:application/json;base64,')) {
      let data = url.split('data:application/json;base64,')[1]
      const res = JSON.parse(atob(data))
      return res
    }
    const result = await axios.get(url)
    return result.data
  } catch (e) {
    try {
      const res = await axios.get(`/api/proxy?url=${url}`)
      return res.data
    } catch (e) {
      console.error(e)
      return ''
    }
  }
}

export function getNftDetailPath(nftId: string) {
  const [tokenAddress, tokenId] = nftId.split('-')
  return `asset/${tokenAddress}/${tokenId}`
}

export function splitTx(tx: string | null) {
  if (tx === null) {
    return tx
  }
  if (tx.length < 30) {
    return tx
  }
  return tx.substring(0, 10) + '......' + tx.substring(tx.length - 10, tx.length)
}
