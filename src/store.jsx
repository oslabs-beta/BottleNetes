import { create } from 'zustand';

const useStore = create((set) => ({
  isSignedIn: false,
  loading: true,
  username: '',
  signIn: () => set({ isSignedIn: true }),
  signOut: () => set({ isSignedIn: false }),
  setLoading: (status) => set({ loading: status }),
  setUsername: (name) => set({ username: name }),
}));

export default useStore;