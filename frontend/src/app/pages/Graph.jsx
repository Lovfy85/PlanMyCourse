import React, { useState } from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../../components/Navbar/Navbar";
import "./Graph.css";
import axios from "axios";

const Graph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [query, setQuery] = useState("");

  // Helper: determine Y position by course level (e.g., 100, 200, 300)
  const getCourseLevel = (className) => {
    const match = className.match(/\d+/);
    return match ? parseInt(match[0].slice(0, 1)) : 1;
  };

  // Recursively build graph from course and its prerequisites
  const buildGraph = async (
    course,
    nodesAcc,
    edgesAcc,
    visited = new Set(),
    horizontalIndex = 0
  ) => {
    if (!course || visited.has(course.class_name)) return;

    visited.add(course.class_name);

    const level = getCourseLevel(course.class_name);
    const yPos = 400 - level * 100;

    // Add node if not already present
    if (!nodesAcc.some((n) => n.id === course.class_name)) {
      nodesAcc.push({
        id: course.class_name,
        data: { label: course.class_name },
        position: { x: 200 + horizontalIndex * 150, y: yPos },
      });
    }

    // Add edges and recurse into prerequisites
    if (course.course_prereq && course.course_prereq.length > 0) {
      for (let i = 0; i < course.course_prereq.length; i++) {
        const prereqName = course.course_prereq[i];
        const edgeId = `${prereqName}-${course.class_name}`;

        if (!edgesAcc.some((e) => e.id === edgeId)) {
          edgesAcc.push({
            id: edgeId,
            source: prereqName,
            target: course.class_name,
            animated: true,
            style: { stroke: "#2740a0" },
            markerEnd: { type: "arrowclosed", color: "#000000" },
          });
        }

        try {
          const res = await axios.get(
            `http://localhost:3001/courses/search?term=${prereqName}`
          );
          const prereqCourse = res.data[0]; // assuming API returns array
          await buildGraph(prereqCourse, nodesAcc, edgesAcc, visited, horizontalIndex + i);
        } catch (err) {
          console.error(`Failed to fetch prerequisite ${prereqName}:`, err);
        }
      }
    }
  };

  // Handle course search and graph generation
  const handleSearch = async () => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/courses/search?term=${lowerQuery}`
      );

      const courseList = response.data;
      if (!courseList || courseList.length === 0) {
        alert("Course not found!");
        return;
      }

      const newNodes = [];
      const newEdges = [];

      for (let i = 0; i < courseList.length; i++) {
        await buildGraph(courseList[i], newNodes, newEdges, new Set(), i);
      }

      setNodes(newNodes);
      setEdges(newEdges);
      setQuery("");
    } catch (err) {
      console.error("Failed to GET request:", err);
    }
  };

  return (
    <div className="graph-container">
      <Navbar className="graph-navbar" />

      <div className="graph-main">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter course name, e.g., CMPT280"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {/* React Flow Graph */}
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Graph;
