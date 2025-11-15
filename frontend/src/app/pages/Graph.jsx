/**
 * Graph Page Component
 * 
 * Main page for displaying course prerequisite graphs.
 * Users can search for a course and see all its prerequisites in a visual graph.
 */

import { useState } from "react";
import { Controls, ReactFlowProvider, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/Graph/SearchBar";
import GraphFlow from "../../components/Graph/GraphFlow";
import AlternativeSelector from "../../components/Graph/AlternativeSelector";
import { useGraphData } from "./useGraphData";
import alternativesData from "./alternatives.json";
import "./Graph.css";

/**
 * GraphContent Component
 * 
 * Inner component that has access to ReactFlow context.
 * Manages the search functionality and graph display.
 */
const GraphContent = () => {
  // Get fitView function from ReactFlow to center the graph
  const { fitView } = useReactFlow();
  
  // Get graph data and search handlers from custom hook
  const { nodes, edges, query, setQuery, handleSearch, replaceNode } = useGraphData(fitView);
  
  // State for alternative selector
  const [selectedNode, setSelectedNode] = useState(null);

  // Handle node click to show alternatives
  const handleNodeClick = (event, node) => {
    const courseName = node.id;
    
    // Find which courses have this node as a prerequisite
    const dependentCourses = edges.filter(edge => edge.source === courseName);
    
    if (dependentCourses.length === 0) {
      return; // No courses depend on this, so no alternatives to show
    }
    
    // For each dependent course, check if there are alternative prerequisites
    const alternatives = [];
    dependentCourses.forEach(edge => {
      const targetCourse = edge.target;
      const targetData = alternativesData.courseAlternatives[targetCourse];
      
      if (targetData && targetData.alternatives && targetData.alternatives.length > 1) {
        // Find which alternative group contains the current course
        const currentGroupIndex = targetData.alternatives.findIndex(altGroup => 
          altGroup.includes(courseName)
        );
        
        if (currentGroupIndex !== -1) {
          // Get all OTHER alternative groups
          targetData.alternatives.forEach((altGroup, index) => {
            if (index !== currentGroupIndex) {
              // Add all courses from other alternative groups
              altGroup.forEach(altCourse => {
                if (!alternatives.includes(altCourse)) {
                  alternatives.push(altCourse);
                }
              });
            }
          });
        }
      }
    });
    
    if (alternatives.length > 0) {
      setSelectedNode({ ...node, alternativesList: alternatives });
    }
  };

  // Handle selecting an alternative to replace the current node
  const handleSelectAlternative = (oldCourse, newCourse) => {
    replaceNode(oldCourse, newCourse);
    setSelectedNode(null);
  };

  // Get alternatives for selected node
  const getAlternatives = () => {
    if (!selectedNode || !selectedNode.alternativesList) return null;
    // Return as array of arrays to match expected format
    return selectedNode.alternativesList.map(alt => [alt]);
  };

  return (
    <div className="graph-main">
      {/* Search bar for entering course names */}
      <SearchBar 
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
      />
      {/* Graph visualization */}
      <GraphFlow 
        nodes={nodes} 
        edges={edges}
        onNodeClick={handleNodeClick}
      />
      {/* Alternative selector */}
      <AlternativeSelector
        selectedNode={selectedNode}
        alternatives={getAlternatives()}
        onSelectAlternative={handleSelectAlternative}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

/**
 * Graph Component
 * 
 * Main wrapper component that provides ReactFlow context.
 * Includes navbar and graph controls.
 */
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