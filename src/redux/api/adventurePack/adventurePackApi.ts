/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/api/adventurePack/adventurePackApi.ts

import { baseApi } from "../baseApi";

/* -------------------- Types -------------------- */
export interface JetSky {
  _id: string;
  name: string;
  model: string;
  hp: number;
  price: number;
   images: string[];   
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface TAdventurePack {
  _id: string;
  jet_skyId: JetSky;
  title: string;
  images: string[];
  discountPercentage: number;
  ridesPricing3: number;
  ridesPricing5: number;
  ridesPricing10: number;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
  data?: any;
}

export type TSingleAdventurePack = {
  success: boolean;
  statusCode: number;
  message: string;
  Data: TAdventurePack; // <-- lowercase!
};

export type TAdventurePackPayload = Partial<
  Pick<
    TAdventurePack,
    | "jet_skyId"
    | "title"
    | "discountPercentage"
    | "ridesPricing3"
    | "ridesPricing5"
    | "ridesPricing10"
    | "refundAmount"
  >
>;

type TListParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export const adventurePackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdventurePack: builder.mutation<TAdventurePack, TAdventurePackPayload>({
      query: (body) => ({
        url: "/adventurePack/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdventurePack"],
    }),

    getAllAdventurePacks: builder.query<TAdventurePack[], TListParams>({
      query: (args = {}) => {
        const { page, limit, searchTerm } = args;
        return {
          url: "/adventurePack/get",
          params: { page, limit, searchTerm },
        };
      },
      transformResponse: (res: { Data: TAdventurePack[] }) => res.Data,
      providesTags: ["AdventurePack"],
    }),

    getAdventurePackById: builder.query<TSingleAdventurePack, string>({
      query: (id) => ({
        url: `/adventurePack/get/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "AdventurePack", id }],
    }),

    updateAdventurePack: builder.mutation<TAdventurePack, { id: string; body: TAdventurePackPayload }>({
      query: ({ id, body }) => ({
        url: `/adventurePack/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "AdventurePack", id }],
    }),

    deleteAdventurePack: builder.mutation<{ _id: string }, string>({
      query: (id) => ({
        url: `/adventurePack/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "AdventurePack", id }],
    }),
  }),
  overrideExisting: false,
});

/* --------------- Hooks --------------- */
export const {
  useCreateAdventurePackMutation,
  useGetAllAdventurePacksQuery,
  useGetAdventurePackByIdQuery,
  useUpdateAdventurePackMutation,
  useDeleteAdventurePackMutation,
} = adventurePackApi;