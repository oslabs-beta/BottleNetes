/**
 * This component renders the 'Sort by...' dropdown
 */

import React from "react";

import mainStore from "../../stores/mainStore.ts";
import dataStore from "../../stores/dataStore.ts";

const PodSorter = () => {
  const setMetricToSort = dataStore((state) => state.setMetricToSort);
  const {  defaultView, setDefaultView } = mainStore();
  const { selectedLabel, setSelectedLabel } = mainStore();

  const sortOptions = [
    { metricType: "", label: "Sort by..." },
    { metricType: "cpuDataRelative", label: "CPU Usage (% of Request)" },
    { metricType: "memoryDataRelative", label: "Memory Usage (% of Request)" },
    { metricType: "latencyData", label: "Latency (ms)" },
    { metricType: "podName", label: "Pod Name" },
  ];

  // Reset selected label when defaultView changes to true
  if (defaultView && selectedLabel !== "Sort by...") {
    setSelectedLabel("Sort by...");
  }

  return (
    <div id="pod-sorter">
      <select
        value=""
        onChange={(e) => {
          // Find the selected option from the list of sort options
          const selected = sortOptions.find(
            (opt) => opt.metricType === e.target.value,
          );
          if (selected) {
            // Set the metric to sort and update the selected label
            setMetricToSort(selected.metricType);
            setSelectedLabel(
              selected.metricType
                ? // e.g. if a metric is selected, show "Sorting by: cpu usage %"
                  `Sorting by: ${selected.label}`
                : selected.label,
            );
            // If a metric is selected, set default view to false
            setDefaultView(false);
          }
        }}
        className="w-full rounded-lg border-2 border-slate-200 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
      >
        <option value="" disabled hidden>
          {
            // Show the selected label or "Sort by..."
            selectedLabel
          }
        </option>
        {
          // Create an option for each sort option
          sortOptions.map((option) => (
            <option key={option.metricType} value={option.metricType}>
              {option.label}
            </option>
          ))
        }
      </select>
    </div>
  );
};

export default PodSorter;
