import { useMemo } from "react";
import { bytesToMb } from "../utils/requestLimitUtils";

import { State } from "../stores/dataStore";
import { State as mainState } from "../stores/mainStore";
import { allPodsRequestLimitObj } from "../stores/dataStore";

export const useRequestLimitData = (
  requestLimits: State["allData"]["requestLimits"],
  sortType: State["sortType"],
  selectedMetric: mainState["selectedMetric"],
) : allPodsRequestLimitObj[] => {
  const podList = useMemo(() => {
    const pods = Array.isArray(requestLimits)
      ? []
      : requestLimits?.allPodsRequestLimit?.map((pod) => ({
          podName: pod.podName || "",
          cpuRequest: pod.cpuRequest ?? 0,
          memoryRequest: pod.memoryRequest ?? 0,
          cpuLimit: pod.cpuLimit ?? 0,
          memoryLimit: pod.memoryLimit ?? 0,
          cpuRequestLimitRatio: pod.cpuRequestLimitRatio ?? 0,
          memoryRequestLimitRatio: pod.memoryRequestLimitRatio ?? 0,
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
