import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useWallet } from "use-wallet";
import PropTypes from "prop-types";
import {
  DataView,
  ContextMenu,
  ContextMenuItem,
  Header,
  Button,
  AddressField,
  SidePanel,
  IconStarFilled,
  IconStar,
  IconCircleCheck,
  IconCircleMinus,
  FloatIndicator,
  Info,
  Help,
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";
import MintFundPanel from "../InnerPanels/MintFundPanel";
import RedeemFundPanel from "../InnerPanels/RedeemFundPanel";
import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import Web3 from "web3";
import XStore from "../../contracts/XStore.json";
import XToken from "../../contracts/XToken.json";
import ApproveNftsPanel from "../InnerPanels/ApproveNftsPanel";
import Web3Utils from "web3-utils";
import fundInfo from "../../data/fundInfo.json";
import useNewPrice from "../../hooks/useNewPrice"
import BigNumber from 'bignumber.js'

const NEWSWAP_APP = process.env.REACT_APP_NEWSWAP_APP
const NEWSWAP_INFO = process.env.REACT_APP_NEWSWAP_INFO
function FundsList({ fundsListData, allSwapTokens, hideInspectButton }) {
  const {
    isVaultIdFavorited,
    removeFavoriteByVaultId,
    addFavorite,
  } = useFavoriteFunds();
  const history = useHistory();
  const { account } = useWallet();
  const injected = window.ethereum;
  // const provider =
  //   injected && injected.chainId === "0x1"
  //     ? injected
  //     : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const provider = injected
  const { current: web3 } = useRef(new Web3(provider));

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const newPrice = useNewPrice()
  console.log('newPrice-------->' + newPrice)

  const truncateDecimal = (inputStr) => {
    if (!inputStr.includes(".")) {
      return inputStr;
    } else {
      const arr = inputStr.split(".");
      if (arr[1].length > 2) {
        const shortStr = arr[1].substring(0, 2);
        if (shortStr === "00" && arr[0] === "0") {
          arr[1] = arr[1].substring(0, 3);
        } else {
          arr[1] = shortStr;
        }
      }
      return arr.join(".");
    }
  };

  const fundData = (vaultId) =>
    fundsListData.find((fund) => fund.vaultId == vaultId);

  const handleMint = (vaultId, ticker) => {
    if (!fundData(vaultId)) return;
    // quickest and easiest way is to enable the return window.location and comment out the rest of the function.
//     return window.location.href = `https://app.nftx.org/mint/${vaultId}`;

    setPanelTitle(`${ticker} ▸ Mint`);
    setInnerPanel(
      <MintFundPanel
        fundData={fundData(vaultId)}
        // balances={balances}
        onContinue={() => {
          setPanelOpened(false);
        }}
      />
    );
    setPanelOpened(true);
  };

  const handleRedeem = (vaultId) => {
    const _fundData = fundData(vaultId);
    setPanelTitle(`${_fundData.xToken.symbol} ▸ Redeem`);
    setInnerPanel();
    setInnerPanel(
        <RedeemFundPanel
          fundData={_fundData}
          // balances={balances}
          onContinue={() => {
            setPanelOpened(false);
          }}
        />
    );
    setPanelOpened(true);
  };

  const getFundInfo = (vaultId) => {
    return fundInfo.find((elem) => elem.vaultId == vaultId);
  };

  const getSwapTokenInfo = (id) => {
    return allSwapTokens?.find((elem) => elem.id == id);
  };

  return (
    <div>
      <DataView
        status={fundsListData === null ? "loading" : "default"}
        fields={(() => {
          const fields = [
            "NFT / NRC6",
            "NFTS IN POOL",
            "TRADE $NRC6",
            "LIQUIDITY",
            "FLOOR PRICE",
            // "Type",
            // <div>
            //   <div
            //     css={`
            //       display: inline-block;
            //       position: relative;
            //       cursor: default;
            //     `}
            //   >
            //     {"Fin / Ver / AMM"}
            //     <div
            //       css={`
            //         position: absolute;
            //         top: 0;
            //         right: -22px;
            //     }
            //       `}
            //     >
            //       <Help hint="What are Ethereum addresses made of?">
            //         <p>FIN = Finalized</p>
            //         <p>VER = Verified</p>
            //         <p>AMM = Swappable via an AMM</p>
            //       </Help>
            //     </div>
            //   </div>
            // </div>,
            // "",
          ];
          // TODO 获得balances
          // if (account && balances) {
          if (account) {         
            fields.splice(5, 0, "Bal");
          }
          return fields;
        })()}
        entries={fundsListData || []}
        entriesPerPage={50}
        renderEntry={(entry) => {
          const { vaultId, asset, xToken } = entry;
          const nftSymbol = asset.symbol;
          const fundSymbol = xToken.symbol;
          const fundAddress = entry.xToken.address;
          const swapTokenInfo = getSwapTokenInfo(xToken.address)
          // console.log("entry", entry);
          const cells = [
            hideInspectButton ? (
              <div>{nftSymbol} / {fundSymbol}</div>
            ) : (
              <Link
                css={`
                  text-decoration: none;
                `}
                to={`fund/${vaultId}`}
              >
                {nftSymbol} / {fundSymbol}
              </Link>
            ),
            <div>
              {(entry.holdings || []).length}
            </div>,
            // <Link
            //   css={`
            //     text-decoration: none;
            //   `}
            //   to={`https://info.newswap.org/`}
            // >
            //   NewSwap
            // </Link>,
            <a
              href= { swapTokenInfo ? NEWSWAP_APP + "/#/swap?inputCurrency=NEW&outputCurrency=" + xToken.address : NEWSWAP_APP + '/#/add/NEW/' + xToken.address}
              target="_blank"
              rel="noreferrer"            
            >
              NewSwap
            </a>,
            <a
              href={ swapTokenInfo ? NEWSWAP_INFO + '/token/' + xToken.address : NEWSWAP_APP + '/#/add/NEW/' + xToken.address}
              target="_blank"
              rel="noreferrer"            
            >
              { swapTokenInfo ? 
                '$'+ truncateDecimal(new BigNumber(swapTokenInfo.totalLiquidity).times(swapTokenInfo.derivedETH).times(newPrice).times(2).toString())
                : '$0.00' }
            </a>,
            <div>
              {
                swapTokenInfo ? '$'+ truncateDecimal(new BigNumber(swapTokenInfo.derivedETH).times(newPrice).toString()) : 'TBD'
              }
            </div>,
            // <div>
            //   {truncateDecimal(
            //     xToken.totalSupply
            //     // web3.utils.fromWei(xToken.totalSupply.toString())
            //   )}
            // </div>,
            // <div>{entry.isD2Vault ? "D2" : "D1"}</div>,
            // <div>
            //   <div
            //     css={`
            //       transform: translateX(-4px);
            //       & > svg {
            //         margin: 0 2px;
            //       }
            //     `}
            //   >
            //     {isFinalized ? <IconCircleCheck /> : <IconCircleMinus />}{" "}
            //     {getFundInfo(vaultId) && getFundInfo(vaultId).verified ? (
            //       <IconCircleCheck />
            //     ) : (
            //       <IconCircleMinus />
            //     )}{" "}
            //     {getFundInfo(vaultId) && getFundInfo(vaultId).amm ? (
            //       <IconCircleCheck />
            //     ) : (
            //       <IconCircleMinus />
            //     )}{" "}
            //   </div>
            // </div>,
            // <div
            //   css={`
            //     & > svg {
            //     }
            //     cursor: pointer;
            //     padding: 5px;
            //   `}
            //   onClick={() =>
            //     isVaultIdFavorited(vaultId)
            //       ? removeFavoriteByVaultId(vaultId)
            //       : addFavorite({
            //           vaultId: vaultId,
            //           ticker: fundSymbol,
            //           address: fundAddress,
            //         })
            //   }
            // >
            //   {isVaultIdFavorited(vaultId) ? <IconStarFilled /> : <IconStar />}
            // </div>,
          ];
          // if (account && balances) {
          if (account) {
            // let _balance = balances.find(
            //   (elem) =>
            //     elem.contract_address.toLowerCase() ===
            //     entry.xToken.address.toLowerCase()
            // );

            // cells.splice(       
            //   3,  // 5,
            //   0,
            //   <div>
            //     {_balance
            //       ? truncateDecimal(web3.utils.fromWei(_balance.balance))
            //       : "0"}
            //   </div>
            // );
            cells.splice(       
              5,
              0,
              <div>
                0
              </div>
            );
          }
          return cells;
        }}
        renderEntryActions={(entry, index) => {
          const {
            vaultId,
            xToken,
            // allowMintRequests,
          } = entry;
          const fundSymbol = xToken.symbol;
          const fundAddress = entry.xToken.address;
          return (
            <ContextMenu>
              <ContextMenuItem
                onClick={() => {
                  handleMint(vaultId, fundSymbol);
                }}
                css={account ? `` : `cursor: default; opacity: 0.3;`}
              >
                Mint
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleRedeem(vaultId, fundSymbol, fundAddress)}
                css={account ? `` : `cursor: default; opacity: 0.3;`}
              >
                Redeem
              </ContextMenuItem>
              {!hideInspectButton && (
                <ContextMenuItem
                  onClick={() => history.push(`/fund/${vaultId}`)}
                >
                  Inspect...
                </ContextMenuItem>
              )}
            </ContextMenu>
          );
        }}
      />
      <SidePanel
        title={panelTitle}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      >
        {account ? (
          innerPanel
        ) : (
          <div
            css={`
              margin-top: 15px;
            `}
          >
            <Info mode="error">You must connect your wallet first</Info>
            <Button
              label={"Return to page"}
              wide={true}
              onClick={() => setPanelOpened(false)}
              css={`
                margin-top: 10px;
              `}
            />
          </div>
        )}
      </SidePanel>
    </div>
  );
}

export const NftType = PropTypes.shape({
  name: PropTypes.string,
  supply: PropTypes.string,
  address: PropTypes.string,
});

FundsList.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(NftType),
  handleMint: PropTypes.func,
};

export default FundsList;
