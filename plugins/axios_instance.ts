import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  // some how this are not refetcing the latest cookies for that reason if i remove all the cookies it's refreshing using the old one

  const accessToken = useCookie("access_token");
  const refreshToken = useCookie("refresh_token");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${accessToken.value}`;
    return config;
  });

  axiosInstance.interceptors.response.use(
    (config) => {
      return config;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("I am refreshing");
        try {
          const refreshResponse = await axios.post(
            "http://localhost:3000/graphql",
            {
              query: `
                  query {
                    refreshToken {
                      accessToken
                      refreshToken
                    }
                  }
            `,
            },
            {
              headers: {
                Authorization: `Bearer ${refreshToken.value}`,
              },
            }
          );

          if (
            refreshResponse?.data?.data?.refreshToken?.accessToken &&
            refreshResponse?.data?.data?.refreshToken?.refreshToken
          ) {
            accessToken.value =
              refreshResponse.data.data.refreshToken.accessToken;
            refreshToken.value =
              refreshResponse.data.data.refreshToken.refreshToken;
            originalRequest.headers.Authorization = `Bearer ${refreshResponse?.data?.data?.refreshToken?.accessToken}`;
          }

          console.log(
            originalRequest.headers.Authorization.split(" ")[1] ==
              accessToken.value
          );

          return axiosInstance.request(originalRequest);
        } catch (error) {
          return error;
        }
      }

      return new Error("Please login again");
    }
  );

  return {
    provide: {
      axiosInstance,
    },
  };
});
