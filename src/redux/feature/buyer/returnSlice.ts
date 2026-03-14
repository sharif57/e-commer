
import baseApi from "@/redux/api/baseApi";
import { ReturnApiPayload } from "@/lib/returnRequest";

interface ReturnApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
}

export const returnProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReturnProduct: builder.mutation<ReturnApiResponse, ReturnApiPayload>({
      query: (returnProductData) => ({
        url: `/return-product/create-return-product`,
        method: "POST",
        body: returnProductData,
      }),
      invalidatesTags: ["ReturnProduct"],
    }),
  }),
});

export const { useCreateReturnProductMutation } = returnProductApi;