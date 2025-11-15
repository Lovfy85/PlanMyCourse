/**
 * CourseNode Component
 * 
 * Custom node component for displaying courses in the graph.
 * Shows a shuffle icon if the course has alternative prerequisites.
 * 
 * @param {Object} data - Node data containing label and hasAlternatives flag
 */

import { Handle, Position } from 'reactflow';
import './CourseNode.css';

function CourseNode({ data }) {
    return (
        <div className="course-node-container">
            <Handle type="target" position={Position.Top} />
            <div className="course-node-content">
                <span className="course-name">{data.label}</span>
                {data.hasAlternatives && (
                    <img 
                        className="shuffle-icon" 
                        src="https://images.icon-icons.com/2024/PNG/512/clockwise_refresh_arrow_icon_123836.png"
                        alt="Switch alternative"
                        title="Click to see alternatives"
                    />
                )}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export default CourseNode;
