import PropTypes from "prop-types";

const PodGridMetricSelection = ({ selectedMetric, setSelectedMetric }) => {
  const metrics = [
    { type: "cpu", displayLabel: "CPU Usage (%)" },
    { type: "memory", displayLabel: "Mem. Usage (%)" },
    { type: "latency", displayLabel: "Latency (ms)" },
  ];

  return (
    <div id="metric-type-selection">
      {metrics.map((metric) => (
        <button
          key={metric.type}
          onClick={() => setSelectedMetric(metric.type)}
          className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
            selectedMetric === metric.type
              ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
              : "border-2 border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 hover:brightness-90"
          }`}
        >
          {metric.displayLabel}
        </button>
      ))}
    </div>
  );
};

PodGridMetricSelection.propTypes = {
  selectedMetric: PropTypes.string.isRequired,
  setSelectedMetric: PropTypes.func.isRequired,
};

export default PodGridMetricSelection;
