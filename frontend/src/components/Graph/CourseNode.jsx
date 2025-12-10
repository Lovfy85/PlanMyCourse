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
        <>
            <Handle className="graph-handle" type="target" position={Position.Top} />
            <div className="course-node-content">
                <span className="course-name">{data.label}</span>
                {data.hasAlternatives && (
                    <img 
                        className="shuffle-icon" 
                        src="https://images.icon-icons.com/2024/PNG/512/clockwise_refresh_arrow_icon_123836.png"
                        alt="Switch alternative"
                    />
                )}
                // Display course id and title on hover
                {data.title && (
                    <div className="course-hover">
                        <div className="hover-course-id">{data.label}</div>
                        <div className="hover-course-title">{data.title}</div>
                    </div>
                )}
            </div>
            <Handle className="graph-handle" type="source" position={Position.Bottom} />
        </>
    );
}

export default CourseNode;
