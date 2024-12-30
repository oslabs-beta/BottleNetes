import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import { getRequestLimitChartOptions } from "../../config/requestLimitChartConfig";

const RequestLimitChart = ({ data, selectedMetric, podList }) => {
  const chartHeight = podList.length * 50;
  const options = getRequestLimitChartOptions(selectedMetric);

  return (
    <div className="overflow-y-auto p-4" style={{ height: chartHeight }}>
      {podList.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-900">No data available</p>
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
