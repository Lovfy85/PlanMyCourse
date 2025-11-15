/**
 * GraphFlow Component
 * 
 * Displays the course prerequisite graph using ReactFlow.
 * Shows nodes (courses) and edges (prerequisite relationships).
 * 
 * @param {Array} nodes - Array of node objects representing courses
 * @param {Array} edges - Array of edge objects representing prerequisites
 */

import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import './GraphFlow.css';

function GraphFlow({ nodes, edges }) {
    return (
        <div className="graph-flow">
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
            </ReactFlow>
        </div>
    );
}

export default GraphFlow;
