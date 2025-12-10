import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import { useMemo } from 'react';
import 'reactflow/dist/style.css';
import CourseNode from '../Graph/CourseNode';
import './GraphView.css';

function GraphView({ nodes, edges, onNodesChange, onEdgesChange, courses, loading }) {
    // Define custom node types
    const nodeTypes = useMemo(() => ({
        plannerNode: CourseNode
    }), []);

    // Get colour for a node in the minimap
    const getNodeColor = (node) => {
        const course = courses.find(c => c.class_name === node.id);
        // Colour node blue if taken
        if (course && course.taken) {
            return '#215591';
        }
        // Colour node grey if not taken yet
        return '#707070ff';
    };

    // Show loading state
    if (loading) {
        return <div className="loading">Loading graph...</div>;
    }
    
    // Show empty state
    if (nodes.length === 0) {
        return <div className="no-courses">No courses to display</div>;
    }

    // Show the graph
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            proOptions={{ hideAttribution: true }}
        >
            <Background />
            <Controls position="bottom-left" />
        </ReactFlow>
    );
}

export default GraphView;
