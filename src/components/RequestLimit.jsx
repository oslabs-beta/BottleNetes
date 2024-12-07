import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const RequestLimit = ({ clickedPod }) => {
  const [podData, setPodData] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/something`);
        if (response.ok) {
          const data = await response.json();
          setPodData({
            requestRate: data.requestRate,
            requestLimit: data.requestLimit,
            timeStamp: data.timeStamp,
            // Placeholder data for request rate, request limit, and timestamps?
          });
        } else {
          const data = await response.json();
          console.error(data);
          alert("😭 RequestLimit failed to fetch data. Response is not OK!");
        }
      } catch (error) {
        console.error(error);
        alert("😿 Error in RequestLimit while fetching data from the server");
      }
    };
    fetchInfo();
  }, [clickedPod]);

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: false,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: `Request Limit for Pod ${clickedPod}`,
      },
    },
  };

  let data;
  if (podData) {
    data = {
      // basic stuff mostly taken from chartjs docs, I think it will need to be changed
      labels: podData.labels,
      datasets: [
        {
          label: "Request Rate",
          data: podData.requestRate,
          backgroundColor: "rgba(102, 255, 141, 0.8)" //placeholder
        },
        {
          label: "Request Limit",
          data: podData.request,
          backgroundColor: "rgba(255, 104, 112, 0.8)",
          borderRadius: 50
        },
      ],
    };
  } else data = null;

  return (
    <div className='bg-zinc-800'>
      <Bar options={options} data={data} />
    </div>
  );
};

RequestLimit.propTypes = {
  clickedPod: PropTypes.string,
};

export default RequestLimit;
