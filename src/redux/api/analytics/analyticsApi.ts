import { baseApi } from "../baseApi";

export interface RegisteredUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  purchesCredits: number;
  adventurePurchaseId: string[];
  subscriptionPurchaseId: string[];
  remainingCredits: number;
  images: string[];
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  firstName?: string;
  lastName?: string;
  country?: string;
  introduction?: string;
  drivingLicense?: string;
}

export interface ModelData {
  model: string;
  price: number;
}

export interface AnalyticsData {
  totalAdventuresPurchase: number;
  totalAmountInAdVenturePackUSD: number;
  totalSubscriptionPurchase: number;
  totalAmountInSubscriptionUSD: number;
  registeredUsersCount: number;
  registeredUsers: RegisteredUser[];
  totalBooking: number;
  totalAmountInBookingUSD: number;
  totalRents: number;
  modelData: ModelData[];
}

export interface AnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  Data: AnalyticsData[];
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => "/booking/purchase/adventurePack/total",
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
