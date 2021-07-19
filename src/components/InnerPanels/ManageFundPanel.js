import React, { useState, useRef, useEffect } from "react";
import {
  DropDown,
  TextInput,
  Button,
  AddressField,
  IconCheck,
} from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import Nftx from "../../contracts/NFTXv11.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";

const NFTX_PROXY = process.env.REACT_APP_NFTX_PROXY

function ManageFundPanel({
  vaultId,
  onContinue,
  isFinalized,
  manager,
  isClosed,
}) {
  const { account } = useWallet();

  const injected = window.ethereum;
  // const provider =
  //   (injected && injected.chainId === "0x1") || injected.isFrame
  //     ? injected
  //     : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const provider = injected
  const { current: web3 } = useRef(new Web3(provider));
  const nftx = new web3.eth.Contract(Nftx.abi, NFTX_PROXY);

  // const [newName, setNewName] = useState("");
  // const [newSymbol, setNewSymbol] = useState("");
  const [nftIds, setNftIds] = useState("");
  const [areEligible, setAreEligible] = useState("");
  const [shouldNegate, setShouldNegate] = useState("");
  // const [tokenId, setTokenId] = useState("");
  // const [recipient, setRecipient] = useState("");

  // const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  useEffect(() => {
    console.log("txError", txError);
  }, [txError]);

  const [nftxAdmin, setNftxAdmin] = useState(null);

  useEffect(() => {
    nftx.methods
      .owner()
      .call({ from: account })
      .then((retVal) => setNftxAdmin(retVal));
  });

  console.log("ManageFundPanel manager ====>" + manager)
  console.log("ManageFundPanel owner ====>" + nftxAdmin)
  console.log((account !== manager && account !== nftxAdmin))

  // const handleChangeTokenName = () => {
  //   nftx.methods
  //     .changeTokenName(vaultId, newName)
  //     .send(
  //       {
  //         from: account,
  //       },
  //       (error, txHash) => {}
  //     )
  //     .on("error", (error) => setTxError(error))
  //     .on("transactionHash", (txHash) => setTxHash(txHash))
  //     .on("receipt", (receipt) => {
  //       setTxReceipt(receipt);
  //     });
  // };

  // const handleChangeTokenSymbol = () => {
  //   nftx.methods
  //     .changeTokenName(vaultId, newName)
  //     .send(
  //       {
  //         from: account,
  //       },
  //       (error, txHash) => {}
  //     )
  //     .on("error", (error) => setTxError(error))
  //     .on("transactionHash", (txHash) => setTxHash(txHash))
  //     .on("receipt", (receipt) => {
  //       setTxReceipt(receipt);
  //     });
  // };

  const handleSetIsEligible = () => {
    console.log("inside handleSetIsEligible() !!!!! ");
    console.log("JSON.parse(nftIds)====>",JSON.parse(nftIds))
    console.log("vaultId====>",vaultId)
    console.log('areEligible.toLowerCase().includes("true")===>', areEligible.toLowerCase().includes("true"))

    nftx.methods
      .setIsEligible(
        vaultId,
        JSON.parse(nftIds),
        areEligible.toLowerCase().includes("true")
      )
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => {
        console.log("handleSetIsEligible error", error);
        setTxError(error);
      })
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        setTxReceipt(receipt);
      });
  };

  // TODO 取消掉这个，就一个所有都通过 或 指定范围(指定范围时将setNegateEligibility=false)，不需要什么取反     UI上简单点！
  // 有一个问题，若vault持有资产，无法修改setNegateEligibility，必须空了以后才可以设置！！！   和handleSetIsEligible合并需要考虑这个问题，必须先把当前资产取出，所以没有Finalize之前不允许对外公开
  const handleSetNegateEligibility = () => {

    console.log("handleSetNegateEligibility")
    console.log("vaultId====>",vaultId)
    console.log('shouldNegate.toLowerCase().includes("true")====>', shouldNegate.toLowerCase().includes("true"))

    nftx.methods
      .setNegateEligibility(
        vaultId,
        shouldNegate.toLowerCase().includes("true")
      )
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        setTxReceipt(receipt);
      });
  };

  const handleFinalize = () => {
    nftx.methods
      .finalizeVault(vaultId)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        setTxReceipt(receipt);
        console.log(receipt);
      });
  };

  // const handleClose = () => {
  //   nftx.methods
  //     .closeVault(vaultId)
  //     .send(
  //       {
  //         from: account,
  //       },
  //       (error, txHash) => {}
  //     )
  //     .on("error", (error) => setTxError(error))
  //     .on("transactionHash", (txHash) => setTxHash(txHash))
  //     .on("receipt", (receipt) => {
  //       setTxReceipt(receipt);
  //       console.log(receipt);
  //     });
  // };

  if (!txHash) {
    return (
      <div
        css={`
          & > div {
            margin-top: 25px;
            margin-bottom: 40px;
          }
        `}
      >
        {/* <div>
          <TextInput
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="New name (e.g. Punk-Basic-Male)"
            wide={true}
            css={`
              margin-bottom: 10px;
            `}
          />
          <Button
            label={"Change Token Name"}
            wide={true}
            disabled={
              isClosed || (account !== manager && account !== nftxAdmin)
            }
            onClick={handleChangeTokenName}
            css={`
              margin-top: 5px;
              margin-bottom: 15px;
            `}
          />
        </div> */}
        {/* <div>
          <TextInput
            value={newSymbol}
            onChange={(event) => setNewSymbol(event.target.value)}
            placeholder="New symbol (e.g. PUNK-BASIC-M)"
            wide={true}
            css={`
              margin-bottom: 10px;
            `}
          />
          <Button
            label={"Change Token Symbol"}
            wide={true}
            disabled={
              isClosed || (account !== manager && account !== nftxAdmin)
            }
            onClick={handleChangeTokenSymbol}
            css={`
              margin-top: 5px;
              margin-bottom: 15px;
            `}
          />
        </div> */}
        <div>
          <TextInput
            value={nftIds}
            onChange={(event) => setNftIds(event.target.value)}
            placeholder="NFT IDs (array, e.g. [42,16,23])"
            wide={true}
            css={`
              margin-bottom: 10px;
            `}
          />
          <TextInput
            value={areEligible}
            onChange={(event) => setAreEligible(event.target.value)}
            placeholder="Are eligible ? (bool, e.g. true)"
            wide={true}
            css={`
              margin-bottom: 10px;
            `}
          />
          <Button
            label={"Set NFT Eligibility"}
            wide={true}
            disabled={
              isClosed || (isFinalized && account !== nftxAdmin) || (account !== manager && account !== nftxAdmin)
            }
            onClick={handleSetIsEligible}
            css={`
              margin-top: 5px;
              margin-bottom: 15px;
            `}
          />
        </div>
        <div>
          <TextInput
            value={shouldNegate}
            onChange={(event) => setShouldNegate(event.target.value)}
            placeholder="Should negate ? (bool, e.g. false)"
            wide={true}
            css={`
              margin-bottom: 10px;
            `}
          />
          <Button
            label={"Negate Eligibility"}
            wide={true}
            disabled={
              isClosed || (isFinalized && account !== nftxAdmin) || (account !== manager && account !== nftxAdmin)
            }
            onClick={handleSetNegateEligibility}
            css={`
              margin-top: 5px;
              margin-bottom: 15px;
            `}
          />
        </div>
        <div>
          <Button
            label={"Finalize Fund"}
            wide={true}
            disabled={
              isClosed || isFinalized || (account !== manager && account !== nftxAdmin)
            }
            onClick={handleFinalize}
            css={`
              margin-top: 5px;
              margin-bottom: 15px;
            `}
          />
        </div>
        {/* <div>
          <Button
            label={"Close Fund"}
            wide={true}
            disabled={
              isClosed || (account !== manager && account !== nftxAdmin)
            }
            onClick={handleClose}
            css={`
              margin-top: 5px;
              margin-bottom: 15px;
            `}
          />
        </div> */}
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
          Transaction in progress...
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
  } else if (txError) {
    return (
      <div>
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          Error occured. Check console.
        </div>
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
          Transaction was successful
          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button label="Return to Page" wide={true} onClick={onContinue} />
      </div>
    );
  }
}

export default ManageFundPanel;
