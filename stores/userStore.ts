import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const email = ref<string | null>();
  const isAuth = ref<boolean>(false);

  const setEmail = (emailArg: string | null) => {
    email.value = emailArg;
  };

  const setAuth = (isAuthArg: boolean) => {
    isAuth.value = isAuthArg;
  };

  return { email, isAuth, setEmail, setAuth };
});
