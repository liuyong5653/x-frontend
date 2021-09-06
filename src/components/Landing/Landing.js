import React, { useMemo, useState, useCallback } from "react";
import { Split, DropDown, SidePanel, Info } from "@aragon/ui";
import { network } from "../../environment";
import WelcomeAction from "../WelcomeAction/WelcomeAction";
import Suggestions from "./Suggestions/Suggestions";
import { useSuggestedFunds } from "../../suggested-funds";
import CreateVaultPanel from "../InnerPanels/CreateVaultPanel";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";

import actionCreate from "./assets/action-create.png";
import actionOpen from "./assets/action-open.png";

// 未用到，集成在FundsIndex中
function Landing({ selectorNetworks }) {
  // const selectorNetworksSorted = useMemo(() => {
  //   return selectorNetworks
  //     .map(([type, name, url]) => ({ type, name, url }))
  //     .sort((a, b) => {
  //       if (b.type === network.type) return 1;
  //       if (a.type === network.type) return -1;
  //       return 0;
  //     });
  // }, [selectorNetworks]);

  const [createError, setCreateError] = useState([null]);

  const suggestedFunds = useSuggestedFunds();

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const {
    favoriteFunds,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteFunds();

  const handleCreate = useCallback(
    (degree) => {
      /* // reset the creation state
    saveTemplateState({}) */
      /* const requirementsError = validateCreationRequirements(
      account,
      balance,
      isContractAccount
    )
    setRequirementsError(requirementsError)

    // Account not connected
    if (requirementsError[0] === 'no-account') {
      setConnectIntent('create')
      setConnectModalOpened(true)
      return
    }

    // No error, we can go to create straight away
    if (requirementsError[0] === null) {
      goToCreate()
    } */
      setPanelTitle(
        'Create a Pool'
        // degree === 1 ? "Create a D1 Fund (Step 1/2)" : "Create a D2 Fund"
      );
      setInnerPanel(
        <CreateVaultPanel   
          onContinue={(vaultId) => {
            console.log("create Vault success, vaultId="+vaultId)
            // addFavorite({
            //   ticker: tokenSymbol,
            //   address: tokenAddress,
            //   vaultId: vaultId,
            // });
            setPanelOpened(false);
            // TODO 应该跳到对应的页面
            setTimeout(() => {
              if (window.location.hash !== "/") {
                window.location.hash = "/";
              }
            }, 400);
            }}
        />
      );
      setPanelOpened(true);
    },
    [
      /* account, balance, goToCreate, isContractAccount */
    ]
  );

  return (
    <div
      css={`
        margin-top: 25px;
      `}
    >
        <div>
            <WelcomeAction
              title="Create a simple NFT Vault"
              subtitle={"Deploy a 1:10000 NFT-backed ERC20 token"}
              illustration={actionCreate}
              onActivate={() => handleCreate(1)}
              hasError={
                createError[0] !== null && createError[0] !== "no-account"
              }
            />
          </div>
      {/* <Split
        primary={
          <div>
            <DropDown
              items={selectorNetworksSorted.map((network) => network.name)}
              placeholder={selectorNetworksSorted[0].name}
              onChange={() => console.log("TODO")}
              disabled={false}
              wide
            />
            <WelcomeAction
              title="Create a simple NFT Vault"
              subtitle={"Deploy a 1:10000 NFT-backed ERC20 token"}
              illustration={actionCreate}
              onActivate={() => handleCreate(1)}
              hasError={
                createError[0] !== null && createError[0] !== "no-account"
              }
            />
            <WelcomeAction
              title="Create a complex NFT fund"
              subtitle={"Make a Balancer pool comprised of simple funds"}
              illustration={actionOpen}
              onActivate={() => handleCreate(2)}
              hasError={
                createError[0] !== null && createError[0] !== "no-account"
              }
            />
          </div>
        }
        secondary={<Suggestions suggestedFunds={suggestedFunds} />
      /> */}
      <SidePanel
        title={panelTitle}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      >
        {innerPanel}
      </SidePanel>
    </div>
  );
}

export default Landing;
