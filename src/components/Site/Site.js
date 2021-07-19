import React, { useCallback, useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { BREAKPOINTS, useTheme, IconExternal, Info } from "@aragon/ui";
import { useWallet } from "use-wallet";
import throttle from "lodash.throttle";
import axios from "axios";

import TopBar from "../TopBar/TopBar";
import Welcome from "../Welcome/Welcome";
import RoundButton from "./RoundButton/RoundButton";
import Landing from "../Landing/Landing";
import FundsIndex from "../FundsIndex/FundsIndex";
import D1FundList from "../D1FundList/D1FundList";
import Backend from "../Backend/Backend";
import FundView from "../FundView/FundView";
import Bounties from "../Bounties/Bounties";
import Tutorial from "../Tutorial/Tutorial";
import fundInfo from "../../data/fundInfo.json";

function Site({ selectorNetworks }) {
  const theme = useTheme();
  const { account } = useWallet();
  const [solidTopBar, setSolidTopBar] = useState(false);

  const updateSolidScrollBar = useCallback(
    throttle((solid) => {
      setSolidTopBar(solid);
    }, 50),
    []
  );

  const handleScroll = useCallback(
    (event) => {
      updateSolidScrollBar(event.target.scrollTop > 0);
    },
    [updateSolidScrollBar]
  );

  const [eventsCount, setEventsCount] = useState(null);
  const [fundsData, setFundsData] = useState(null);

  const [balances, setBalances] = useState(null);

  const [selections, setSelections] = useState([2, 2]);

  const getSelection = (index) => selections[index];

  const setSelection = (index, value) => {
    const _selections = JSON.parse(JSON.stringify(selections));
    _selections[index] = value;
    setSelections(_selections);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBalances = async () => {
    // console.log("fetching balances...");
    // console.log(account)
    if (account) {
      // TODO 持有的各类NFTX数量
      const response = await axios({
        url: `https://api.covalenthq.com/v1/1/address/${account}/balances_v2/`,
        method: "get",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        auth: {
          username: "ckey_61fb094bfc714946b98607c7d06",
        },
      });
      // console.log("response:")
      // console.log(response)
      setBalances(response.data.data.items);
    }
  };

  const fetchFundsData = async () => {
    // // console.log("fetching funds data...");
    // const cleanFundsData = (inputData) => {
    //   const data = inputData.map((elem) => {
    //     const _fundInfo = fundInfo.find(
    //       (fund) => fund.vaultId === elem.vaultId
    //     );
    //     elem.verified = _fundInfo && _fundInfo.verified;
    //     return elem;
    //   });
    //   data.sort((a, b) => a.vaultId - b.vaultId);
    //   // TODO 下面的不需要？？？
    //   const punkFemale = data[15];
    //   data.splice(15, 1);
    //   data.splice(1, 0, punkFemale);
    //   const punk = data[16];
    //   data.splice(16, 1);
    //   data.splice(0, 0, punk);
    //   /* const mask = data[20];
    //   data.splice(20, 1);
    //   data.splice(19, 0, mask); */
    //   return data;
    // };
    // /* const response = await axios({
    //   url: "https://nftx.xyz/funds-data",
    //   method: "get",
    // }); */

    // // TODO 此处需要一个接口
    // const response2 = await axios({
    //   url: "https://nftx.ethereumdb.com/v1/vaults/",
    //   method: "get",
    // });

    // const _fundsData = cleanFundsData(response2.data);

    // setFundsData(_fundsData);



    const _fundsData = [
      {
        //nft 信息
        asset: {
          address: "0x543AD7Ca4172c17384a8fB62dACc493A544F84fe",
          name: 'PUNK-BASIC',
          symbol: 'Punk-Basic'
        },
        // xtoken 信息
        fundToken: {
          address: "0x2BA89Ae98E9a07Ab31eC4fd952A6b6c0bf1860C2",
          name: "PUNK-BASIC-20",
          symbol: "Punk-Basic-20",
          totalSupply: 63000000000000000000
        },
        negateEligibility: false, //为false时，设置指定范围
        // 注意下面的数组内都需要加''，否则fundData.eligibilities.includes(tokenId.toString()))会返回false
        eligibilities: ['0','1','2'],    
        eligibilityRange: [],        
        holdings: ['0','1','2'],  // TODO 删除，现在不持有    

        is1155: false,
        isClosed: false,
        isFinalized: true,
        lastTrade: "2021-07-14T00:00:00.000Z",
        manager: "0x0fb8eeda0139ee6F40d34C031D95D07f92f8e2Aa",

        price: 36504.78520502378,
        priceEth: 19.297241757470108,
        tokenStandard721: true,
        tokenStandard1155: false,
        vaultId: 0,

        flipEligOnRedeem: false,
        allowMintRequests: false,
        mintRequests:[],
        verified: true,
        _id: "6038fc06cf2eb6951da25ddb",
      },
      {
        //nft 信息
        asset: {
          address: "0x543AD7Ca4172c17384a8fB62dACc493A544F84fe",
          name: 'PUNK-BASIC',
          symbol: 'Punk-Basic'
        },
        // xtoken 信息
        fundToken: {
          address: "0x825e24d3ebeac4c827a608eb49618716827a4404",
          name: "999",
          symbol: "999",
          totalSupply: 0
        },
        negateEligibility: true, //无范围，全都可以    但eligibilities若有值，里面的id即不可mint的id，即取反
        eligibilities: [],
        eligibilityRange: [],        
        holdings: [],

        is1155: false,
        isClosed: false,
        isFinalized: true,
        lastTrade: null,
        manager: "0x0fb8eeda0139ee6F40d34C031D95D07f92f8e2Aa",

        price: null,
        priceEth: null,
        tokenStandard721: true,
        tokenStandard1155: false,
        vaultId: 4,

        flipEligOnRedeem: false,
        allowMintRequests: false,
        mintRequests:[],
        verified: true,
        _id: "11111",
      },
      // {
      //   allowMintRequests: false,
      //   //nft 信息
      //   asset: {
      //     address: "0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6",
      //     name: 'Wrapped Cryptopunks',
      //     symbol: 'WPUNKS'
      //   },
      //   // xtoken 信息
      //   fundToken: {
      //     address: "0x69BbE2FA02b4D90A944fF328663667DC32786385",
      //     name: "Punk-Basic",
      //     symbol: "PUNK-BASIC",
      //     totalSupply: 63000000000000000000
      //   },
      //   eligibilities: [],
      //   eligibilityRange: [],        
      //   holdings: ['9647','5039','9174'],
      //   flipEligOnRedeem: false,

      //   is1155: false,
      //   isClosed: false,
      //   isD2Vault: false,
      //   isFinalized: true,
      //   lastTrade: "2021-07-14T00:00:00.000Z",
      //   manager: "0xb5191DE5E9Ed5ce94176B7917430A8512e5Ad517",

      //   mintRequests:[],
      //   negateEligibility: true,
      //   price: 36504.78520502378,
      //   priceEth: 19.297241757470108,
      //   tokenStandard721: true,
      //   tokenStandard1155: false,
      //   vaultId: 0,
      //   verified: true,
      //   _id: "6038fc06cf2eb6951da25ddb",
      // },
    ]

    setFundsData(_fundsData);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkAndFetchNewData = async () => {
    fetchFundsData();
    fetchBalances();
  };

  // get balances data from CovalentHQ
  useEffect(() => {
    fetchBalances();
    // console.log("TODO: get balance updates using websocket");
    // https://www.covalenthq.com/docs/api/#post-/v1/{chainId}/address/{address}/register/
    const interval = setInterval(async () => {
      fetchBalances();
    }, 20000);
    return () => clearInterval(interval);
  }, [account]);

  // keep checking for new fund data
  useEffect(() => {
    checkAndFetchNewData();
    const interval = setInterval(async () => {
      checkAndFetchNewData();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // check for balances
  // console.log('FundsData======>')
  // console.log(fundsData)
  // console.log(fundsData ? fundsData[0] : 0)

  // console.log('Balances======>')
  // console.log(balances)

  return (
    <div css="position: relative; z-index: 1">
      <TopBar solid={solidTopBar} />
      <div
        onScroll={handleScroll}
        css={`
          position: relative;
          z-index: 1;
          background: ${theme.background};
          height: 100vh;
          min-width: ${BREAKPOINTS.min}px;
          overflow-y: auto;
        `}
      >
        <div
          css={`
            position: relative;
            z-index: 1;
            min-height: calc(100vh - 10px);
          `}
        >
          <Welcome />
          {/* <div
            css={`
              display: flex;
              justify-content: center;
              transform: translateY(-24px);
            `}
          >
            <RoundButton text="Homepage" link="/" />
            <a
              href="https://docs.nftx.org/tutorials/"
              target="_blank"
              rel="noreferrer"
              css={`
                text-decoration: none;
                margin: 0 10px;
              `}
            >
              <RoundButton
                text={(
                  <div css={`
                    position: relative;
                    padding-left: 1px;
                    padding-right: 26px;
                  `}>
                    {'TUTORIALS'}
                    <div
                      css={`
                        display: inline-block;
                        position: absolute;
                        right: -5px;
                        bottom: -5px;
                      `}
                    >
                      <IconExternal />
                    </div>
                  </div>
                )}
              />
            </a>
            <a
              href="https://docs.nftx.org"
              target="_blank"
              rel="noreferrer"
              css={`
                text-decoration: none;
                margin: 0 10px;
              `}
            >
              <RoundButton
                text={
                  <div
                    css={`
                      position: relative;
                      padding-left: 1px;
                      padding-right: 26px;
                    `}
                  >
                    DOCS
                    <div
                      css={`
                        display: inline-block;
                        position: absolute;
                        right: -5px;
                        bottom: -5px;
                      `}
                    >
                      <IconExternal />
                    </div>
                  </div>
                }
              />
            </a>
            <a
              href="https://gallery.nftx.org"
              target="_blank"
              rel="noreferrer"
              css={`
                text-decoration: none;
                margin: 0 10px;
              `}
            >
              <RoundButton
                text={
                  <div
                    css={`
                      position: relative;
                      padding-left: 1px;
                      padding-right: 26px;
                    `}
                  >
                    Gallery
                    <div
                      css={`
                        display: inline-block;
                        position: absolute;
                        right: -5px;
                        bottom: -5px;
                      `}
                    >
                      <IconExternal />
                    </div>
                  </div>
                }
              />
            </a>

          </div> */}

          <div
            css={`
              max-width: 950px;
              width: 80%;
              margin: auto;
              margin-bottom: 25px;
            `}
          >
            <Route path="/create">
              {/* <Landing selectorNetworks={selectorNetworks} /> */}
              <Landing />
            </Route>
           

            <Route path="/" exact>
              <FundsIndex
                fundsData={fundsData}
                balances={balances}
                getSelection={getSelection}
                setSelection={setSelection}
              />
            </Route>
            <Route path="/backend">
              <Backend />
            </Route>
            <Route path="/fund">
              <FundView fundsData={fundsData} balances={balances} />
            </Route>
            <Route path="/tutorial">
              <Tutorial />
            </Route>
            {/* <Route path="/bounties">
              <Bounties />
            </Route>
            <Route path="/bounties"></Route> */}
          </div>
          {/* <div
            className="footer"
            css={`
              width: 100%;
              font-size: 18px;
              text-align: center;
              line-height: 3.5;
              padding-bottom: 40px;
              & > a {
                display: inline-block;
                padding: 0 18px;
                color: #d0ceff;
                opacity: 0.65;
                cursor: pointer;
                text-decoration: none;
                &:hover {
                  opacity: 0.9;
                }
              }
            `}
          >
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScnaUGFuz6-iyLTCeLhcLcFfxAdpPhGzGfxDtET7qgBIJO_xg/viewform"
              target="_blank"
              rel="noreferrer"
            >
              Gallery Request Form
            </a>
            <a
              href="https://twitter.com/NFTX_"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://github.com/NFTX-project"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="https://blog.nftx.org/" target="_blank" rel="noreferrer">
              Blog
            </a>
            <a
              href="https://discord.gg/hytQVM5ZxR"
              target="_blank"
              rel="noreferrer"
            >
              Discord
            </a>
            <a
              href="https://client.aragon.org/#/nftx/"
              target="_blank"
              rel="noreferrer"
            >
              Aragon
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Site;
