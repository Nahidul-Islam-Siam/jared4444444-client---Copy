import baseApi from "../baseApi";

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckoutSession: builder.query({
      query: ({ session_id }) => ({
        url: `/stripe/checkout-session?session_id=${session_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCheckoutSessionQuery } = stripeApi;
