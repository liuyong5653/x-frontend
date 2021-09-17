import React from "react"
import { useTranslation } from 'react-i18next'
import { NFTListCard } from './NFTListCard'
import styled, { keyframes } from 'styled-components'
import {isMobile} from 'react-device-detect'

export default function NFTList({data}) {
  let { t } = useTranslation()

  console.log("=========>NFTLIST", data)

  // TODO 如果是非手机，拼接2纬数组，每一个行放四张图




  return (
    <>
      {/* <button className='primary outline small' onClick={onRefetch}>
        {t("refresh")}
      </button> */}

      {/* <ul className="list nft_card_list"> */}
      <div>
        <StyledRow>
          {data &&
            data.map(item => {
              // return <NFTListCard key={item.token.id} item={item.token} />
              return(
                <div>
                <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw'/>
                {/* <h3>111111 #{item.token.tokenId}</h3> */}
                </div>
              )
            })}
        </StyledRow>

        {/* rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
                {(j == farmRow.length - 1) && <FarmEmptyCard/>}
              </React.Fragment>
            ))}
          </StyledRow>
        )) */}

      </div>   


      <div>
        <StyledRow>
          <StyledCardContent>
            <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' /> 
            <h3>111111 #111</h3> 
          </StyledCardContent>
          <StyledCardContent>
            <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' /> 
            <h3>111111 #111</h3> 

          </StyledCardContent>
          <StyledCardContent>
            <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' /> 
            <h3>111111 #111</h3> 

          </StyledCardContent>
          <StyledCardContent>
            <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' /> 
            <h3>111111 #111</h3> 

          </StyledCardContent>
          {/* <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' /> 
          <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' /> 
          <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' />  */}
        </StyledRow>
        {/* <StyledRow>
          <StyledImg src='https://files.cloud.diynova.com/ipfs//QmQx11T8AFkWvMCTYgTWSoqDdUsoh3cZs3Ta5dzabgMqi7' /> 
          <StyledImg src='https://files.cloud.diynova.com/ipfs//QmVNo8XBST1TicEwZ9LaKDsd3znrGFyW9sxUsMfMZq1vt9' /> 
          <StyledImg src='https://files.cloud.diynova.com/ipfs//Qmb48NSicE7p9Uxty9cjzVw7zPg4qE47jYwDfDBQ2wrAsP' /> 
          <StyledImg src='https://files.cloud.diynova.com/ipfs/QmTxzRZP7ncbynw3bcqhJdrmAr1LUWUjkofb2wc2vPkzxw' /> 
        </StyledRow> */}

      </div>

      {/* {!onFetchMore ? (
        <div></div>
      ) : (
        <button className="tertiary outline small" onClick={onFetchMore}>
          {t('load more')}
        </button>
      )} */}
    </>
  )
}

// background-color: #fff;
const StyledCards = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    width: 100%;
  }
`



const StyledRow = styled.div`
  background-color: red;
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
  padding-left: 30px;
  flex-flow: row wrap; 
`  
// @media (max-width: 768px) {
//   width: 100%;
//   flex-flow: column nowrap;
//   align-items: center;
// }

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 5px;
  background-color: green;
  border-radius: 12px;
  box-shadow: 0px 5px 12px 0px rgba(7,94,68,0.11);
`

const StyledImg = isMobile ? 
  styled.img`
    display: flex;
    width: 80%;
    position: relative;
  ` :  styled.img`
    display: flex;
    width: 80%;
    margin-right: 30px;
    position: relative;
  `


const StyledCardWrapper = false ? 
  styled.div`
    display: flex;
    width: 100%;
    position: relative;
  ` :  styled.div`
    display: flex;
    width: 200px;
    position: relative;
  `
  // width: calc((752px - ${(props) => props.theme.spacing[4]}px * 2) / 3);



const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
















const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

// const StyledCardWrapper = styled.div`
//   display: flex;
//   flex: 1;
//   flex-direction: column;
//   @media (max-width: 768px) {
//     width: 80%;
//   }
//   box-shadow: 0px 5px 12px 0px rgba(7,94,68,0.11);
// `

const StyledSpacer = styled.div`
  width: 5%;
`
