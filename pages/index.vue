<template>
  <div>
    <h1>Hello I am Home</h1>
    <p>{{ email }}</p>
  </div>
</template>

<script setup lang="ts">

const email = ref<string>();

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
  email.value = res?.data?.hello ?? "hello";
} else {
  navigateTo({
    path: "/login",
  });
}
</script>
