import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import { getRequestLimitChartOptions } from "../../config/requestLimitChartConfig";

const RequestLimitChart = ({ data, selectedMetric, podList }) => {
  const chartHeight = podList.length * 50;
  const options = getRequestLimitChartOptions(selectedMetric);

  return (
    <div className="overflow-y-auto p-4 -mt-2" style={{ height: chartHeight }}>
      {podList.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <div className="text-slate-800 dark:text-slate-200">
          Loading...
        </div>
      )}
    </div>
  );
};

RequestLimitChart.propTypes = {
  data: PropTypes.object.isRequired,
  selectedMetric: PropTypes.string.isRequired,
  podList: PropTypes.array.isRequired,
};

export default RequestLimitChart;
