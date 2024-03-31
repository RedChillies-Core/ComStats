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
  stake_from: []
  total_validators: number
  total_stakers: number
  delegation_fee: number
  type: string
  key: string
  apy: number
  isVerified?: boolean
  wallet_staked?: number
}

export interface InterfacePagination<Data> {
  total: number
  page: number
  limit: number
  validators: Data
}
export interface InterfacePaginationSubnet<Data> {
  total: number
  page: number
  limit: number
  subnets: Data
}

export type IAddStaking = {
  validator: string
  amount: string
  callback?: () => void
}

export type ITransfer = {
  to: string
  amount: string
  callback?: () => void
}
export type ITransferStaking = {
  validatorFrom: string
  amount: string
  validatorTo: string
  callback?: () => void
}
export interface IStats {
  circulating_supply: number
  total_stake: number
  total_subnets: number
  total_validators: number
  total_miners: number
  total_modules: number
  price: number
  marketcap: number
  daily_emission: number
  total_stakers: number
  avg_apy: number
}
export interface IBalanceType {
  balance: number
  staked: number
  stakes: { amount: number; validator: ValidatorType }[]
  daily_reward: number
}

export interface SubnetInterface {
  name: string
  emission: number
  total_modules: number
  founder: string
  immunity_period: number
  incentive_ratio: number
  subnet_id: number
}
