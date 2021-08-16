import React, { useState, useRef } from "react";
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

const NFTX_PROXY = process.env.REACT_APP_NFTX_PROXY

function CreateVaultPanel({ onContinue }) {
  console.log('CreateVaultPanel NFTX_PROXY====>'+NFTX_PROXY)

  // TODO 判断若没有链接钱包，点击时先链接钱包
  const { account } = useWallet();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [nftAddress, setNftAddress] = useState("");

  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const handleCreate = () => {
    const nftx = new web3.eth.Contract(Nftx.abi, NFTX_PROXY);
    // window.nftx = nftx;
    nftx.methods
      .createVault(name, symbol, nftAddress, false)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        console.log("handleCreate receipt-------->")
        console.log(receipt);
        setTxReceipt(receipt);
      });
  };

  if (!txHash) {
    return (
      <div
        css={`
          margin-top: 20px;
        `}
      >
        <TextInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (e.g. Punk-20)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />       
        <TextInput
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="Symbol (e.g. PUNK-20)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <TextInput
          value={nftAddress}
          onChange={(event) => setNftAddress(event.target.value)}
          placeholder="NFT contract address (e.g. 0x0bf7...D63a)"
          wide={true}
          css={`
            margin-bottom: 15px;
          `}
        />


        <Button
          label={!account ? '请先链接钱包' : "Create Pool"}
          wide={true}
          disabled={!name || !symbol || !nftAddress || !account}
          onClick={handleCreate}
        />
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
          Pool created succesfully
          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button
          label="View Pools"
          wide={true}
          onClick={() =>
            onContinue(txReceipt.events.NewVault.returnValues.vaultId)
          }
        />
      </div>
    );
  }
}

export default CreateVaultPanel;
