import axios from "axios";

export const useApi = () => {
  const accessToken = useCookie("access_token", {
    maxAge: 60,
  });
  const refreshToken = useCookie("refresh_token", {
    maxAge: 86400,
  });

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
        console.log("Refresh token", refreshToken.value);
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

          return axiosInstance.request(originalRequest);
        } catch (error) {
          return error;
        }
      }

      // return new Error("Please login again");
      // accessToken.value = null;
      // refreshToken.value = null;
      return Promise.reject(error);
    }
  );

  return { axiosInstance };
};

export const useLogout = async () => {
  try {
    useCookie("access_token", {
      maxAge: 60,
    }).value = null;
    useCookie("refresh_token", {
      maxAge: 86400,
    }).value = null;

    // window.location.href = "/login";
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
