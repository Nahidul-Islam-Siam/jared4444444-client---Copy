// redux/api/subscription/subscriptionApi.ts
import { baseApi } from "../baseApi";

/* -------------------- Types -------------------- */

export interface MembershipPlan {
  _id: string;
  durationInMonths: number;
  ridesPerMonth: number;
  weekCount: number;
  refundableDeposit: number;
  signUpFee: number;
  price: number;
  planId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserShort {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  drivingLicense: string;
  purchesCredits: number;
  adventurePurchaseId: string[];
  subscriptionPurchaseId: string[];
  remainingCredits: number;
  images: string[];
  role: string;
  createdAt: string;
  updatedAt: string;
  country?: string;
  __v: number;
}

export interface SubscriptionPurchase {
  _id: string;
  stripeSubscriptionId: string;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "canceled";
  type: "recurring";
  membershipId?: MembershipPlan;
  userId: UserShort;
  purchesCredits: number;
  remainingCredits: number;
  signUpFee: number;
  signUpFeePaid: boolean;
  refundableDepositPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TGeSubscriptionPurchasesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  Data: SubscriptionPurchase[];
}

/* -------------------- API Slice -------------------- */
export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Subscribe (create new)
    subscribe: builder.mutation<
      { Data: { url_Link: string }[] },
      { memberShipPlanId: string; signUpFee: number; refundableDeposit: number }
    >({
      query: (body) => ({
        url: "/subscribe",
        method: "POST",
        body,
      }),
    }),

    // ✅ Get All Subscription Purchases
    getAllSubscriptionPurchases: builder.query<TGeSubscriptionPurchasesResponse, void>({
      query: () => ({
        url: "/subscription/get", // 🔥 Fixed endpoint (was wrong before)
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
  }),
  overrideExisting: false,
});

// Export Hooks
export const { useSubscribeMutation, useGetAllSubscriptionPurchasesQuery } =
  subscriptionApi;