import { create } from "zustand";

type State = {
  showRestartPopup: boolean;
  restartStatus: "confirm" | "loading" | "error" | "success";
};

type Action = {
  setShowRestartPopup: (showRestartPopup: State["showRestartPopup"]) => void;
  setRestartStatus: (restartStatus: State["restartStatus"]) => void;
};

const podStore = create<State & Action>((set) => ({
  showRestartPopup: false,
  setShowRestartPopup: (showRestartPopup) => set({ showRestartPopup }),

  restartStatus: "confirm",
  setRestartStatus: (restartStatus) => set({ restartStatus }),
}));

export default podStore;