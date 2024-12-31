import { useMemo } from "react";
import { bytesToMb } from "../utils/requestLimitUtils";

import { allData, State } from "../stores/dataStore.ts";
import { State as mainState} from "../stores/mainStore.ts";

type requestLimit = allData["requestLimits"];
type sortType = State["sortType"];
type selectedMetric = mainState["selectedMetric"];
interface Pod {
  podName: string;
  cpuRequest: number | null;
  memoryRequest: number | null;
  cpuLimit: number | null;
  memoryLimit: number | null;
  cpuRequestLimitRatio: number | null;
  memoryRequestLimitRatio: number | null;
};

export const useRequestLimitData = (
  requestLimits: requestLimit,
  sortType: sortType,
  selectedMetric: selectedMetric,
) => {
  const podList = useMemo(() => {
    let pods = Array.isArray(requestLimits)
      ? []
      : requestLimits?.allPodsRequestLimit?.map((pod) => ({
        podName: pod.podName || "",
        cpuRequest: typeof pod.cpuRequest === "number" ? pod.cpuRequest : null,
        memoryRequest:
          typeof pod.memoryRequest === "number" ? pod.memoryRequest : null,
        cpuLimit: typeof pod.cpuLimit === "number" ? pod.cpuLimit : null,
        memoryLimit:
          typeof pod.memoryLimit === "number" ? pod.memoryLimit : null,
        cpuRequestLimitRatio:
          typeof pod.cpuRequestLimitRatio === "number"
            ? pod.cpuRequestLimitRatio
            : null,
        memoryRequestLimitRatio:
          typeof pod.memoryRequestLimitRatio === "number"
            ? pod.memoryRequestLimitRatio
            : null,
      })) || [];

    if (sortType) {
      pods.sort((a, b) => {
        const getValue = (pod: Pod, type: string): number | null => {
          if (selectedMetric === "cpu") {
            const metricMap: { [key: string]: number | null } = {
              request: pod.cpuRequest,
              limit: pod.cpuLimit,
              ratio: pod.cpuRequestLimitRatio,
            };
            return typeof metricMap[type] === "number" ? metricMap[type] : null;
          } else {
            const metricMap: { [key: string]: number | null } = {
              request: pod.memoryRequest,
              limit: pod.memoryLimit,
              ratio: pod.memoryRequestLimitRatio,
            };
            return typeof metricMap[type] === "number"
              ? type === "ratio"
          ? metricMap[type]
          : bytesToMb(metricMap[type]!)
              : null;
          }
        };

        

        if (sortType === "podName") return a.podName.localeCompare(b.podName);

        const aValue = getValue(a, sortType);
        const bValue = getValue(b, sortType);

        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        return bValue - aValue;
      });
    }

    return pods;
  }, [requestLimits, sortType, selectedMetric]);

  return podList;
};
