import PropTypes from "prop-types";
import { useState } from "react";

const PodFilter = ({ podList, setFilterConfig }) => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterOperator, setFilterOperator] = useState("over");

  const filterTypes = [
    { value: "", label: "Filter by..." },
    { value: "namespace", label: "Namespace" },
    { value: "service", label: "Service" },
    { value: "deployment", label: "Deployment" },
    { value: "cpuRelative", label: "CPU Usage %" },
    { value: "memoryRelative", label: "Memory Usage %" },
  ];

  // Get unique values for dropdown options
  const getUniqueValues = (field) => [
    ...new Set(podList.map((pod) => pod[field])),
  ];

  const handleFilterChange = () => {
    setFilterConfig({
      type: filterType,
      value: filterValue,
      operator: filterOperator,
    });
  };

  return (
    <div className="flex space-x-2">
      <select
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          setFilterValue("");
        }}
        className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
      >
        {filterTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {filterType && (
        <>
          {["cpuRelative", "memoryRelative"].includes(filterType) ? (
            <>
              <select
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value)}
                className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
              >
                <option value="over">Over</option>
                <option value="under">Under</option>
              </select>
              <input
                type="number"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Percentage"
                className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
              />
            </>
          ) : (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
            >
              <option value="">Select {filterType}...</option>
              {getUniqueValues(filterType).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          )}
        </>
      )}

      <button
        onClick={handleFilterChange}
        className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        Apply
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
      deployment: PropTypes.string,
      cpuRelative: PropTypes.number,
      memoryRelative: PropTypes.number,
    }),
  ).isRequired,
  setFilterConfig: PropTypes.func.isRequired,
};

export default PodFilter;
