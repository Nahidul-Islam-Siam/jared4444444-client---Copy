// redux/api/package/packageApi.ts
import { baseApi } from "../baseApi";

/* --- Request Payload --- */
export interface CreatePackageRequestBody {
  userId: string;
  adventurePackId: string;
  bookingDate: string; // "YYYY-MM-DD"
  model: string;
  ridesNumber: number;
  price: number;
  drivingLicense?: string; // optional
  refundableDeposit: number;
}

/* --- Response Structure --- */
export interface CreatePackageResponse {
  success: boolean;
  message: string;
  sessionUrl: string; // Stripe checkout URL
}

/* --- RTK API Definition --- */
export const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Creates a payment session for purchasing an Adventure Pack
     */
    createPackage: builder.mutation<CreatePackageResponse, CreatePackageRequestBody>({
      query: (body) => ({
        url: "/payment/create-package", // 🔉 Fixed typo: was "create-pakage"
        method: "POST",
        body,
      }),
    }),
  }),
});

/* --- Export Hook --- */
export const { useCreatePackageMutation } = packageApi;