import { useMemo } from "react";
import { bytesToMb } from "../utils/requestLimitUtils";

export const useRequestLimitData = (
  requestLimits,
  sortType,
  selectedMetric,
) => {
  const podList = useMemo(() => {
    let pods =
      requestLimits?.allPodsRequestLimit?.map((pod) => ({
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
        const getValue = (pod, type) => {
          if (selectedMetric === "cpu") {
            const metricMap = {
              request: pod.cpuRequest,
              limit: pod.cpuLimit,
              ratio: pod.cpuRequestLimitRatio,
            };
            return typeof metricMap[type] === "number" ? metricMap[type] : null;
          } else {
            const metricMap = {
              request: pod.memoryRequest,
              limit: pod.memoryLimit,
              ratio: pod.memoryRequestLimitRatio,
            };
            return typeof metricMap[type] === "number"
              ? type === "ratio"
                ? metricMap[type]
                : bytesToMb(metricMap[type])
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
