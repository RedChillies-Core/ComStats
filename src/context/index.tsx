"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { NET_ID, transactionFeeCollector } from "@/constants";
import {
  IAddStaking,
  ITransfer,
  ITransferStaking,
  IVerifyModule,
} from "@/types";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import WalletModal from "@/app/components/modal/connect";
import { errorToast, successToast } from "@/app/components/toast";
import { getWallet, setWallet } from "@/utils/wallet";
import { toast } from "react-toastify";
import { SubmittableExtrinsic } from "@polkadot/api-base/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { getVerificationAmount } from "@/utils/getVerificationAmount";

interface PolkadotApiState {
  web3Accounts: (() => Promise<InjectedAccountWithMeta[]>) | null;
  web3Enable: ((appName: string) => Promise<InjectedExtension[]>) | null;
  web3FromAddress: ((address: string) => Promise<InjectedExtension>) | null;
}

interface PolkadotContextType {
  api: ApiPromise | null;
  blockNumber: number;
  isConnected: boolean;
  isInitialized: boolean;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | undefined;
  handleConnect: () => void;
  addStake: (args: IAddStaking) => void;
  removeStake: (args: IAddStaking) => void;
  transfer: (args: ITransfer) => void;
  transferStake: (args: ITransferStaking) => void;
  verifyModule: (args: IVerifyModule) => void;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(
  undefined
);

interface PolkadotProviderProps {
  children: React.ReactNode;
  wsEndpoint: string;
}

export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({
  children,
  wsEndpoint,
}) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [blockNumber, setBlockNumber] = useState(0);
  const [polkadotApi, setPolkadotApi] = useState<PolkadotApiState>({
    web3Accounts: null,
    web3Enable: null,
    web3FromAddress: null,
  });
  async function loadPolkadotApi() {
    const { web3Accounts, web3Enable, web3FromAddress } = await import(
      "@polkadot/extension-dapp"
    );
    setPolkadotApi({
      web3Accounts,
      web3Enable,
      web3FromAddress,
    });
    const provider = new WsProvider(wsEndpoint);
    const newApi = await ApiPromise.create({ provider });
    setApi(newApi);
    setIsInitialized(true);
  }
  useEffect(() => {
    async function init() {
      await loadPolkadotApi();
    }
    init();
    return () => {
      api?.disconnect();
    };
  }, [wsEndpoint]);

  useEffect(() => {
    async function init() {
      const savedWallet = getWallet();
      if (!!savedWallet) {
        if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return;
        const extensions = await polkadotApi.web3Enable("ComStats");
        console.log(extensions);
        if (!extensions) {
          throw Error("NO_EXTENSION_FOUND");
        }
        const allAccounts = await polkadotApi.web3Accounts();
        setAccounts(allAccounts);
        setSelectedAccount(savedWallet);
        setIsConnected(true);
      }
    }
    if (isInitialized) init();
  }, [isInitialized]);

  useEffect(() => {
    if (api) {
      api.rpc.chain.subscribeNewHeads((header) => {
        setBlockNumber(header.number.toNumber());
      });
    }
  }, [api]);

  const handleConnect = async () => {
    if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return;
    const extensions = await polkadotApi.web3Enable("ComStats");
    if (!extensions) {
      throw Error("NO_EXTENSION_FOUND");
    }
    const allAccounts = await polkadotApi.web3Accounts();
    setAccounts(allAccounts);
    setOpenModal(true);
  };

  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>();

  async function addStake({ validator, amount, callback }: IAddStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const tx = api.tx.utility.batchAll([
      api.tx.subspaceModule.addStake(NET_ID, validator, amt),
      api.tx.balances.transfer(transactionFeeCollector, 2 * 10 ** 8),
    ]);
    await completeTransaction(tx, callback);
  }

  async function completeTransaction(
    tx: SubmittableExtrinsic<"promise", ISubmittableResult>,
    callback?: () => void
  ) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);

    let timeoutOut: any;
    let resolveOut: any;
    let rejectOut: any;

    const promise = new Promise((resolve, reject) => {
      resolveOut = resolve;
      rejectOut = reject;
      timeoutOut = setTimeout(() => {
        reject(new Error("Transaction failed"));
      }, 12000);
    });
    const unsub = await tx.signAndSend(
      selectedAccount.address,
      {
        signer: injector.signer,
      },
      (result) => {
        const { events } = result;
        if (
          events.length > 0 &&
          (result.status.isInBlock ||
            result.status.isFinalized ||
            result.status.isReady ||
            result.status.isBroadcast)
        ) {
          const isSuccess = events.every(
            ({ event }) => !api.events.system.ExtrinsicFailed.is(event)
          );
          if (isSuccess) {
            // successToast("Transaction Done")
            callback?.();
            resolveOut();
            unsub();
          } else {
            // console.log("events",events);,
            rejectOut(new Error("Transaction failed"));
          }
        } else if (result.isError) {
          // console.log("result", result);
          rejectOut(new Error("Transaction failed"));
        } else if (result.isFinalized) {
          const isSuccess = events.every(
            ({ event }) => !api.events.system.ExtrinsicFailed.is(event)
          );
          if (isSuccess) {
            // successToast("Transaction Done")
            console.log("result", result);
            callback?.();
            resolveOut();
            unsub();
          }
        }
      }
    );

    await toast.promise(
      promise
        .then(() => {
          console.log("promise resolved inside toast.promise");
        })
        .catch((err: any) => {
          console.log("promise rejected inside toast.promise", err);
        }),
      {
        pending: "Sending transaction...",
        success: "Transaction successful",
        error: "Transaction failed",
      }
    );
    clearTimeout(timeoutOut);
  }

  async function removeStake({ validator, amount, callback }: IAddStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const tx = api.tx.utility.batchAll([
      api.tx.subspaceModule.removeStake(NET_ID, validator, amt),
      api.tx.balances.transfer(transactionFeeCollector, 2 * 10 ** 8),
    ]);
    await completeTransaction(tx, callback);
  }
  async function transferStake({
    validatorFrom,
    validatorTo,
    amount,
    callback,
  }: ITransferStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const tx = api.tx.utility.batchAll([
      api.tx.subspaceModule.transferStake(
        NET_ID,
        validatorFrom,
        validatorTo,
        amt
      ),
      api.tx.balances.transfer(transactionFeeCollector, 2 * 10 ** 8),
    ]);
    await completeTransaction(tx, callback);
    // clearTimeout(timeoutOut);
  }

  async function transfer({ to, amount, callback }: ITransfer) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const tx = api.tx.utility.batchAll([
      api.tx.balances.transfer(to, amt),
      api.tx.balances.transfer(transactionFeeCollector, 2 * 10 ** 8),
    ]);

    await completeTransaction(tx, callback);
  }

  async function verifyModule({
    key,
    verificationType,
    duration,
    subnetId = 0,
    callback,
  }: IVerifyModule) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);
    const amount = getVerificationAmount(verificationType, duration);
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const tx = api.tx.utility.batchAll([
      api.tx.balances.transfer(
        "5CVUUEQme5fWXD1zkMwZ9iSvR2PXNBsjnN6CX4dWMjc81fsD",
        amt
      ),
      api.tx.system.remark(`${key},${verificationType},${subnetId}`),
    ]);

    await completeTransaction(tx, callback);
  }

  async function handleWalletSelections(wallet: InjectedAccountWithMeta) {
    setSelectedAccount(wallet);
    setWallet(wallet);
    setIsConnected(true);
    setOpenModal(false);
  }

  return (
    <PolkadotContext.Provider
      value={{
        api,
        blockNumber,
        isInitialized,
        isConnected,
        accounts,
        selectedAccount,
        handleConnect,
        addStake,
        transfer,
        removeStake,
        transferStake,
        verifyModule,
      }}
    >
      <WalletModal
        open={openModal}
        setOpen={setOpenModal}
        wallets={accounts}
        handleWalletSelections={handleWalletSelections}
      />
      {children}
    </PolkadotContext.Provider>
  );
};

export const usePolkadot = (): PolkadotContextType => {
  const context = useContext(PolkadotContext);
  if (context === undefined) {
    throw new Error("usePolkadot must be used within a PolkadotProvider");
  }
  return context;
};
