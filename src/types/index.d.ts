export type ValidatorType = {
  name: string
  address: string
  emission: number
  incentive: number
  dividends: number
  regblock: number
  last_update: number
  balance: number
  stake: number
  total_validators: number
  total_stakers: number
  delegation_fee: number
  type: string
  key: string
  apy: number
  wallet_staked?: number
}

export interface InterfacePagination<Data> {
  total: number
  page: number
  limit: number
  validators: Data
}

export type IAddStaking = {
  validator: string
  amount: string
}

export type ITransfer = {
  to: string
  amount: string
}
export type ITransferStaking = {
  validatorFrom: string
  amount: string
  validatorTo: strng
}
export interface IStats {
  circulating_supply: number
  total_stake: number
  total_validators: number
  total_miners: number
  price: number
  marketcap: number
  daily_emission: number
  block: number
  total_stakers: number
}
export interface IBalanceType {
  balance: number
  staked: number
  stakes: any[]
}
