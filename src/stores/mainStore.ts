import { create } from "zustand";

type ClickedPod = {
  podName: string;
  namespace: string;
  containers: [];
  deployment: string;
  [key: string]: any;
};

export type State = {
  defaultView: boolean;
  queryTimeWindow: string;
  clickedPod: ClickedPod;
  selectedMetric: "cpu" | "memory" | "latency";
  podRestartCount: number;
  manualRefreshCount: number;
  refreshFrequency: number;
  showRefreshPopup: boolean;
  refreshInput: string;
  isMenuOpen: boolean;
  aiVisibility: boolean;
};

type Action = {
  setDefaultView: (boolean: State["defaultView"]) => void;
  setQueryTimeWindow: (queryTimeWindow: State["queryTimeWindow"]) => void;
  setClickedPod: (clickedPod: State["clickedPod"]) => void;
  setSelectedMetric: (selectedMetric: State["selectedMetric"]) => void;
  setPodRestartCount: (podRestartCount: State["podRestartCount"]) => void;
  setManualRefreshCount: (
    manualRefreshCount: State["manualRefreshCount"],
  ) => void;
  setRefreshFrequency: (refreshFrequency: State["refreshFrequency"]) => void;
  setShowRefreshPopup: (boolean: State["showRefreshPopup"]) => void;
  setRefreshInput: (refreshInput: State["refreshInput"]) => void;
  setIsMenuOpen: (boolean: State["isMenuOpen"]) => void;
  setAiVisibility: (boolean: State["aiVisibility"]) => void;
};

const mainStore = create<State & Action>()((set) => ({
  defaultView: true,
  setDefaultView: (boolean) => set({ defaultView: boolean }),

  queryTimeWindow: "1m",
  setQueryTimeWindow: (queryTimeWindow) => set({ queryTimeWindow }),

  clickedPod: {
    podName: "",
    namespace: "",
    containers: [],
    deployment: "",
  },
  setClickedPod: (clickedPod) =>
    set((state) => ({
      clickedPod: {
        ...state.clickedPod,
        podName: clickedPod.podName,
        namespace: clickedPod.namespace,
        containers: clickedPod.containers,
        deployment: clickedPod.deployment,
      },
    })),

  selectedMetric: "cpu",
  setSelectedMetric: (selectedMetric) => set({ selectedMetric }),

  podRestartCount: 0,
  setPodRestartCount: (podRestartCount) => set({ podRestartCount }),

  manualRefreshCount: 0,
  setManualRefreshCount: (manualRefreshCount) => set({ manualRefreshCount }),

  refreshFrequency: 30000,
  setRefreshFrequency: (refreshFrequency) => set({ refreshFrequency }),

  showRefreshPopup: false,
  setShowRefreshPopup: (showRefreshPopup) => set({ showRefreshPopup }),

  refreshInput: "",
  setRefreshInput: (refreshInput) => set({ refreshInput }),

  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),

  aiVisibility: false,
  setAiVisibility: (aiVisibility) => set({ aiVisibility }),
}));

export default mainStore;
