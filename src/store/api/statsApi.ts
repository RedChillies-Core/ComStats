import { createApi } from "@reduxjs/toolkit/query/react"
import apiWrapper from "@/store/api/wrapper/apiWrapper"
import {
  IBalanceType,
  IStats,
  InterfacePagination,
  ValidatorType,
} from "@/types"

export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: apiWrapper,
  tagTypes: ["ValidatorsList", "CommuneStats", "SingleValidator"],
  endpoints: (builder) => ({
    getValidators: builder.query<InterfacePagination<ValidatorType[]>, void>({
      query: () => "/validators/",
      providesTags: ["ValidatorsList"],
      transformResponse: (response: InterfacePagination<ValidatorType[]>) => {
        return response
      },
    }),
    getValidatorsById: builder.query<
      ValidatorType,
      { key: string; wallet: string }
    >({
      query: ({ key, wallet }) => `/validators/${key}?wallet=${wallet}`,
      providesTags: ["SingleValidator"],
      transformResponse: (response: ValidatorType) => {
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
  useGetBalanceQuery,
  useGetTotalStatsQuery,
  useSearchBalanceMutation,
  useGetValidatorsByIdQuery,
} = statsApi
