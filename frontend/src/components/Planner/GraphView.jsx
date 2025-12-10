import ReactFlow, { Background, Controls } from 'reactflow';
import { useMemo } from 'react';
import 'reactflow/dist/style.css';
import CourseNode from '../Graph/CourseNode';
import './GraphView.css';

function GraphView({ nodes, edges, courses, loading }) {
    // Define custom node types
    const nodeTypes = useMemo(() => ({
        plannerNode: CourseNode
    }), []);



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
            fitView
            proOptions={{ hideAttribution: true }}
        >
            <Background />
            <Controls position="bottom-left" />
        </ReactFlow>
    );
}

export default GraphView;
