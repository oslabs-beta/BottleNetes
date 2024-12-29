/**
 * Store using zustand to centralize all states
 */

import { create } from 'zustand';

const useStore = create((set) => ({
  isSignedIn: false,
  signIn: () => set({ isSignedIn: true }),
  signOut: () => set({ isSignedIn: false }),
  loading: true,
  setLoading: (status) => set({ loading: status }),
  username: '',
  setUsername: (name) => set({ username: name }),
  password: '',
  setPassword: (password) => set({ password }),
  email: '',
  setEmail: (email) => set({ email }),
  firstName: '',
  setFirstName: (firstName) => set({ firstName }),
  lastName: '',
  setLastName: (lastName) => set({ lastName }),
  backendUrl: 'http://localhost:3000/',
}));

export default useStore;