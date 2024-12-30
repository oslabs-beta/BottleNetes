import { create } from "zustand";

// Type for allData Obj. Index Signature is included to possibly add more props later
type allData = {
  podsStatuses: Record<string, unknown> | [];
  requestLimits: Record<string, unknown> | [];
  allNodes: Record<string, unknown> | [];
  cpuUsageOneValue: Record<string, unknown> | [];
  memoryUsageOneValue: Record<string, unknown> | [];
  cpuUsageHistorical: Record<string, unknown> | any[] | null;
  memoryUsageHistorical: Record<string, unknown> | any[] | null;
  latencyAppRequestOneValue: Record<string, unknown> | [];
  latencyAppRequestHistorical: Record<string, unknown> | any[] | null;
  [key: string]: Record<string, unknown> | any[] | null;
};

type State = {
  isFetchingData: boolean;
  allData: allData;
  backendUrl: "http://localhost:3000/";
};

type Action = {
  setIsFetchingData: (boolean: State["isFetchingData"]) => void;
  setAllData: (allData: State["allData"]) => void;
};

const dataStore = create<State & Action>()((set) => ({
  isFetchingData: true,
  setIsFetchingData: (boolean) => set({ isFetchingData: boolean }),

  allData: {
    podsStatuses: { podsStatuses: [] },
    requestLimits: { allPodsRequestLimit: [] },
    allNodes: { allNodes: [] },
    cpuUsageOneValue: { resourceUsageOneValue: [] },
    memoryUsageOneValue: { resourceUsageOneValue: [] },
    cpuUsageHistorical: null,
    memoryUsageHistorical: null,
    latencyAppRequestOneValue: { latencyAppRequestOneValue: [] },
    latencyAppRequestHistorical: null,
  },
  setAllData: (allData) =>
    set((state) => ({
      allData: {
        ...state.allData,
        podsStatuses: Array.isArray(allData.podsStatuses)
          ? []
          : allData.podsStatuses,
        requestLimits: Array.isArray(allData.requestLimits)
          ? []
          : allData.requestLimits,
        allNodes: Array.isArray(allData.allNodes) ? [] : allData.allNodes,
        cpuUsageOneValue: Array.isArray(allData.cpuUsageOneValue)
          ? []
          : allData.cpuUsageOneValue,
        memoryUsageOneValue: Array.isArray(allData.memoryUsageOneValue)
          ? []
          : allData.memoryUsageOneValue,
        cpuUsageHistorical: allData.cpuUsageHistorical,
        memoryUsageHistorical: allData.memoryUsageHistorical,
        latencyAppRequestOneValue: Array.isArray(
          allData.latencyAppRequestOneValue,
        )
          ? []
          : allData.latencyAppRequestOneValue,
        latencyAppRequestHistorical: allData.latencyAppRequestHistorical,
      },
    })),

  backendUrl: "http://localhost:3000/",
}));

export default dataStore;
