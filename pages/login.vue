<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label for="email">Email</label>
      <input v-model="loginInputs.email" type="email" id="email" /><br />
      <br />
      <label for="password">Password</label>
      <input
        v-model="loginInputs.password"
        type="password"
        id="password"
      /><br />
      <br />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";
const store = useUserStore();
const { setAuth } = store;
import axios from "axios";
const access_token = useCookie("access_token").value;
const refresh_token = useCookie("refresh_token").value;

if (access_token && refresh_token) {
  setAuth(true);
  navigateTo({
    path: "/",
  });
} else {
  setAuth(false);
}

const loginInputs = reactive<{ email: string | null; password: string | null }>(
  {
    email: null,
    password: null,
  }
);

const login = async () => {
  const response = await axios.post(
    "http://localhost:3000/graphql",
    {
      query: `
            query($loginUserInput: LoginUserInput!){
                loginUser(loginUserInput: $loginUserInput) {
                    accessToken
                    refreshToken
                    message
                    userDetails {
                        _id
                        email
                    }
                }
            }
        `,
      variables: {
        loginUserInput: {
          email: loginInputs.email,
          password: loginInputs.password,
        },
      },
    },
    {
      withCredentials: true,
    }
  );

  if (response?.data?.data?.loginUser) {
    console.log(response?.data?.data?.loginUser);
    setAuth(true);
    navigateTo({
      path: "/",
    });
  }
};
</script>
