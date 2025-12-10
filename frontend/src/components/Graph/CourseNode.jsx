/**
 * CourseNode Component
 * 
 * Unified custom node component for displaying courses in all graphs.
 * Shows a shuffle icon if the course has alternative prerequisites.
 * Supports both prerequisite graphs (with handles) and planner graphs (without handles).
 * 
 * @param {Object} data - Node data containing course information
 * @param {boolean} data.showHandles - Whether to show ReactFlow handles (for prerequisite graphs)
 * @param {string} data.label - Course code/ID
 * @param {string} data.courseCode - Alternative course code field (for planner compatibility)
 * @param {string} data.title - Full course title
 * @param {boolean} data.hasAlternatives - Whether course has alternative prerequisites
 */

import { Handle, Position } from 'reactflow';
import './CourseNode.css';

function CourseNode({ data }) {
    // Use either label or courseCode for the course identifier
    const courseId = data.label || data.courseCode;
    
    return (
        <>
            {data.showHandles !== false && (
                <Handle className="graph-handle" type="target" position={Position.Top} />
            )}
            <div className="course-node-content">
                <span className="course-name">{courseId}</span>
                {data.hasAlternatives && (
                    <img 
                        className="shuffle-icon" 
                        src="https://images.icon-icons.com/2024/PNG/512/clockwise_refresh_arrow_icon_123836.png"
                        alt="Switch alternative"
                    />
                )}
                {data.title && (
                    <div className="course-tooltip">
                        <div className="tooltip-course-id">{courseId}</div>
                        <div className="tooltip-course-title">{data.title}</div>
                    </div>
                )}
            </div>
            {data.showHandles !== false && (
                <Handle className="graph-handle" type="source" position={Position.Bottom} />
            )}
        </>
    );
}

export default CourseNode;
