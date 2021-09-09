import React, { useCallback, useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { BREAKPOINTS, useTheme, IconExternal, Info } from "@aragon/ui";
import { useWallet } from "use-wallet";
import throttle from "lodash.throttle";
import axios from "axios";
import {getAllVaults} from "../../utils";

import TopBar from "../TopBar/TopBar";
import Welcome from "../Welcome/Welcome";
import RoundButton from "./RoundButton/RoundButton";
import FundsIndex from "../FundsIndex/FundsIndex";
import Backend from "../Backend/Backend";
import FundViewIndex from "../FundViewIndex/FundViewIndex";
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

  const fetchVaultsData = async () => {
    console.log("fetching vaults data...");
    const _vaultsData = await getAllVaults()
    setFundsData(_vaultsData);
    // [
    //   {
    //     ....
    //     negateEligibility: false, //为false时，设置指定范围       //为true，无范围，全都可以    但eligibilities若有值，里面的id即不可mint的id，即取反
    //     // 注意下面的数组内都需要加''，否则fundData.eligibilities.includes(tokenId.toString()))会返回false
    //     eligibilities: ['0','1','2','3'],    
    //     holdings: ['0','1'], 
   
    //     // TODO 删除，价格单独从swap中拿
    //     price: 36504.78520502378,
    //     priceEth: 19.297241757470108,
    //   }
    // ]
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkAndFetchNewData = async () => {
    fetchVaultsData();
    fetchBalances();
  };

  // get balances data from CovalentHQ
  useEffect(() => {
    fetchBalances();
    // console.log("TODO: get balance updates using websocket");
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

  // console.log('FundsData======>')
  // console.log(fundsData)
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

          <div
            css={`
              max-width: 950px;
              width: 80%;
              margin: auto;
              margin-bottom: 25px;
            `}
          >

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
              <FundViewIndex fundsData={fundsData} balances={balances} />
            </Route>
            <Route path="/tutorial">
              <Tutorial />
            </Route>

            {/* 创建集成在FundsIndex中
              <Route path="/create">
              // <Landing selectorNetworks={selectorNetworks} />
              <Landing />
            </Route> */}
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
