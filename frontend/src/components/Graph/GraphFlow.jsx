/**
 * GraphFlow Component
 * 
 * Displays the course prerequisite graph using ReactFlow.
 * Shows nodes (courses) and edges (prerequisite relationships).
 * 
 * @param {Array} nodes - Array of node objects representing courses
 * @param {Array} edges - Array of edge objects representing prerequisites
 */

import { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import CourseNode from "./CourseNode";

function GraphFlow({ nodes, edges, onNodeClick }) {
    // Define custom node types
    const nodeTypes = useMemo(() => ({
        courseNode: CourseNode
    }), []);

    return (
        <div className="graph-flow">
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                fitView
                proOptions={{ hideAttribution: true }}

            >
                <Background />
                <Controls position="bottom-left" />
            </ReactFlow>
        </div>
    );
}

export default GraphFlow;
