<template>
  <div>
    <ul>
      <li>
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li v-if="isAuth">
        <NuxtLink to="/about">About</NuxtLink>
      </li>
      <li v-if="!isAuth">
        <NuxtLink to="/signup">Signup</NuxtLink>
      </li>
      <li v-if="!isAuth">
        <NuxtLink to="/login">Login</NuxtLink>
      </li>
      <li v-if="isAuth" @click="logout">Logout</li>
    </ul>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";

const store = useUserStore();
const { isAuth } = storeToRefs(store);
const { setAuth } = store;

const access_token = useCookie("access_token", {
  maxAge: 60,
  watch: "shallow",
});
const refresh_token = useCookie("refresh_token", {
  maxAge: 86400,
  watch: "shallow",
});

if (access_token.value && refresh_token.value) {
  setAuth(true);
} else {
  setAuth(false);
}

const logout = async () => {
  const isLoggedOut = await useLogout();

  if (isLoggedOut) {
    setAuth(false);
    navigateTo({
      path: "/login",
    });
  }
};
</script>
