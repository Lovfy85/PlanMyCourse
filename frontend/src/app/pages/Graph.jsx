import React, { useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../../components/Navbar/Navbar";
import "./Graph.css";

const Graph = () => {
  const coursesData = [
    { title: "Introduction to Programming", class_name: "CMPT214", desc: "Learn the basics of programming with Python.", course_prereq: [] },
    { title: "Data Structures", class_name: "CMPT280", desc: "Covers linked lists, trees, and algorithms.", course_prereq: ["CMPT100"] },
    { title: "Algorithms", class_name: "CMPT360", desc: "Advanced study of algorithms and problem-solving techniques.", course_prereq: ["CMPT280"] },
    { title: "Software Engineering", class_name: "CMPT370", desc: "Software development methodologies and teamwork.", course_prereq: ["CMPT280"] },
  ];

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [query, setQuery] = useState("");

  const getCourseLevel = (className) => {
    const match = className.match(/\d+/);
    return match ? parseInt(match[0].slice(0, 1)) : 1;
  };

  const buildGraph = (course, nodesAcc, edgesAcc, visited = new Set(), horizontalIndex = 0) => {
    if (!course || visited.has(course.class_name)) return;

    visited.add(course.class_name);
    const level = getCourseLevel(course.class_name);
    const yPos = 400 - level * 100;

    nodesAcc.push({
      id: course.class_name,
      data: { label: course.class_name },
      position: { x: 200 + horizontalIndex * 150, y: yPos },
    });

    if (course.course_prereq && course.course_prereq.length > 0) {
      course.course_prereq.forEach((prereqName, i) => {
        const prereqCourse = coursesData.find((c) => c.class_name === prereqName);
        if (prereqCourse) {
          edgesAcc.push({
            id: `${prereqCourse.class_name}-${course.class_name}`,
            source: prereqCourse.class_name,
            target: course.class_name,
            animated: true,
            style: { stroke: '#2740a0' },
            markerEnd: {
            type: 'arrowclosed',
            color: '#000000ff',
  },
});
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
    <div className="graph-container">
      <Navbar className="graph-navbar" />

      <div className="graph-main">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter course name, e.g., CMPT280"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {/* Graph Display */}
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Graph;