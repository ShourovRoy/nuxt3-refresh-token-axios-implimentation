<template>
  <div>
    <h1>signup</h1>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";
const store = useUserStore();
const { setAuth } = store;

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
</script>
