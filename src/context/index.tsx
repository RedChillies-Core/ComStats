"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { transactionFeeCollector } from "@/constants";
import {
  IAddStaking,
  ITransfer,
  ITransferStaking,
  IVerifyModule,
} from "@/types"
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import WalletModal from "@/app/components/modal/connect";
import { errorToast } from "@/app/components/toast";
import { getWallet } from "@/utils/wallet";
import { toast } from "react-toastify";
import { SubmittableExtrinsic } from "@polkadot/api-base/types";
import { getVerificationAmount } from "@/utils/getVerificationAmount";
import { getWallets } from "@subwallet/wallet-connect/dotsama/wallets";
import { Wallet } from "@subwallet/wallet-connect/types";
import BigNumber from "bignumber.js";

interface PolkadotApiState {
  web3Accounts: (() => Promise<InjectedAccountWithMeta[]>) | null
  web3Enable: ((appName: string) => Promise<InjectedExtension[]>) | null
  web3FromAddress: ((address: string) => Promise<InjectedExtension>) | null
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
  balance: BigNumber | undefined;
  extensionSelected: Wallet | null;
  setExtensionSelected: (wallet: Wallet) => void;
  wallets: Wallet[];
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(
  undefined,
)

interface PolkadotProviderProps {
  children: React.ReactNode
  wsEndpoint: string
}
let interval: any;
export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({
  children,
  wsEndpoint,
}) => {
  const [dotsamaWallets, setDotsamaWallets] = useState<Wallet[]>([]);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | []>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [balance, setBalance] = useState<BigNumber | undefined>();
  const [extensionSelected, setExtensionSelected] = useState<Wallet | null>(
    null
  );
  const [blockNumber, setBlockNumber] = useState(0);
  const [polkadotApi, setPolkadotApi] = useState<PolkadotApiState>({
    web3Accounts: null,
    web3Enable: null,
    web3FromAddress: null,
  })
  async function loadPolkadotApi() {
    try{
      const { web3Accounts, web3Enable, web3FromAddress } = await import(
        "@polkadot/extension-dapp"
      )
      setPolkadotApi({
        web3Accounts,
        web3Enable,
        web3FromAddress,
      })
      const provider = new WsProvider(wsEndpoint)
      const newApi = await ApiPromise.create({ provider })
      setApi(newApi)
      setIsInitialized(true)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    async function init() {
      await loadPolkadotApi()
    }
    init()
    return () => {
      api?.disconnect()
    }
  }, [wsEndpoint])

  useEffect(() => {
    if (!api) return;

    handleConnect();
  }, [isInitialized, api]);

  useEffect(() => {
    if(!window) return;
    const wallets = getWallets();
    console.log(wallets);
    setDotsamaWallets(wallets);
  }, [])

  useEffect(() => {
    async function init() {
      const savedWallet = getWallet()
      if (!!savedWallet) {
        if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return
        const extensions = await polkadotApi.web3Enable("ComStats")
        console.log(extensions)
        if (!extensions) {
          throw Error("NO_EXTENSION_FOUND")
        }
        const allAccounts = await polkadotApi.web3Accounts()
        setAccounts(allAccounts)
        setSelectedAccount(savedWallet)
        setIsConnected(true)
      }
    }
    if (isInitialized) init()
  }, [isInitialized])

  useEffect(() => {
    if (api) {
      api.rpc.chain.subscribeNewHeads((header) => {
        setBlockNumber(header.number.toNumber())
      })
    }
  }, [api])

  const handleConnect = async () => {
    if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return;
    const selectedCommuneExtension = window.localStorage.getItem("selectedCommuneExtension")!;
    // const extensions = await polkadotApi.web3Enable("ComSol Bridge")
    // if (!extensions) {
    //   throw Error("NO_EXTENSION_FOUND")
    // }
    if (selectedCommuneExtension) {
      const extension = dotsamaWallets.find(
        (wallet) => wallet.title === selectedCommuneExtension
      );

      if (!extension) return;
      if (extension.installed) {
        setExtensionSelected(extension);
        // console.log("enabling extension");
        await extension?.enable();
        // console.log("extension enabled", extension);

        const accounts = await extension?.getAccounts();
        // console.log("accounts", accounts);
        accounts &&
          setAccounts(
            accounts.map((account) => ({
              address: account.address,
              meta: {
                name: account.name,
                source: extension?.title || "",
                genesisHash: "",
              },
              type: "sr25519",
            }))
          );
        const selectedAccount = window.localStorage.getItem("selectedAccount")!;
        if (selectedAccount) {
          const account = JSON.parse(selectedAccount);
          handleWalletSelections(account);
        }
        window.localStorage.setItem(
          "selectedCommuneExtension",
          extension?.title || ""
        );
      }
    }
    // const allAccounts = await polkadotApi.web3Accounts()
    // console.log(allAccounts)
    // setAccounts(allAccounts)

    // setOpenModal(true)
  };

  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>()

  async function addStake({ subnetId, validator, amount, callback }: IAddStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    
    const amt = Math.floor(Number(amount) * 10 ** 9);
    if (amt <= 0) {
      errorToast("Stake amount must be greater than 0")
      return
    }
    const balance: any = await api.query.system.account(selectedAccount.address)
    const freeBalance = balance.data.free.toNumber()
    if (freeBalance < amt + 2 * 10 ** 9) {
      errorToast(
        `Insufficient balance. You need at least ${(
          (amt + 2 * 10 ** 9) /
          10 ** 9
        ).toFixed(2)} $COMAI to stake ${(amt / 10 ** 9).toFixed(2)} $COMAI`,
      )
      return
    }
    const tx = api.tx.utility.batchAll([
      api.tx.subspaceModule.addStake(subnetId, validator, amt),
      api.tx.balances.transferKeepAlive(transactionFeeCollector, 2 * 10 ** 8),
    ])
    await completeTransaction(tx, callback)
  }

  async function completeTransaction(
    tx: SubmittableExtrinsic<"promise", any>,
    callback?: () => void,
  ) {
    if(selectedAccount === undefined) return;
    if(extensionSelected === null || !extensionSelected.signer) return;

    const balance: any =  await api?.query.system.account(selectedAccount.address);
    console.log("balance", balance)
    const freeBalance = balance.data.free.toNumber();
    if (freeBalance === 0) {
      errorToast("You need to have certain amount of $COMAI to perform this transaction");
      return;
    }
    // check if meta update is needed
    extensionSelected.metadata
    let timeoutOut: any;
    let resolveOut: any;
    let rejectOut: any;

    const promise = new Promise((resolve, reject) => {
      resolveOut = resolve
      rejectOut = reject
      timeoutOut = setTimeout(() => {
        reject(new Error("Transaction failed"));
      }, 30000);
    });
    if(extensionSelected.signer){
      const unsub = await tx.signAndSend(
        selectedAccount.address,
        {
          signer: extensionSelected.signer
        },
        async (result) => {
          const { events } = result
  
          if (result.isFinalized || result.isInBlock) {
            // finalized
            const isSucess = events.every(({ event: { method } }: {
              event: { method: string }
            }) => {
              return method !== "ExtrinsicFailed"
            })
            if (isSucess) {
              unsub()
              resolveOut()
              callback && callback()
              timeoutOut && clearTimeout(timeoutOut)
            }
          } else if (result.isError) {
            // failed
            timeoutOut && clearTimeout(timeoutOut)
            callback && callback()
            unsub()
            rejectOut(new Error("Transaction failed"))
          }
        }
      );
      await toast.promise(
        promise
          .then(() => {
            console.log("promise resolved inside toast.promise")
          })
          .catch((err: any) => {
            console.log("promise rejected inside toast.promise", err)
          }),
        {
          pending: "Sending transaction...",
          success: "Transaction successful",
          error: "Transaction failed",
        },
      )
      clearTimeout(timeoutOut)
    }
  }

  async function removeStake({ subnetId, validator, amount, callback }: IAddStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    console.log("extensionSelected", extensionSelected)
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const tx = api.tx.subspaceModule.removeStake(subnetId, validator, amt);

    await completeTransaction(tx, callback)
  }
  async function transferStake({
    subnetId,
    validatorFrom,
    validatorTo,
    amount,
    callback,
  }: ITransferStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const balance: any = await api.query.system.account(selectedAccount.address);
    const freeBalance = balance.data.free.toNumber();
    if(freeBalance < 1 * 10 ** 9){
      errorToast("Insufficient balance. You need at least 1 $COMAI in your account to transfer");
      return;
    }
    const tx = api.tx.utility.batchAll([
      api.tx.subspaceModule.transferStake(
        subnetId,
        validatorFrom,
        validatorTo,
        amt,
      ),
      // api.tx.balances.transfer(transactionFeeCollector, 2 * 10 ** 8),
    ])
    await completeTransaction(tx, callback)
    // clearTimeout(timeoutOut);
  }

  async function transfer({ to, amount, callback }: ITransfer) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const balance: any = await api.query.system.account(selectedAccount.address);
    const freeBalance = balance.data.free.toNumber();
    if(freeBalance < amt + 1000 - 8 * 10 ** 8){
      errorToast(`Insufficient balance. You need at least ${((amt + 1000 - 8 * 10 ** 8)/10 ** 9).toFixed(2)} $COMAI to transfer ${(amt /10 ** 9).toFixed(2)} $COMAI`);
      return;
    }
    const tx = api.tx.utility.batchAll([
      api.tx.balances.transferKeepAlive(to, amt),
      api.tx.balances.transferKeepAlive(transactionFeeCollector, 2 * 10 ** 8),
    ])

    await completeTransaction(tx, callback)
  }

  async function verifyModule({
    key,
    verificationType,
    duration,
    subnetId = 0,
    callback,
  }: IVerifyModule) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return;
    
    const amount = getVerificationAmount(verificationType, duration);
    const amt = Math.floor(Number(amount) * 10 ** 9);
    const tx = api.tx.utility.batchAll([
      api.tx.balances.transferKeepAlive(
        "5CVUUEQme5fWXD1zkMwZ9iSvR2PXNBsjnN6CX4dWMjc81fsD",
        amt,
      ),
      api.tx.system.remark(`${key},${verificationType},${subnetId}`),
    ])

    await completeTransaction(tx, callback)
  }

  async function getBalance(wallet: InjectedAccountWithMeta) {
    if (!api || !wallet) return;
    const { data } = (await api.query.system.account(wallet.address)) as any;
    return new BigNumber(data.free.toString()).div(10 ** 9);
  }

  const handleWalletSelections = useCallback(async (wallet: InjectedAccountWithMeta) => {
    setSelectedAccount(wallet);
   
    window.localStorage.setItem("selectedAccount", JSON.stringify(wallet));
    setIsConnected(true);
    if (interval) {
      clearInterval(interval);
    }
    getBalance(wallet).then((res) => setBalance(res));
    interval = setInterval(() => {
      getBalance(wallet).then((res) => setBalance(res));
    }, 20000);
    // setOpenModal(false)
  }, [extensionSelected]);

  return (
    <PolkadotContext.Provider
      value={{
        api,
        blockNumber,
        isInitialized,
        isConnected,
        accounts,
        selectedAccount,
        handleConnect: ()=>{
          setOpenModal(true);
        },
        addStake,
        transfer,
        removeStake,
        transferStake,
        verifyModule,
        wallets: dotsamaWallets,
        balance,
        extensionSelected,
        setExtensionSelected,
      }}
    >
      <WalletModal
        open={openModal}
        setOpen={setOpenModal}
        wallets={accounts}
        isConnected={isConnected}
        extensionSelected={extensionSelected}
        setSelectExtension={setExtensionSelected}
        extensions={dotsamaWallets}
        handleWalletSelections={handleWalletSelections}
        setWallets={setAccounts}
      />
      {children}
    </PolkadotContext.Provider>
  )
}

export const usePolkadot = (): PolkadotContextType => {
  const context = useContext(PolkadotContext)
  if (context === undefined) {
    throw new Error("usePolkadot must be used within a PolkadotProvider")
  }
  return context
}
