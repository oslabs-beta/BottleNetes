/**
 * This component renders 'Filter by...' dropdown and its buttons based on some conditions
 */

import PropTypes from "prop-types";
import { useState } from "react";

const PodFilter = ({
  podList,
  setFilterConfig,
  defaultView,
  setDefaultView,
}) => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const filterTypes = [
    { value: "", label: "Filter by..." },
    { value: "namespace", label: "Namespace" },
    { value: "service", label: "Service" },
    { value: "deploymentName", label: "Deployment" },
  ];

  // Get unique values for dropdown options
  const getUniqueValues = (field) => [
    ...new Set(podList.map((pod) => pod[field])),
  ];

  const handleFilterChange = () => {
    setFilterConfig({
      type: filterType,
      value: filterValue,
    });
    // Change default view to false when filter is applied
    setDefaultView(false);
  };

  // Reset filter type when defaultView becomes true
  if (defaultView && filterType !== "") {
    setFilterType("");
    setFilterValue("");
  }

  return (
    <div className="pod-filter col-span-4 gap-4 grid grid-cols-3">
      <select
        value={filterType}
        // when selecting a filter type, reset filter value and change default view to false
        onChange={(e) => {
          setFilterType(e.target.value);
          setFilterValue("");
          setDefaultView(false);
        }}
        className="w-full rounded-lg border-2 border-transparent bg-slate-200 px-3 py-2 text-sm font-medium font-semibold text-slate-500 transition duration-200 hover:brightness-90 dark:bg-slate-800 dark:text-slate-300"
      >
        {
          // Map through filter types and create dropdown options
          filterTypes.map((type, i) => (
            <option key={i} value={type.value}>
              {type.label}
            </option>
          ))
        }
      </select>

      {/* Show filter value dropdown only when filter type is selected and defaultView is false */}
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className={`w-full rounded-lg border-2 border-slate-200 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-300 hover:brightness-90 ${filterType && !defaultView ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <option value="">Select {filterType}...</option>
          {
            // For each filter type, map through unique values of selected filter type and create dropdown options
            getUniqueValues(filterType).map((value, i) => (
              <option key={i} value={value}>
                {value}
              </option>
            ))
          }
        </select>

        <button
          onClick={handleFilterChange}
          className={`w-full rounded-lg border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-3 py-2 text-sm font-medium text-slate-100 transition duration-300 hover:brightness-90 ${filterType && !defaultView ? "pointer-event-auto opacity-100" : "pointer-events-none opacity-0"}`}
        >
          Apply Filter
        </button>
      </div>
  );
};

PodFilter.propTypes = {
  podList: PropTypes.arrayOf(
    PropTypes.shape({
      podName: PropTypes.string.isRequired,
      namespace: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      deploymentName: PropTypes.string,
    }),
  ).isRequired,
  setFilterConfig: PropTypes.func.isRequired,
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
};

export default PodFilter;
