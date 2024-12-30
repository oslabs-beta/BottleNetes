import PropTypes from "prop-types";
import { useState } from "react";

const PodSorter = ({ setMetricToSort, defaultView, setDefaultView }) => {
  const [selectedLabel, setSelectedLabel] = useState("Sort by...");

  const sortOptions = [
    { metricType: "", label: "Sort by..." },
    { metricType: "cpuDataRelative", label: "CPU Usage %" },
    { metricType: "memoryDataRelative", label: "Memory Usage %" },
    { metricType: "latencyData", label: "Latency" },
  ];

  // Reset selected label when defaultView changes to true
  if (defaultView && selectedLabel !== "Sort by...") {
    setSelectedLabel("Sort by...");
  }

  return (
    <div id='pod-sorter'>
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
        className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 border-2 border-slate-200 w-full transition duration-200 hover:brightness-90"
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

PodSorter.propTypes = {
  setMetricToSort: PropTypes.func.isRequired,
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
};

export default PodSorter;
