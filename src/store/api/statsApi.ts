import { createApi } from "@reduxjs/toolkit/query/react"
import apiWrapper from "@/store/api/wrapper/apiWrapper"
import {
  IBalanceType,
  IStats,
  InterfacePaginatedUsers,
  InterfacePagination,
  InterfacePaginationSubnet,
  RichListType,
  SubnetInterface,
  ValidatorType,
} from "@/types"
export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: apiWrapper,
  tagTypes: [
    "ValidatorsList",
    "RichList",
    "CommuneStats",
    "SingleValidator",
    "SubnetsList",
    "SingleSubnet",
    "AllValidatorsList",
  ],
  endpoints: (builder) => ({
    getValidators: builder.query<
      InterfacePagination<ValidatorType[]>,
      { page: number; search?: string; type?: string }
    >({
      query: ({ page, search, type }) => {
        let url = `/validators/?page=${page}&limit=50`
        if (search && search !== undefined && search !== "") {
          url += `&search=${search}`
        }
        if (type && type !== undefined && type !== "") {
          url += `&type=${type}`
        }
        return url
      },
      providesTags: ["ValidatorsList"],
      transformResponse: (response: InterfacePagination<ValidatorType[]>) => {
        console.log("HERE", response)
        return response
      },
    }),
    getAllValidators: builder.query<ValidatorType[], void>({
      query: () => `/validators/`,
      providesTags: ["AllValidatorsList"],
      transformResponse: (response: InterfacePagination<ValidatorType[]>) => {
        return response.validators
      },
    }),
    getValidatorsById: builder.query<
      ValidatorType,
      { key: string; wallet: string; subnet_id?: number }
    >({
      query: ({ key, wallet, subnet_id = 0 }) => {
        let url = `/validators/${key}?subnet_id=${subnet_id}`
        if (wallet && wallet !== undefined) {
          url += `&wallet=${wallet}`
        }
        return url
      },
      providesTags: (_, __, { key }) => [{ type: "SingleValidator", id: key }],
      transformResponse: (response: ValidatorType) => {
        const validatedResponse: ValidatorType = {
          ...response,
          isVerified:
            response.expire_at === -1 ||
            (response.expire_at || 0) > Date.now() / 1000,
        }
        console.log(validatedResponse)
        validatedResponse.stake_from = validatedResponse?.stake_from?.sort(
          (a, b) => b[1] - a[1],
        )
        return validatedResponse
      },
    }),
    getSubnets: builder.query<SubnetInterface[], void>({
      query: () => "/subnets/",
      providesTags: ["SubnetsList"],
      transformResponse: (
        response: InterfacePaginationSubnet<SubnetInterface[]>,
      ) => {
        return response.subnets
      },
    }),
    getRichList: builder.query<RichListType[], void>({
      query: () => "/holders/?limit=100",
      providesTags: ["RichList"],
      transformResponse: (response: InterfacePaginatedUsers<RichListType[]>) => {
        return response.holders.map((holder, index) => ({
          ...holder,
          rank: index + 1,
        }))
      },
    }),
    getSubnetById: builder.query<ValidatorType[], string>({
      query: (id) => `/validators/?subnet_id=${id}`,
      providesTags: (_, __, id) => [{ type: "SingleSubnet", id: id }],
      transformResponse: (response: InterfacePagination<ValidatorType[]>) => {
        const validatedResponse: ValidatorType[] = response.validators.map(
          (validator) => {
            validator.isVerified =
              validator.expire_at === -1 ||
              (validator.expire_at || 0) > Date.now() / 1000
            return validator
          },
        )
        return validatedResponse.toSorted((a, b) =>
          a.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR ? -1 : 1,
        )
      },
    }),
    getTotalStats: builder.query<IStats, void>({
      query: () => "/stats/",
      providesTags: ["CommuneStats"],
      transformResponse: (response: { stats: IStats }) => {
        return response.stats
      },
    }),
    getBalance: builder.query<IBalanceType, { wallet: string }>({
      query: ({ wallet }) => `/balance/?wallet=${wallet}`,
      providesTags: ["SingleValidator"],
      transformResponse: (response: IBalanceType) => {
        return response
      },
    }),
    searchBalance: builder.mutation<IBalanceType, { wallet: string }>({
      query: ({ wallet }) => `/balance/?wallet=${wallet}`,
      transformResponse: (response: IBalanceType) => {
        return response
      },
    }),
  }),
})

export const {
  useGetValidatorsQuery,
  useGetAllValidatorsQuery,
  useGetBalanceQuery,
  useGetTotalStatsQuery,
  useSearchBalanceMutation,
  useGetValidatorsByIdQuery,
  useGetRichListQuery,
} = statsApi
