/**
 * Store using zustand to centralize all states
 */

import { create } from 'zustand';

const useStore = create((set) => ({
  isSignedIn: false,
  loading: true,
  username: '',
  firstName: '',
  lastName: '',
  signIn: () => set({ isSignedIn: true }),
  signOut: () => set({ isSignedIn: false }),
  setLoading: (status) => set({ loading: status }),
  setUsername: (name) => set({ username: name }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
}));

export default useStore;