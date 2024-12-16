import { create } from 'zustand';

const useStore = create((set) => ({
  isSignedIn: false,
  loading: true,
  signIn: () => set({ isSignedIn: true }),
  signOut: () => set({ isSignedIn: false }),
  setLoading: (status) => set({ loading: status }),
}));

export default useStore;