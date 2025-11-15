/**
 * Graph Page Component
 * 
 * Main page for displaying course prerequisite graphs.
 * Users can search for a course and see all its prerequisites in a visual graph.
 */

import { Controls, ReactFlowProvider, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/Graph/SearchBar";
import GraphFlow from "../../components/Graph/GraphFlow";
import { useGraphData } from "./useGraphData";
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
  const { nodes, edges, query, setQuery, handleSearch } = useGraphData(fitView);

  return (
    <div className="graph-main">
      {/* Search bar for entering course names */}
      <SearchBar 
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
      />
      {/* Graph visualization */}
      <GraphFlow nodes={nodes} edges={edges} />
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