/**
 * Store using zustand to centralize all user states
 * These states are used in:
 * - App
 * - SigninContainer
 * - SignupContainer
 */

import { create } from "zustand";

type State = {
  signedIn: boolean;
  loading: boolean;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
};

type Action = {
  setSignedIn: (boolean: State['signedIn']) => void,
  setLoading: (boolean: State['loading']) => void,
  setUsername: (username: State['username']) => void,
  setPassword: (password: State['password']) => void,
  setEmail: (email: State['email']) => void,
  setFirstName: (firstName: State['firstName']) => void,
  setLastName: (lastName: State['lastName']) => void,
};

const userStore = create<State & Action>()((set) => ({
  signedIn: false,
  setSignedIn: (boolean) => set({ signedIn: boolean }),

  loading: true,
  setLoading: (boolean) => set({ loading: boolean }),

  username: "",
  setUsername: (username) => set({ username }),

  password: "",
  setPassword: (password) => set({ password }),

  email: "",
  setEmail: (email) => set({ email }),

  firstName: "",
  setFirstName: (firstName) => set({ firstName }),

  lastName: "",
  setLastName: (lastName) => set({ lastName }),
}));

export default userStore;
