export const latencyChartOptions = {
  responsive: true,
  interaction: {
    mode: "nearest",
    intersect: false,
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: false,
      grid: {
        display: false,
      },
      ticks: {
        color: "#1e293b",
        font: { size: 14 },
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      stacked: false,
      grid: {
        display: false,
      },
      ticks: {
        color: "#1e293b",
        font: { size: 14 },
        callback: function (value) {
          return value + "ms";
        },
      },
    },
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 6,
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#1e293b",
        font: { size: 15 },
      },
    },
    tooltip: {
      padding: 16,
      bodyFont: {
        size: 16,
        color: "#cbd5e1",
      },
      titleFont: {
        size: 16,
        color: "#cbd5e1",
      },
      backgroundColor: "#020617",
      caretSize: 10,
    },
  },
};
