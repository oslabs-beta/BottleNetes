import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { data } from 'autoprefixer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const Metrics = ({ defaultView, clickedPod, podData, setPodData }) => {
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
      //
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: `Metric`,
      },
    },
  };

  let data;
  if (podData.length) {
    data = {
      labels: podData.labels,
      datasets: [
        {
          labels: 'CPU Usage(%)',
          data: podData.value,
        },
        {
          label: 'RAM Usage(%)',
          data: podData.value,
        },
        {
          labels: 'Disk Usage(%)',
          data: podData.value,
        },
        {
          labels: 'Latency(ms)',
          data: podData.value,
        },
      ],
    };
  }
  
  return(
    <div className='bg-zinc-800'>
      <Line options={options} data={data}/>
    </div>
  )
}

Metrics.propTypes = {
  defaultView: PropTypes.bool,
  clickedPod: PropTypes.string,
  podData: PropTypes.array,
  setPodData: PropTypes.func,
}
export default Metrics;