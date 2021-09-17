// import Link from 'next/link'
import React from "react"
import { Link } from "@aragon/ui";
// import { useTranslation } from 'react-i18next'
// import NewAddress from 'components/layouts/NewAddress'
// import { VideoCameraIcon } from '@heroicons/react/solid'
import { useTokenDescription } from '../../hooks/useTokenDescription'
import { getNftDetailPath } from '../../functions'
// import NftCardFooter from './NFTCardFooter'
import { DateTime } from '../../functions/DateTime'
import styled, { keyframes } from 'styled-components'
import {isMobile} from 'react-device-detect'

export function NFTListCard(props) {
  // const { t } = useTranslation()
  const { item } = props

  console.log("========NFTListCard")
  console.log(props)
  console.log(item)

  const tokenMetaData = useTokenDescription(item.uri)
  console.log("------------>tokenMetaData,",tokenMetaData)
  if (!tokenMetaData) {
    return <div>loading...</div>
  }
//   const tokenProfile = (
//     <div className="profile">
//       {/* <Link href={getNftDetailPath(item.id)}> */}
//       <div>
//         <a>
//           <h3>{tokenMetaData.tokenName}</h3>
//           <dl>
//             <dd>
//               <span className="font-mono">
//                 'created on' #{DateTime(item.mintTime)}
//                 {/* <NewAddress size="short" address={item.minter} /> {t('created on')} #{DateTime(item.mintTime)} */}
//               </span>
//             </dd>
//           </dl>
//         </a>
//       {/* </Link> */}
//       </div>
//     </div>
//   )

  if (tokenMetaData.nftType === 'video') {
    return (
      <li className="item">
        Video
        {/* <Link href={getNftDetailPath(item.id)}>
          <div className="cover">
            <div className="perfect_square">
              <video controls loop muted playsInline poster={tokenMetaData.tokenImage}>
                <source src={tokenMetaData.tokenVideo}></source>
              </video>
            </div>
            <div className="bl collection_name" hidden>
              <p className="collection_name">CollectionName: #{item.tokenId}</p>
            </div>
            <div className="tr">
              <VideoCameraIcon className="w-6 h-6" />
            </div>
          </div>
        </Link>
        {tokenProfile}
        <Link href={getNftDetailPath(item.id)}>
          <NftCardFooter {...props} />
        </Link> */}
      </li>
    )
  } else {
    return (
      // <li className="item">
      //   <Link href={getNftDetailPath(item.id)}>
      //     {/* NFT Cover */}
      //     <div className="cover">
      //       <div className="perfect_square">
      //         <img src={tokenMetaData.tokenImage} alt="" width="96px" height="96px"/>
      //       </div>
      //     </div>
      //   </Link>
      //   <h3>{tokenMetaData.tokenName} #{item.tokenId}</h3>
      // </li>

      <div>
        <StyledImg src={tokenMetaData.tokenImage}/>
        <h3>{tokenMetaData.tokenName} #{item.tokenId}</h3>
      </div>
    )
  }
}

const StyledImg = isMobile ? 
  styled.img`
    display: flex;
    width: 80%;
    position: relative;
  ` :  styled.img`
    display: flex;
    width: 20%;
    margin-right: 30px;
    position: relative;
  `

// const StyledImg = styled.img `
//     height: 32px;
//     width: 32px;
//     margin: 2px;
//     margin-left: 14px;
// `