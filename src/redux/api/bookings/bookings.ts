import baseApi from "../baseApi";
import { TApiResponse, TBooking } from "@/type/type"; // adjust paths

export const bookings = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get all bookings
    getAllBookings: builder.query<
      TApiResponse<TBooking[]>, // API response type
      {
        page?: number;
        limit?: number;
        searchTerm?: string | number;
        sort?: string;
      }
    >({
      query: ({ page, limit, searchTerm = "", sort } = {}) => ({
        url: "/booking/get",
        params: { page, limit, searchTerm, sort },
      }),
      providesTags: ["Booking"],
    }),

    // get booking by ID
    getBookingById: builder.query({
      query: (bookingId) => ({
        url: `/booking/get/all/${bookingId}`,
      }),
      providesTags: ["Booking"],
    }),
    // get bookingForUsers
    getBookingForUser: builder.query<TBooking[], void>({
      query: () => ({
        url: "/booking/get/token", // your API endpoint
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    // delete booking
    deleteBookings: builder.mutation({
      query: (bookingId: string) => ({
        url: `/booking/delete/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery, // <-- export hook
  useDeleteBookingsMutation,
  useGetBookingForUserQuery
} = bookings;
