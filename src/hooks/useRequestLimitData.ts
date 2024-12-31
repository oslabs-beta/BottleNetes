import { useMemo } from "react";
import { bytesToMb } from "../utils/requestLimitUtils.ts";

import { State } from "../stores/dataStore.ts";
import { State as mainState } from "../stores/mainStore.ts";

export const useRequestLimitData = (
  requestLimits: State["allData"]["requestLimits"],
  sortType: State["sortType"],
  selectedMetric: mainState["selectedMetric"],
) => {
  const podList = useMemo(() => {
    let pods = Array.isArray(requestLimits)
      ? []
      : requestLimits?.allPodsRequestLimit?.map((pod) => ({
          podName: pod.podName || "",
          cpuRequest:
            typeof pod.cpuRequest === "number" ? pod.cpuRequest : null,
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
        const getValue = (pod: typeof a, type: "request" | "limit" | "ratio") => {
          if (selectedMetric === "cpu") {
            const metricMap = {
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

        const aValue = getValue(a, sortType as "request" | "limit" | "ratio");
        const bValue = getValue(b, sortType as "request" | "limit" | "ratio");

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
