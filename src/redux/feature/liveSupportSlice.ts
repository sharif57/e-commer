import baseApi from "@/redux/api/baseApi";

export const liveSupportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAdmins: builder.query({
            query: (page) => ({
                url: `/admin/get-all-admins?page=${page}`,
                method: "GET",
            }),
            providesTags: ["User"],
        }),

    }),
});

export const {
    useGetAllAdminsQuery,
} = liveSupportApi;