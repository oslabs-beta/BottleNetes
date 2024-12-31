import { create } from "zustand";

export type allPodsStatusObj = {
  podName: string;
  namespace: string;
  status: string;
  nodeName: string;
  service: string;
  clusterName: string;
  restartCount: number;
  containerCount: number;
  containers: any[];
  readiness: boolean;
  deployment: string;
  [key: string]: string | number | boolean | any[] | Record<string, unknown>;
};

export type allPodsRequestLimitObj = {
  podName: string;
  cpuRequest: number;
  memoryRequest: number;
  cpuLimit: number;
  memoryLimit: number;
  cpuRequestLimitRatio: number;
  memoryRequestLimitRatio: number;
  [key: string]: string | number | boolean | any[] | Record<string, unknown>;
};

type allNodesObj = {
  nodeName: string;
  clusterName: string;
  [key: string]: string;
};

type resourceUsageOneValueObj = {
  name: string;
  usageRelativeToRequest: number;
  usageAbsolute: number;
  [key: string]: string | number | boolean | any[] | Record<string, unknown>;
};

type resourceUsageHistoricalObj = {
  name: string;
  timestampsUnix: number[];
  timestampsReadable: number[];
  usageRelative: number[];
  usageAbsolute: number[];
  [key: string]: string | number | boolean | any[] | Record<string, unknown>;
};

type latencyAppRequestOneValueObj = {
  name: string;
  numRequest: number;
  avgInboundLatency: number;
  avgOutboundLatency: number;
  avgCombinedLatency: number;
  peakInboundLatency: number;
  peakOutboundLatency: number;
  [key: string]: string | number | boolean | any[] | Record<string, unknown>;
};

type latencyAppRequestHistoricalObj = {
  name: string;
  timestampsUnix: number[];
  timestampsReadable: number[];
  avgInboundLatency: number[];
  avgOutboundLatency: number[];
  avgCombinedLatency: number[];
  peakInboundLatency: number[];
  peakOutboundLatency: number[];
  [key: string]: string | number | boolean | any[] | Record<string, unknown>;
};

export type allData = {
  podsStatuses: { allPodsStatus: allPodsStatusObj[] } | any[];
  requestLimits: { allPodsRequestLimit: allPodsRequestLimitObj[] } | any[];
  allNodes: { allNodes: allNodesObj[] } | any[];
  cpuUsageOneValue:
    | { resourceUsageOneValue: resourceUsageOneValueObj[] }
    | any[];
  memoryUsageOneValue:
    | { resourceUsageOneValue: resourceUsageOneValueObj[] }
    | any[];
  cpuUsageHistorical:
    | { resourceUsageHistorical: resourceUsageHistoricalObj[] }
    | any[]
    | null;
  memoryUsageHistorical:
    | { resourceUsageHistorical: resourceUsageHistoricalObj[] }
    | any[]
    | null;
  latencyAppRequestOneValue:
    | { latencyAppRequestOneValue: latencyAppRequestOneValueObj[] }
    | any[];
  latencyAppRequestHistorical:
    | { latencyAppRequestHistorical: latencyAppRequestHistoricalObj[] }
    | any[]
    | null;
  [key: string]: Record<string, unknown> | any[] | null;
};

type filterConfig = {
  type: string;
  value: string;
};

export type State = {
  isFetchingData: boolean;
  allData: allData;
  backendUrl: "http://localhost:3000/";
  // PodGrid States
  metricToSort: string;
  filterConfig: filterConfig;
  sortType: string;
};

type Action = {
  setIsFetchingData: (boolean: State["isFetchingData"]) => void;
  setAllData: (allData: State["allData"]) => void;
  // PodGrid States
  setMetricToSort: (metricToSort: State["metricToSort"]) => void;
  setFilterConfig: (filterConfig: State["filterConfig"]) => void;
  setSortType: (sortType: State["sortType"]) => void;
};

const dataStore = create<State & Action>()((set) => ({
  isFetchingData: true,
  setIsFetchingData: (boolean) => set({ isFetchingData: boolean }),

  allData: {
    podsStatuses: { allPodsStatus: [] },
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
          : { allPodsStatus: allData.podsStatuses.allPodsStatus },
        requestLimits: Array.isArray(allData.requestLimits)
          ? []
          : { allPodsRequestLimit: allData.requestLimits.allPodsRequestLimit },
        allNodes: Array.isArray(allData.allNodes)
          ? []
          : { allNodes: allData.allNodes.allNodes },
        cpuUsageOneValue: Array.isArray(allData.cpuUsageOneValue)
          ? []
          : {
              resourceUsageOneValue:
                allData.cpuUsageOneValue.resourceUsageOneValue,
            },
        memoryUsageOneValue: Array.isArray(allData.memoryUsageOneValue)
          ? []
          : {
              resourceUsageOneValue:
                allData.memoryUsageOneValue.resourceUsageOneValue,
            },
        cpuUsageHistorical: allData.cpuUsageHistorical,
        memoryUsageHistorical: allData.memoryUsageHistorical,
        latencyAppRequestOneValue: Array.isArray(
          allData.latencyAppRequestOneValue,
        )
          ? []
          : {
              latencyAppRequestOneValue:
                allData.latencyAppRequestOneValue.latencyAppRequestOneValue,
            },
        latencyAppRequestHistorical: allData.latencyAppRequestHistorical,
      },
    })),

  backendUrl: "http://localhost:3000/",

  metricToSort: "",
  setMetricToSort: (metricToSort) => set({ metricToSort }),

  filterConfig: {
    type: "",
    value: "",
  },
  setFilterConfig: (filterConfig) =>
    set((state) => ({
      filterConfig: {
        ...state.filterConfig,
        type: filterConfig.type,
        value: filterConfig.value,
      },
    })),

  sortType: "",
  setSortType: (sortType) => set({ sortType }),
}));

export default dataStore;
