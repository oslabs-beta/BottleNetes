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
    <div className="flex space-x-2">
      <select
        value={filterType}
        // when selecting a filter type, reset filter value and change default view to false
        onChange={(e) => {
          setFilterType(e.target.value);
          setFilterValue("");
          setDefaultView(false);
        }}
        className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
      >
        {
          // Map through filter types and create dropdown options
          filterTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))
        }
      </select>

      {
        // Show filter value dropdown only when filter type is selected and defaultView is false
        filterType && !defaultView && (
          <div>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
            >
              <option value="">Select {filterType}...</option>
              {
                // For each filter type, map through unique values of selected filter type and create dropdown options
                getUniqueValues(filterType).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))
              }
            </select>

            <button
              onClick={handleFilterChange}
              className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Apply Filter
            </button>
          </div>
        )
      }
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
