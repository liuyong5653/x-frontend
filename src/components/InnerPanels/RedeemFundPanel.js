import React, { useState, useRef, useEffect } from "react";
import {
  DropDown,
  TextInput,
  Button,
  AddressField,
  IconCheck,
} from "@aragon/ui";
import axios from "axios";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import erc721 from "../../contracts/ERC721Public.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import XStore from "../../contracts/XStore.json";
import Nftx from "../../contracts/NFTX.json";
import XToken from "../../contracts/XToken.json";
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import useTokenBalance from '../../hooks/useTokenBalance'

const NFTX_PROXY = process.env.REACT_APP_NFTX_PROXY
const XSTORE = process.env.REACT_APP_XSTORE

function RedeemFundPanel({ fundData, ticker, onContinue }) {
  const { account } = useWallet();
  const provider = window.ethereum;
  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, XSTORE);
  const nftx = new web3.eth.Contract(Nftx.abi, NFTX_PROXY);
  const xToken = new web3.eth.Contract(XToken.abi, fundData.xToken.address);

  const [amount, setAmount] = useState("");

  const [allowance, setAllowance] = useState(new BigNumber(0))
  const [doneRedeeming, setDoneRedeeming] = useState(false);
  const [nftIdsArr, setNftIdsArr] = useState(null);

  const [txIsApproval, setTxIsApproval] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const tokenBalance = useTokenBalance(fundData.xToken.address)
  // console.log("RedeemFundPanel tokenBalance ====> "+ tokenBalance.toNumber())

  useEffect(() => {
    fetchAllowance();
  }, [account]);

  const fetchAllowance = () => {
    if (account)
      xToken.methods
        .allowance(account, NFTX_PROXY)
        .call({ from: account })
        .then((retVal) => setAllowance(new BigNumber(retVal)));
  };

  const handleRedeem = () => {
    setTxIsApproval(false);
    setTxHash(null);
    setTxReceipt(null);
    nftx.methods
      .redeem(fundData.vaultId, amount)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        console.log('handleRedeem receipt-------->');
        console.log(receipt);

        if(receipt.events["Redeem"]){
          if(receipt.events["Redeem"] instanceof Array) {
            console.log("Redeem length="+receipt.events["Redeem"].length);
            const nftIds = receipt.events["Redeem"].map((elem) => {
              return elem.returnValues.nftIds
            });
            setNftIdsArr(nftIds)
          } else {
            setNftIdsArr(receipt.events["Redeem"].returnValues.nftIds)
          }
        }
        // receipt.events["Redeem"] &&
        //   setNftIdsArr(receipt.events["Redeem"].returnValues.nftIds);
        setDoneRedeeming(true);
        // axios.get(
        //   "https://purgecache.simplethings.workers.dev/__purge_cache?zone=0d06080714818598b845f30e54535880"
        // );
        setTxReceipt(receipt);
      });
  };

  const handleApprove = () => {
    setTxHash(null);
    setTxReceipt(null);
    setTxIsApproval(true);
    xToken.methods
      .approve(NFTX_PROXY, ethers.constants.MaxUint256)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        fetchAllowance();
        setTimeout(() => setTxReceipt(receipt), 1000);
        console.log("handleApprove receipt-------->")
        console.log(receipt);
      });
  };

  if (!doneRedeeming && (!txHash || (txIsApproval && txReceipt))) {
    return (
      <div
        css={`
          margin-top: 20px;
        `}
      >
        <TextInput
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount (e.g. 1)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        {!allowance.toNumber() ? (
              <Button
                label={`Approve ${fundData.xToken.symbol}`}
                wide={true}
                disabled={!account}
                onClick={handleApprove}
              />
            ) : (
              <Button
                label={                
                  tokenBalance.dividedBy(new BigNumber(10).pow(18)).toNumber() >= (!isNaN(parseInt(amount)) ? parseInt(amount)* 10000 : 0)               
                  ? `Redeem ${!isNaN(parseInt(amount)) ? parseInt(amount) : ""} ${fundData.asset.symbol} NFT` :
                  `${fundData.xToken.symbol} 余额不足`                
                }
                wide={true}
                disabled={!parseInt(amount) || !account}
                onClick={handleRedeem}
              />
            )}
        <div
          // css={`
          // `}
        >
          {fundData.xToken.symbol} 余额：{tokenBalance.dividedBy(new BigNumber(10).pow(18)).toNumber()}<br/>
          每赎回一枚{fundData.asset.symbol} NFT需消耗10000 {fundData.xToken.symbol}
        </div>

      </div>
    );
  } else if (txHash && !txReceipt) {
    return (
      <div>
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          {txIsApproval ? "Approval" : "Redemption"} in progress...
        </div>
        <HashField hash={txHash} />
        <Loader
          type="ThreeDots"
          color="#201143"
          width={150}
          css={`
            margin-top: 50px;
            display: flex;
            justify-content: center;
          `}
        />
      </div>
    );
  } else {
    return (
      <div>
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          Redemption was successful
          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <div
          css={`
            background: rgba(53, 43, 78, 0.7);
            padding: 6px 8px 3px;
            border-radius: 3px;
            margin-bottom: 15px;
          `}
        >
          {nftIdsArr.length === 0 ? "<empty>" : nftIdsArr.join(", ")}
        </div>
        <Button label="Return To Page" wide={true} onClick={onContinue} />
      </div>
    );
  }
}

export default RedeemFundPanel;
