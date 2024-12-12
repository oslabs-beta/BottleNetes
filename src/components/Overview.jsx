import React, { useState, useEffect } from "react";
import "./Overview.css";

const Overview = ({ podsStatuses, allNodes, isLoading }) => {
  const [overview, setOverview] = useState({
    clusterName: "Loading...",
    nodes: 0,
    pods: 0,
    containers: 0,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log("🏃💨 Fetching data to overview component");

      if (!isLoading && podsStatuses?.allPodsStatus && allNodes?.allNodes) {
        const podCount = podsStatuses.allPodsStatus.length;
        const containerCount = podsStatuses.allPodsStatus.reduce(
          (acc, pod) => acc + pod.containerCount,
          0,
        );
        const clusterName =
          allNodes.allNodes[0]?.clusterName || "Unknown Cluster Name";
        const nodeCount = allNodes.allNodes.length;

        setOverview({
          clusterName,
          nodes: nodeCount,
          pods: podCount,
          containers: containerCount,
        });
        console.log("✅ Data successfully loaded to overview component!");
      }
    } catch (err) {
      console.error("😵 Error fetching metrics:", err);
      setError(err.message || "An unknown error occurred.");
    }
  }, [isLoading, podsStatuses, allNodes]);

  if (isLoading) {
    return (
      <div className="overview-container fade-in">
        <p className="overview-message blinking">
          ⏳ Loading Cluster Overview...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-container fade-in">
        <p className="overview-error">❗❗ Error❗❗ : {error}</p>
      </div>
    );
  }

  return (
    <div className="overview-container fade-in">
      <div className="overview-cluster thin-line">
        <h2 style={{ fontWeight: 600 }}>Cluster Name</h2>
        <p className="overview-value dynamic-text">{overview.clusterName}</p>
      </div>

      <div className="overview-metrics-row">
        <div className="overview-card overview-nodes">
          <h2>No. of Nodes</h2>
          <p className="overview-value">{overview.nodes}</p>
        </div>

        <div className="overview-card overview-pods">
          <h2>No. of Pods</h2>
          <p className="overview-value">{overview.pods}</p>
        </div>

        <div className="overview-card overview-containers">
          <h2>No. of Containers</h2>
          <p className="overview-value">{overview.containers}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
