import { create } from "zustand";

type NewResources = {
  memory: string | undefined;
  cpu: string | undefined;
};

type State = {
  showRestartPopup: boolean;
  restartStatus: "confirm" | "loading" | "error" | "success";
  showPodLog: boolean;
  showContainerSelect: boolean;
  podLog: string;
  showReplicasPopup: boolean;
  newReplicas: number;
  showRequestsLimitsPopup: boolean;
  newRequests: NewResources;
  newLimits: NewResources;
  selectedOption: string;
  selectedValue: string;
};

type Action = {
  setShowRestartPopup: (showRestartPopup: State["showRestartPopup"]) => void;
  setRestartStatus: (restartStatus: State["restartStatus"]) => void;
  setShowPodLog: (showPodLog: State["showPodLog"]) => void;
  setShowContainerSelect: (
    showContainerSelect: State["showContainerSelect"],
  ) => void;
  setPodLog: (podLog: State["podLog"]) => void;
  setShowReplicasPopup: (showReplicasPopup: State["showReplicasPopup"]) => void;
  setNewReplicas: (newReplicas: State["newReplicas"]) => void;
  setShowRequestsLimitsPopup: (
    showRequestsLimitsPopup: State["showRequestsLimitsPopup"],
  ) => void;
  setNewRequests: (newRequests: State["newRequests"]) => void;
  setNewLimits: (newLimits: State["newLimits"]) => void;
  setSelectedOption: (selectedOption: State["selectedOption"]) => void;
  setSelectedValue: (selectedValue: State["selectedValue"]) => void;
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

  showReplicasPopup: false,
  setShowReplicasPopup: (showReplicasPopup) => set({ showReplicasPopup }),

  newReplicas: 1,
  setNewReplicas: (newReplicas) => set({ newReplicas }),

  showRequestsLimitsPopup: false,
  setShowRequestsLimitsPopup: (showRequestsLimitsPopup) =>
    set({ showRequestsLimitsPopup }),

  newRequests: {
    memory: "",
    cpu: "",
  },
  setNewRequests: (newRequests) =>
    set((state) => ({
      newRequests: {
        ...state.newRequests,
        memory: newRequests.memory,
        cpu: newRequests.cpu,
      },
    })),

  newLimits: {
    memory: "",
    cpu: "",
  },
  setNewLimits: (newLimits) =>
    set((state) => ({
      newLimits: {
        ...state.newLimits,
        memory: newLimits.memory,
        cpu: newLimits.cpu,
      },
    })),

  selectedOption: "",
  setSelectedOption: (selectedOption) => set({ selectedOption }),

  selectedValue: "",
  setSelectedValue: (selectedValue) => set({ selectedValue }),
}));

export default podStore;
