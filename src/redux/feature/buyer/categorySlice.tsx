import baseApi from "@/redux/api/baseApi";


export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: ({limit}) => ({
                url: `/category/get-category?limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Category"],
        }),
        // /sub-category/get-sub-category
        getSubCategories: builder.query({
            query: () => ({
                url: "/sub-category/get-sub-category",
                method: "GET",
            }),
            providesTags: ["Category"],
        }),



    }),
});

export const {
    useGetCategoriesQuery,
    useGetSubCategoriesQuery,
} = categoryApi;