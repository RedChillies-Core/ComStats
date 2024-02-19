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
  total_stakers: number
  delegation_fee: number
  type: string
  key: string
  apy: number
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
