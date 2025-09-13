// src/redux/api/bookingApi.ts
import { baseApi } from "../baseApi";

export interface BookingFromSubscriptionPayload {
  userId: string;
  rentPackId: string;     
  subscriptionPurchaseId?: string; 
  bookingDate: string;        
  bookingTime?: string;       
  drivingLicense?: string;
  adventurePackId?: string
  sessionUrl?: string
}

export interface BookingFromSubscriptionResponse {
  success: boolean;
  message: string;
  sessionUrl: string;
  bookingDone: {
    _id: string;
    userId: string;
    jetSkyId: string;
    model: string;
    subscriptionPurchaseId: string;
    bookingDate: string; // ISO date
    bookingTime: string;
    status: string;
    price: number;
    email: string;
    name: string;
    totalPrice: number;
    paymentStatus: "paid" | "pending";
    createdAt: string;
  };
}

export const bookedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bookWithSubscription: builder.mutation<
      BookingFromSubscriptionResponse,
      BookingFromSubscriptionPayload
    >({
      query: (body) => ({
        url: "/payment/create-pakage", // ⚠️ Likely typo in backend? Should be `/create-package`
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "AvailableDate"],
    }),
  }),
});

export const { useBookWithSubscriptionMutation } = bookedApi;