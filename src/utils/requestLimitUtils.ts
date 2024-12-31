import { allPodsRequestLimitObj } from "../stores/dataStore";

export const bytesToMb = (memoryInBytes: number | null): number | null => {
  return memoryInBytes ? memoryInBytes / (1024 * 1024) : null;
};

export const prepareRequestLimitChartData = (podList: allPodsRequestLimitObj[], selectedMetric: "cpu" | "memory" | "latency") => {
  if (!podList?.length) return [[], []];

  const limits = podList.map((pod) =>
    selectedMetric === "cpu" ? pod.cpuLimit : bytesToMb(pod.memoryLimit),
  );

  const requests = podList.map((pod) =>
    selectedMetric === "cpu" ? pod.cpuRequest : bytesToMb(pod.memoryRequest),
  );

  return [limits, requests];
};
