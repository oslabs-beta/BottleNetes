import { create } from "zustand";

type State = {
  showRestartPopup: boolean;
  restartStatus: "confirm" | "loading" | "error" | "success";
  showPodLog: boolean;
  showContainerSelect: boolean;
  podLog: string;
};

type Action = {
  setShowRestartPopup: (showRestartPopup: State["showRestartPopup"]) => void;
  setRestartStatus: (restartStatus: State["restartStatus"]) => void;
  setShowPodLog: (showPodLog: State["showPodLog"]) => void;
  setShowContainerSelect: (showContainerSelect: State["showContainerSelect"]) => void;
  setPodLog: (podLog: State["podLog"]) => void;
};

const podStore = create<State & Action>((set) => ({
  showRestartPopup: false,
  setShowRestartPopup: (showRestartPopup) => set({ showRestartPopup }),

  restartStatus: "confirm",
  setRestartStatus: (restartStatus) => set({ restartStatus }),

  showPodLog: false,
  setShowPodLog: (showPodLog) => set({ showPodLog }),

  showContainerSelect: false,
  setShowContainerSelect: (showContainerSelect) => set({ showContainerSelect }),

  podLog: "No logs available",
  setPodLog: (podLog) => set({ podLog }),
}));

export default podStore;