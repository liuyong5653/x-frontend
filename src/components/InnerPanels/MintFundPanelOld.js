import React, { useState, useRef, useEffect } from "react";
import {
  DropDown,
  TextInput,
  Button,
  AddressField,
  IconCheck,
  IconCircleCheck,
} from "@aragon/ui";
import axios from "axios";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import Nftx from "../../contracts/NFTX.json";
import XStore from "../../contracts/XStore.json";
import KittyCore from "../../contracts/KittyCore.json";
import IErc721 from "../../contracts/IERC721.json";
import IErc1155 from "../../contracts/IERC1155.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";

const NFTX_PROXY = process.env.REACT_APP_NFTX_PROXY
const XSTORE = process.env.REACT_APP_XSTORE

// 用户自己输入拥有的TokenId铸币
function MintFundPanelOld({
  fundData,
  onContinue,
  onMakeRequest,
  allowMintRequests,
}) {
  const { account, ethereum } = useWallet();
  // const { current: web3 } = useRef(new Web3(window.ethereum));
  const { current: web3 } = useRef(new Web3(ethereum));
  const xStore = new web3.eth.Contract(XStore.abi, XSTORE);
  const nftx = new web3.eth.Contract(Nftx.abi, NFTX_PROXY);

  const [tokenIds, setTokenIds] = useState("");
  const [tokenIdsArr, setTokenIdsArr] = useState([]);

  // const [nftAddress, setNftAddress] = useState("");
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);

  const [nftData, setNftData] = useState([]);
  const [nftEligData, setNftEligData] = useState([]);
  // const [negateElig, setNegateElig] = useState(null);

  const [txIsApproval, setTxIsApproval] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const [doneMinting, setDoneMinting] = useState(false);

  // const isKittyAddr = (address) => {
  //   const kittyAddr = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
  //   return address.toLowerCase() === kittyAddr.toLowerCase();
  // };  
  console.log("MintFundPanel fundData====>", fundData)

  /* useEffect(() => {
    xStore.methods
      .nftAddress(vaultId)
      .call({ from: account })
      .then((retVal) => {
        setNftAddress(retVal);
        xStore.methods
          .negateEligibility(vaultId)
          .call({ from: account })
          .then((retVal) => setNegateElig(retVal));
      });
  }, []); */

  useEffect(() => {
    if (/* nftAddress && */ account) {
      fetchIsApprovedAll();
    }
  }, [/* nftAddress, */ account]);

  useEffect(() => {
    let arr = [...tokenIds.matchAll(/\d+/g)];
    var uniq = [...new Set(arr.map((str) => parseInt(str)))];
    setTokenIdsArr(uniq);
  }, [tokenIds]);

  useEffect(() => {
    updateNftOwnerData();
    updateNftEligData();
  }, [tokenIdsArr]);

  const fetchIsApprovedAll = () => {
    // if (!isKittyAddr(fundData.asset.address)) {
      const nft = new web3.eth.Contract(
        fundData.is1155 ? IErc1155.abi : IErc721.abi,
        fundData.asset.address
      );
      nft.methods
        .isApprovedForAll(account, NFTX_PROXY)
        .call({ from: account })
        .then((retVal) => {
          setIsApprovedForAll(retVal);
        });
    // }
  };

  const updateNftOwnerData = () => {
    if (tokenIdsArr.length > 0) {
      const nftExistenceArr = [];
      const nftOwnershipArr = [];
      let count = 0;
      tokenIdsArr.forEach((tokenId, index) => {
        const finish = (retVal) => {
          nftExistenceArr[index] = fundData.is1155 || retVal !== "DNE";
          nftOwnershipArr[index] = fundData.is1155
            ? parseInt(retVal) > 0
            : retVal === account;
          count += 1;
          if (count === tokenIdsArr.length) {
            fetchApproval(nftExistenceArr, nftOwnershipArr).then(
              (nftApprovalArr) => {
                const _nftData = nftExistenceArr.map((elem, _index) => ({
                  tokenId: tokenId,
                  existence: elem,
                  ownership: nftOwnershipArr[_index],
                  approval: nftApprovalArr[_index],
                }));
                setNftData(_nftData);
              }
            );
          }
        };
        if (fundData.is1155) {
          const nft = new web3.eth.Contract(
            IErc1155.abi,
            fundData.asset.address
          );
          nft.methods
            .balanceOf(account, tokenId)
            .call({ from: account })
            .then((retVal) => finish(retVal))
            .catch((error) => finish("DNE"));
        } else {
          const nft = new web3.eth.Contract(
            IErc721.abi,
            fundData.asset.address
          );
          nft.methods
            .ownerOf(tokenId)
            .call({ from: account })
            .then((retVal) => finish(retVal))
            .catch((error) => finish("DNE"));
        }
      });
    } else {
      setNftData([]);
    }
  };

  const updateNftEligData = () => {
    const _nftEligData = tokenIdsArr.map((tokenId, index) => {
      if (fundData.negateEligibility) {
        return !fundData.eligibilities.includes(tokenId.toString());
      } else {
        return fundData.eligibilities.includes(tokenId.toString());
      }
    });
    setNftEligData(_nftEligData);
  };

  const fetchApproval = (nftExistenceArr, nftOwnershipArr) =>
    new Promise((resolve, reject) => {
      if (nftOwnershipArr.length > 0) {
        // const abi = isKittyAddr(fundData.asset.address)
        //   ? KittyCore.abi
        //   : IErc721.abi;
        const abi = IErc721.abi;
        const nft = new web3.eth.Contract(abi, fundData.asset.address);
        const newNftApprovalArr = [];
        let count = 0;
        tokenIdsArr.forEach((tokenId, index) => {
          const finish = (retVal) => {
            newNftApprovalArr[index] = retVal === NFTX_PROXY;
            count += 1;
            if (count === nftOwnershipArr.length) {
              resolve(newNftApprovalArr);
            }
          };
          if (!nftExistenceArr[index] || !nftOwnershipArr[index]) {
            finish(false);
          } else if (isApprovedForAll) {
            finish(true);
          } else {
            // if (isKittyAddr(fundData.asset.address)) {
            //   nft.methods
            //     .kittyIndexToApproved(tokenId)
            //     .call({ from: account })
            //     .then((retVal) => {
            //       finish(retVal);
            //     })
            //     .catch((error) => {
            //       console.log("error", error);
            //       finish(false);
            //     });
            // } else {
              nft.methods
                .getApproved(tokenId)
                .call({ from: account })
                .then((retVal) => {
                  finish(retVal);
                })
                .catch((error) => {
                  console.log("error", error);
                  finish(false);
                });
            // }
          }
        });
      }
    });

  const handleMint = () => {
    setTxIsApproval(false);
    setTxHash(null);
    setTxReceipt(null);
    const nftx = new web3.eth.Contract(Nftx.abi, NFTX_PROXY);
    nftx.methods
      .mint(fundData.vaultId, tokenIdsArr)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        // TODO ????
        // axios.get(
        //   "https://purgecache.simplethings.workers.dev/__purge_cache?zone=0d06080714818598b845f30e54535880"
        // );
        setDoneMinting(true);
        setTxReceipt(receipt);
        console.log("handleMint receipt-------->")
        console.log(receipt);
      });
  };

  const handleViewNFT = () => {
    onContinue();
  };

  const handleApprove = (tokenId) => {
    setTxHash(null);
    setTxReceipt(null);
    setTxIsApproval(true);
    const nft = new web3.eth.Contract(IErc721.abi, fundData.asset.address);
    nft.methods
      .approve(NFTX_PROXY, tokenId)
      .send({ from: account }, (error, txHash) => {})
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        fetchIsApprovedAll();
        setNftData([]);
        setTxReceipt(receipt);
        updateNftOwnerData();
        console.log(receipt);
      });
  };

  const handleSetApproveAll = (isApproved) => {
    setTxHash(null);
    setTxReceipt(null);
    setTxIsApproval(true);
    const nft = new web3.eth.Contract(IErc721.abi, fundData.asset.address);
    nft.methods
      .setApprovalForAll(NFTX_PROXY, isApproved)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        fetchIsApprovedAll();
        setNftData([]);
        setTxReceipt(receipt);
        updateNftOwnerData();
        console.log(receipt);
      });
  };

  // TODO 上来就判断是否全部授权了，没有授权直接让对方授权，而不是一个个授权！！！！
  const approveOrUnapproveAllBtn = (
    <Button
      label={isApprovedForAll ? "Unapprove All" : "Approve All"}
      wide={true}
      disabled={!account}
      onClick={() => handleSetApproveAll(!isApprovedForAll)}
      css={`
        margin-top: 15px;
        bottom: 0;
        ${isApprovedForAll ||
        nftData.filter((elem) => elem.ownership && !elem.approval).length < 2
          ? "position: absolute;"
          : ""}
      `}
    />
  );

  if (!doneMinting && (!txHash || (txIsApproval && txReceipt))) {
    return (
      <div
        css={`
          margin-top: 20px;
          height: 100%;
          position: relative;
        `}
      >
        <TextInput
          value={tokenIds}
          onChange={(event) => setTokenIds(event.target.value)}
          placeholder="Token IDs (e.g. [7,42,88])"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />

        {isApprovedForAll ? (
            <Button
              label={`Mint ${nftData.length > 0 ? nftData.length*10000 + " " : ""}${
                fundData.xToken.symbol
              }`}
              wide={true}
              disabled={
                nftData.length === 0 ||
                nftData.filter(
                  (elem, index) =>
                    !elem.existence ||
                    !elem.ownership ||
                    (!elem.approval && !isApprovedForAll) ||
                    !nftEligData[index]
                ).length > 0
              }
              onClick={handleMint}
            />
          ) : (
            <Button
              label={"Approve All"}
              wide={true}
              disabled={!account}
              onClick={() => handleSetApproveAll(!isApprovedForAll)}
            />          
          )}

        <div
          // css={`
          // `}
        >
          每一枚{fundData.asset.symbol} NFT可铸10000 {fundData.xToken.symbol}，铸币成功后，消耗的{fundData.asset.symbol}不再属于您。
          {/* {fundData.xToken.symbol} 总数：{tokenBalance.dividedBy(new BigNumber(10).pow(18)).toNumber()} */}
        </div>

        <div
          css={`
            margin-top: 15px;
          `}
        >
          {tokenIdsArr.map((tokenId, index) => (
            <div
              key={tokenId}
              css={`
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 60px;
                position: relative;
              `}
            >
              <div
                css={`
                  padding: 0 5px;
                `}
              >
                ID #{tokenId}
              </div>
              <div
                css={`
                  padding: 0 5px;
                `}
              >
                {(() => {
                  if (!nftData[index]) {
                    return "";
                  } else if (!nftData[index].existence) {
                    return "DNE";
                  } else if (
                    nftEligData[index] === false
                    // (nftEligData[index] === false &&
                    //   !fundData.negateEligibility) ||
                    // (nftEligData[index] && fundData.negateEligibility)
                  ) {
                    // if (allowMintRequests) {
                    //   return (
                    //     <Button label="Request Mint" onClick={onMakeRequest} />
                    //   );
                    // } else {
                      return "Not eligible";
                    // }
                  } else if (!nftData[index].ownership) {
                    return "Not owner";
                  } 
                  // else if (!nftData[index].approval && !isApprovedForAll) {
                  //   // return fundData.is1155 ? (
                  //   //   "Not approved"
                  //   // ) : (
                  //   //   <Button
                  //   //     label="Approve Transfer"
                  //   //     onClick={() => handleApprove(tokenId)}
                  //   //   />
                  //   // );
                  // } 
                  else {
                    return <IconCircleCheck />;
                  }
                })()}
              </div>
              <div
                className="line"
                css={`
                  position: absolute;
                  bottom: 0;
                  width: 96%;
                  border-bottom: 1px dotted white;
                  margin-left: 2%;
                  opacity: 0.4;
                `}
              ></div>
            </div>
          ))}
        </div>
        {/* {fundData.asset.address &&
          // !isKittyAddr(fundData.asset.address) &&
          approveOrUnapproveAllBtn} */}
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
          {txIsApproval ? "Approval" : "Minting"} in progress...
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
      <div
        css={`
          height: 100%;
          position: relative;
        `}
      >
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          {txIsApproval
            ? "Unapproval was successful"
            : `${fundData.xToken.symbol} minted successfully`}

          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button label="Return to Page" wide={true} onClick={handleViewNFT} />
        {/* {isApprovedForAll && approveOrUnapproveAllBtn} */}
      </div>
    );
  }
}

export default MintFundPanelOld;
