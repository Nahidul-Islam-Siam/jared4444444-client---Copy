// src/redux/api/availableDateApi.ts

import { baseApi } from "../baseApi";

// 👇 Response interface matching your API
export interface AvailableDateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  Data: {
    model: string;
    availableDates: string[]; // e.g., "2025-09-01"
    bookedDates: string[];   // already booked dates
  };
}

// Request type for query
export interface GetAvailableDatesArgs {
  model: string;
}

// Enhanced API slice
export const availableDateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAvailableDates: builder.query<AvailableDateResponse, GetAvailableDatesArgs>({
      query: ({ model }) => ({
        url: "rent/availableCheckSpesific", // 👉 No query string here
        method: "GET",
        params: { model }, // ✅ Automatically adds ?model=...
      }),
      providesTags: ["AvailableDate"],
    }),

    // Optional: Mutation to add available dates
    // addAvailableDates: builder.mutation<void, { dates: string[] }>({
    //   query: (body) => ({
    //     url: "rent/addAvailableDates",
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["AvailableDate"],
    // }),
  }),
});

// Export hook
export const { useGetAllAvailableDatesQuery } = availableDateApi;