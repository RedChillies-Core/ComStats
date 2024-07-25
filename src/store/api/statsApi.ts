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
  ValidatorExtendedType,
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
      ValidatorExtendedType,
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
      transformResponse: (response: ValidatorExtendedType) => {
        const validatedResponse: ValidatorExtendedType = {
          ...response,
          subnet_data: response.subnet_data.sort(
            (a, b) => a.subnet_id - b.subnet_id
          ),
        }
        console.log(validatedResponse)
        validatedResponse.stake_from = validatedResponse?.stake_from?.sort(
          (a, b) => b[1] - a[1]
        )
        return validatedResponse
      },
    }),
    getSubnets: builder.query<SubnetInterface[], void>({
      query: () => "/subnets/",
      providesTags: ["SubnetsList"],
      transformResponse: (
        response: InterfacePaginationSubnet<SubnetInterface[]>
      ) => {
        return response.subnets
      },
    }),
    getRichList: builder.query<RichListType[], void>({
      query: () => "/holders/?limit=100",
      providesTags: ["RichList"],
      transformResponse: (
        response: InterfacePaginatedUsers<RichListType[]>
      ) => {
        return response.holders.map((holder, index) => ({
          ...holder,
          rank: index + 1,
        }))
      },
    }),
    getSubnetById: builder.query<
      InterfacePagination<ValidatorType[]>,
      {
        subnetId: number | string
        page?: number
      }
    >({
      query: ({ subnetId, page = 1 }) =>
        `/validators/?subnet_id=${subnetId}&page=${page}&limit=${
          subnetId.toString() === "0" ? 15 : 50
        }`,
      providesTags: (_, __, { subnetId }) => [
        { type: "SingleValidator", id: subnetId },
      ],
      transformResponse: (response: InterfacePagination<ValidatorType[]>) => {
        return response
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
