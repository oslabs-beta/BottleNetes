import React, { useState, useEffect } from "react";
import "./Overview.css"; 

const Overview = () => {
  // Local state for metrics
  const [overview, setOverview] = useState({
    clusterName: "Loading...",
    nodes: 0,
    pods: 0,
    containers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        // Fetch all pods' status
        const podsResponse = await fetch(
          "http://localhost:3000/api/all-pods-status"
        );
        if (!podsResponse.ok) throw new Error("😵❌ Failed to fetch pod data");

        const podsData = await podsResponse.json();

        // Calculate metrics from pods data
        const podCount = podsData.allPodsStatus.length;
        const containerCount = podsData.allPodsStatus.reduce(
          (acc, pod) => acc + pod.containerCount,
          0
        );
        const clusterName = podsData.allPodsStatus[0]?.clusterName || "💀Unknown";

        // Fetch all nodes
        const nodesResponse = await fetch(
          "http://localhost:3000/api/all-nodes"
        );
        if (!nodesResponse.ok) throw new Error("😵❌ Failed to fetch node data");

        const nodesData = await nodesResponse.json();
        const nodeCount = nodesData.allNodes.length;

        // Update state
        setOverview({
          clusterName,
          nodes: nodeCount,
          pods: podCount,
          containers: containerCount,
        });

        console.log("Fetched Data:", {
          clusterName,
          nodes: nodeCount,
          pods: podCount,
          containers: containerCount,
        });
      } catch (err) {
        console.error("😭❌ Error fetching overview metrics:", err);
        setError(err.message || "🧐❌ An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Card styles for metrics
  const cardStyles = (bgColor) => ({
    backgroundColor: bgColor,
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  });

  // Fallback UI when loading or error occurs
  if (loading) {
    return (
      <div className="overview-container">
        <h1 className="overview-title">Kubernetes Dashboard Overview</h1>
        <p className="overview-message">Loading data... Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-container">
        <h1 className="overview-title">Kubernetes Dashboard Overview</h1>
        <p className="overview-error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="overview-container">
      <h1 className="overview-title">Kubernetes Dashboard Overview</h1>
      <div className="overview-grid">
        <div style={cardStyles("#4F46E5")}>
          <h2>Cluster Name</h2>
          <p className="overview-value">{overview.clusterName}</p>
        </div>
        <div style={cardStyles("#10B981")}>
          <h2>Number of Nodes</h2>
          <p className="overview-value">{overview.nodes}</p>
        </div>
        <div style={cardStyles("#F59E0B")}>
          <h2>Number of Pods</h2>
          <p className="overview-value">{overview.pods}</p>
        </div>
        <div style={cardStyles("#EF4444")}>
          <h2>Number of Containers</h2>
          <p className="overview-value">{overview.containers}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
