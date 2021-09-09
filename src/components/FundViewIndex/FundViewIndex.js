import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "use-wallet";
import { useLocation, Link } from "react-router-dom";
import Web3 from "web3";
import XStore from "../../contracts/XStore.json";
import FundView from "../FundView/FundView";
import { Button, DataView, textStyle } from "@aragon/ui";

const XSTORE = process.env.REACT_APP_XSTORE

function FundViewIndex({ fundsData, balances }) {
  console.log("FundViewIndex balances====》", balances);
  const { account } = useWallet();
  const injected = window.ethereum;
  // const provider =
  //   injected && injected.chainId === "0x1"
  //     ? injected
  //     : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const provider = injected
  const { current: web3 } = useRef(new Web3(provider));

  const xStore = new web3.eth.Contract(XStore.abi, XSTORE);

  const [vaultId, setVaultId] = useState(null);
  const [invalidVid, setInvalidVid] = useState(false);
  const [degree, setDegree] = useState(1);
  const location = useLocation();

  console.log("FundViewIndex location=====>",location)
  useEffect(() => {
    if (location) {
      const _vaultId = location.pathname.split("/")[2];
      if (isNaN(parseInt(_vaultId))) {
        setInvalidVid(true);
      }
      setVaultId(_vaultId);
    }
  }, [location]);

  // useEffect(() => {
  //   if (xStore && vaultId) {
  //     xStore.methods
  //       .isD2Vault(vaultId)
  //       .call({ from: account })
  //       .then((retVal) => {
  //         setDegree(retVal ? 2 : 1);
  //       });
  //   }
  // }, [xStore, vaultId, account]);

  if (invalidVid) {
    return <div>Invalid Pool ID</div>;
  } else if (degree === 1) {
    return <FundView fundsData={fundsData} balances={balances} />;
  // } else if (degree === 2) {
  //   return <D2FundView fundsData={fundsData} balances={balances} />;
  } else {
    return (
      <div
        css={`
          padding-bottom: 10px;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            margin-bottom: 5px;
          `}
        >
          <div
            css={`
              ${textStyle("title2")};
              margin-bottom: 15px;
              transform: translateY(-2.5px);
            `}
          >
            <div
              css={`
                transform: translateX(-7px);
                display: inline-block;
              `}
            >
              <Link
                to="/"
                css={`
                  text-decoration: none;

                  padding: 9px 7px 4px;
                  border-radius: 8px;
                  transition: background-color 0.15s;
                  &:hover {
                    background-color: rgba(175, 175, 230, 0.12);
                  }
                `}
              >
                Pools
              </Link>
            </div>{" "}
            <div
              css={`
                transform: translateX(-6px);
                display: inline-block;
              `}
            >
              <span
                css={`
                  font-size: 29px;
                  padding-right: 5px;
                `}
              >
                ›
              </span>{" "}
              <span
                css={`
                  color: #9690c1;
                `}
              >
                Pool #{vaultId}
              </span>
            </div>
          </div>
          <Button label="Manage Vault" disabled={true} />
        </div>
        <div
          css={`
            & > div {
              padding-bottom: 20px;
            }
          `}
        >
          <DataView
            status={"loading"}
            fields={[]}
            entries={[]}
            renderEntry={() => <div></div>}
          />
        </div>
      </div>
    );
  }
}

export default FundViewIndex;
