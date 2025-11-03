import React, { useState } from "react";
import coursesData from "./courses.json";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import Navbar from "../../../components/Navbar/Navbar";
import "reactflow/dist/style.css";

const CourseGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [query, setQuery] = useState("");

  // Helper to get numeric level from class_name
  const getCourseLevel = (className) => {
    const match = className.match(/\d+/);
    return match ? parseInt(match[0].slice(0, 1)) : 1; // use first digit as level
  };

  const buildGraph = (course, nodesAcc, edgesAcc, visited = new Set(), horizontalIndex = 0) => {
    if (!course || visited.has(course.class_name)) return;

    visited.add(course.class_name);

    const level = getCourseLevel(course.class_name); // 1 for 100-level, 2 for 200-level, etc.
    const yPos = 400 - level * 100; // 100-level at bottom, 200 above, etc.

    // Add current course node
    nodesAcc.push({
      id: course.class_name,
      data: { label: course.class_name },
      position: { x: 200 + horizontalIndex * 150, y: yPos },
    });

    // Add edges and recurse into prerequisites
    if (course.course_prereq && course.course_prereq.length > 0) {
      course.course_prereq.forEach((prereqName, i) => {
        const prereqCourse = coursesData.find((c) => c.class_name === prereqName);
        if (prereqCourse) {
          edgesAcc.push({
            id: `${prereqCourse.class_name}-${course.class_name}`,
            source: prereqCourse.class_name,
            target: course.class_name,
            animated: true,
          });

          // Recursive call, horizontalIndex adjusted for spacing
          buildGraph(prereqCourse, nodesAcc, edgesAcc, visited, horizontalIndex + i);
        }
      });
    }
  };

  const handleSearch = () => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return;

    const course = coursesData.find(
      (c) =>
        c.class_name.toLowerCase() === lowerQuery ||
        c.title.toLowerCase().includes(lowerQuery)
    );

    if (!course) {
      alert("Course not found!");
      return;
    }

    const newNodes = [];
    const newEdges = [];

    buildGraph(course, newNodes, newEdges);

    setNodes(newNodes);
    setEdges(newEdges);

    setQuery("");
  };

  return (
    <div style={{ height: "calc(100vh - 80px)", width: "100%" }}>
      {/* Search Bar */}
      <div
        style={{
            position: "static",
            display: "flex",
            height: "3em",
            justifyContent: "center",
            marginTop: "100px",
            marginBottom: "20px",
        }}
      >
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter course name, e.g., CMPT280"
            style={{
                width: "300px",
                padding: "10px",
                borderRadius: "5px 0 0 5px",
                border: "1px solid #ccc",
                fontSize: "1em",
          }}
        />
        <button
            onClick={handleSearch}
            style={{
                backgroundColor: "#1a5b98",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "0 5px 5px 0",
                cursor: "pointer",
                fontSize: "1em",
            }}
        >
          Search
        </button>
      </div>


      <Navbar />
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
      </ReactFlow>
    </div>
  );
};

export default CourseGraph;