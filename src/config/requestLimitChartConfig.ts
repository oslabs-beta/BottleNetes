import { State } from "../stores/mainStore";

export const getRequestLimitChartOptions = (
  selectedMetric: State["selectedMetric"],
) => ({
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  barThickness: 30,
  maxBarThickness: 30,
  scales: {
    x: {
      position: "top" as const,
      stacked: false,
      grid: { color: "transparent" },
      beginAtZero: true,
      ticks: {
        color: "#64748b",
        font: { size: 14 },
        callback: function (value: string | number) {
          return value === null ? "No data" : value;
        },
      },
      title: {
        display: true,
        text: selectedMetric === "cpu" ? "CPU (Cores)" : "Memory (Mi)",
        color: "#64748b",
        font: { size: 14 },
      },
    },
    y: {
      stacked: true,
      grid: { color: "transparent" },
      ticks: {
        autoSkip: false,
        color: "#64748b",
        font: { size: 14 },
      },
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#64748b",
        font: { size: 15 },
      },
    },
    title: {
      display: false,
      text: `Request Limit for pod`,
      font: { size: 20 },
    },
    tooltip: {
      padding: 16,
      bodyFont: { size: 16, color: "#cbd5e1" },
      titleFont: { size: 16, color: "#cbd5e1" },
      backgroundColor: "#020617",
      caretSize: 10,
    },
  },
});
