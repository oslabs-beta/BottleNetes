/**
 * This component renders buttons to configure with metric to display the graph
 */

import React, { Fragment } from "react";

import mainStore from "../../stores/mainStore.ts";

const PodGridMetricSelection = () => {
  const { selectedMetric, setSelectedMetric } = mainStore();
  const metrics = [
    { type: "cpu", displayLabel: "CPU Usage (%)" },
    { type: "memory", displayLabel: "Mem. Usage (%)" },
    { type: "latency", displayLabel: "Latency (ms)" },
  ];

  return (
    <Fragment>
      {metrics.map((metric, index) => (
        <button
          key={index}
          onClick={() => setSelectedMetric(metric.type as "cpu" | "memory" | "latency")}
          className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
            selectedMetric === metric.type
              ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
              : "border-2 border-slate-200 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 hover:brightness-90"
          }`}
        >
          {metric.displayLabel}
        </button>
      ))}
    </Fragment>
  );
};

export default PodGridMetricSelection;
