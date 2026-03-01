import baseApi from "@/redux/api/baseApi";

export const becomeAsellerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
       ApplySeller: builder.mutation({
            query: ({ data, image }) => {
                const formData = new FormData();
                
                // Append JSON data as a string field
                formData.append('data', JSON.stringify(data));

                // Append all images
                if (Array.isArray(image) && image.length > 0) {
                    image.forEach((file: File) => {
                        formData.append('image', file, file.name);
                    });
                }

                return {
                    url: '/became-a-seller/create',
                    method: 'POST',
                    body: formData,
                    // Don't set Content-Type - let browser set it with boundary
                };
            },
            invalidatesTags: ['User'],
       })
    }),
});

export const {
    useApplySellerMutation,
} = becomeAsellerApi;