<template>
  <div>
    <h1>Hello I am Home</h1>
    <p>{{ email }}</p>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";

const store = useUserStore();
const { email } = storeToRefs(store);
const { setEmail, setAuth } = store;

const { axiosInstance } = useApi();

const res = await axiosInstance
  .post("graphql", {
    query: `
    query {
      hello
    }`,
  })
  .then((res) => res?.data)
  .catch((err) => {
    return err;
  });

if (res?.data?.hello) {
  // email.value = res?.data?.hello ?? "hello";
  setAuth(true);
  setEmail(res?.data?.hello ?? null);
} else {
  setAuth(false);
  navigateTo({
    path: "/login",
  });
}
</script>
