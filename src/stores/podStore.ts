import { create } from "zustand";

type NewResources = {
  memory: string | undefined;
  cpu: string | undefined;
};

type State = {
  // PodRestart
  showRestartPopup: boolean;
  restartStatus: "confirm" | "loading" | "error" | "success";
  // PodLogDisplay
  showPodLog: boolean;
  showContainerSelect: boolean;
  podLog: string;
  // PodReplicas
  showReplicasPopup: boolean;
  newReplicas: number;
  // PodAdjustRequestsLimits
  showRequestsLimitsPopup: boolean;
  newRequests: NewResources;
  newLimits: NewResources;
  selectedOption: string;
  // PodSelector
  selectedValue: string;
  // PodSorter
  selectedLabel: string;
  // QueryTimeWindowConfiguration
  showTimeWindow: boolean;
  timeInput: string;
  timeUnit: string;
};

type Action = {
  // PodRestart
  setShowRestartPopup: (showRestartPopup: State["showRestartPopup"]) => void;
  setRestartStatus: (restartStatus: State["restartStatus"]) => void;
  // PodLogDisplay
  setShowPodLog: (showPodLog: State["showPodLog"]) => void;
  setShowContainerSelect: (
    showContainerSelect: State["showContainerSelect"],
  ) => void;
  setPodLog: (podLog: State["podLog"]) => void;
  // PodReplicas
  setShowReplicasPopup: (showReplicasPopup: State["showReplicasPopup"]) => void;
  setNewReplicas: (newReplicas: State["newReplicas"]) => void;
  // PodAdjustRequestsLimits
  setShowRequestsLimitsPopup: (
    showRequestsLimitsPopup: State["showRequestsLimitsPopup"],
  ) => void;
  setNewRequests: (newRequests: State["newRequests"]) => void;
  setNewLimits: (newLimits: State["newLimits"]) => void;
  setSelectedOption: (selectedOption: State["selectedOption"]) => void;
  // PodSelector
  setSelectedValue: (selectedValue: State["selectedValue"]) => void;
  // PodSorter
  setSelectedLabel: (selectedLabel: State["selectedLabel"]) => void;
  // QueryTimeWindowConfiguration
  setShowTimeWindow: (showTimeWindow: State["showTimeWindow"]) => void;
  setTimeInput: (timeInput: State["timeInput"]) => void;
  setTimeUnit: (timeUnit: State["timeUnit"]) => void;
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

  selectedLabel: "Sort by...",
  setSelectedLabel: (selectedLabel) => set({ selectedLabel }),

  showTimeWindow: false,
  setShowTimeWindow: (showTimeWindow) => set({ showTimeWindow }),

  timeInput: "1",
  setTimeInput: (timeInput) => set({ timeInput }),

  timeUnit: "m",
  setTimeUnit: (timeUnit) => set({ timeUnit }),
}));

export default podStore;
