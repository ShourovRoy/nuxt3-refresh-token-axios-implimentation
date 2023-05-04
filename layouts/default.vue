<template>
  <div>
    <ul>
      <li>
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/signup">Signup</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/login">Login</NuxtLink>
      </li>
      <li @click="logout">Logout</li>
    </ul>
    <slot />
  </div>
</template>

<script setup lang="ts">
const logout = async () => {
  const isLoggedOut = await useLogout();

  if (isLoggedOut) {
    navigateTo({
      path: "/login",
    });
  }
};
</script>
