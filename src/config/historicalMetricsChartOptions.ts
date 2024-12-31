export const historicalMetricsChartOptions = {
  responsive: true,
  interaction: {
    mode: "nearest" as const,
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
        callback: function (value: string | number) {
          return value + "%";
        },
      },
    },
  },
  elements: {
    point: {
      radius: 1,
      hoverRadius: 6,
    },
  },
  plugins: {
    legend: {
      position: "bottom" as const,
      title: {
        display: true,
        text: "CPU and Memory Usage over time",
        color: "#1e293b",
        padding: 5,
      },
      labels: {
        color: "#1e293b",
        font: { size: 15 },
      },
    },
    tooltip: {
      padding: 16,
      boxPadding: 10,
      bodyFont: {
        size: 14,
      },
      titleFont: {
        size: 20,
        weight: "bold" as const,
      },
      bodyColor: "#1f1f1f",
      titleColor: "#404040",
      backgroundColor: "#e9e9e9",
      caretSize: 10,
    },
  },
};
