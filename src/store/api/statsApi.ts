import { createApi } from "@reduxjs/toolkit/query/react"
import apiWrapper from "@/store/api/wrapper/apiWrapper"
import { InterfacePagination, ValidatorType } from "@/types"

export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: apiWrapper,
  tagTypes: ["ValidatorsList"],
  endpoints: (builder) => ({
    getValidators: builder.query<InterfacePagination<ValidatorType[]>, void>({
      query: () => "/validators/",
      providesTags: ["ValidatorsList"],
      transformResponse: (response: InterfacePagination<ValidatorType[]>) => {
        return response
      },
    }),
  }),
})

export const { useGetValidatorsQuery } = statsApi
