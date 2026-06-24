import { create } from "zustand";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  token: string | null;

  login: (
    user: User,
    token: string
  ) => void;

  logout: () => void;
};

const useAuthStore = create<AuthStore>(
  (set) => ({
    user: null,
    token: null,

    login: (user, token) => {
      localStorage.setItem(
        "token",
        token
      );

      set({
        user,
        token,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "token"
      );

      set({
        user: null,
        token: null,
      });
    },
  })
);

export default useAuthStore;