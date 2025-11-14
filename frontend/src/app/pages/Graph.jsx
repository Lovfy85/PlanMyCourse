import React, { useState } from "react";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../../components/Navbar/Navbar";
import "./Graph.css";
 // Used to communicate with the backend API
import axios from "axios";

const computeDepths = (edges) => {
  const graph = {};
  const inDegree = {};

  // Build a graph and count incoming edges for each node
  edges.forEach(({ source, target }) => {
    if (!graph[source]) graph[source] = [];
    graph[source].push(target);
    inDegree[target] = (inDegree[target] || 0) + 1;
    if (!inDegree[source]) inDegree[source] = 0;
  });

  // Start with nodes that have no prerequisites (inDegree = 0)
  const queue = Object.keys(inDegree).filter((k) => inDegree[k] === 0);
  const depth = {};
  queue.forEach((n) => (depth[n] = 0));

  // Use a simple breadth-first traversal to assign depth levels
  while (queue.length) {
    const node = queue.shift();
    const currDepth = depth[node];
    (graph[node] || []).forEach((neighbor) => {
      depth[neighbor] = Math.max(depth[neighbor] || 0, currDepth + 1);
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    });
  }

  return depth;
};


// Main Graph Content
const GraphContent = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [query, setQuery] = useState("");
  // Centeralize the graph using fitView 
  const { fitView } = useReactFlow(); 



  // Handle search button click
  const handleSearch = async () => {
    // Allow lowercase and remove spaces
    let lowerQuery = query.toLowerCase().replace(/\s+/g, "");
    if (!lowerQuery) return; 

    // If user enters just numbers (e.g., "280"), prepend "cmpt"
    if (/^\d+$/.test(lowerQuery)) {
      lowerQuery = `cmpt${lowerQuery}`;
    }

    try {
      // Fetch prerequisite data from backend
      const response = await axios.get(
        `http://localhost:3001/prerequisites/recurse/${lowerQuery}`
      );
      const prereqData = response.data;

    

      // Don't display course if no prerequisites exist
      if (prereqData.length < 1) {
        alert("No prerequisites found for this course!");
      }

      // Build edges between courses and connect lines (by using steps)
      const edges = prereqData.map((row) => ({
        id: `${row.course}-${row.prereq}`,
        source: row.prereq,
        target: row.course,
        type: "step",
        animated: true,
        className: "graph-edge",
      }));

      // Compute depth level for each node (how far from root)
      const depthMap = computeDepths(edges);

      // Collect all course names
      const courseNames = new Set();
      prereqData.forEach((r) => {
        courseNames.add(r.course);
        courseNames.add(r.prereq);
      });

      // Group courses by depth level
      const nodesByDepth = {};
      Array.from(courseNames).forEach((name) => {
        const d = depthMap[name] ?? 0;
        if (!nodesByDepth[d]) nodesByDepth[d] = [];
        nodesByDepth[d].push(name);
      });

      // Position nodes based on depth
      const nodes = [];
      Object.entries(nodesByDepth).forEach(([depth, names]) => {
        const count = names.length;
        const startX = -(count - 1) * 200;
        names.forEach((name, i) => {
          nodes.push({
            id: name,
            data: { label: name },
            position: { x: startX + i * 300, y: depth * 200 },
            className: "node",
          });
        });
      });

      // Update states
      setNodes(nodes);
      setEdges(edges);
      setQuery("");

      // Fit graph in fitView
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 200);
    } catch (err) {
      console.error("Error fetching course data:", err);
    }
  };



  return (
    <div className="graph-main">
      {/* Search bar */}
      <div className="search-bar-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // Make user be able to use enter button to search
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter course name, e.g., CMPT280 or 280"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {/* Graph view */}
      <div className="graph-flow">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};


// Graph wrapper with Navbar and ReactFlowProvider
const Graph = () => (
  <div className="graph-container">
    <Navbar className="graph-navbar" />
    <ReactFlowProvider>
      <GraphContent />
      <Controls />
    </ReactFlowProvider>
  </div>
);

export default Graph;