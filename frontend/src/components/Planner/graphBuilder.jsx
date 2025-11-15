/**
 * Graph Builder Functions
 * 
 * Functions to construct graph nodes and edges for the planner visualization.
 * Handles positioning, styling, and relationship building.
 */

import { MarkerType } from "reactflow";

/**
 * Build graph nodes from courses
 * 
 * Creates positioned, styled nodes for each course in the planner.
 * Uses saved positions if available, otherwise calculates default positions.
 * Nodes are arranged by level (100, 200, 300, etc.) vertically.
 * 
 * @param {Array} courses - Array of course objects from the planner
 * @param {Object} levelGroups - Courses grouped by level
 * @param {Object} savedPositions - Previously saved node positions from localStorage
 * @returns {Array} Array of node objects for ReactFlow
 */
export const buildNodes = (courses, levelGroups, savedPositions) => {
    const graphNodes = [];
    const levels = Object.keys(levelGroups).sort((a, b) => a - b);
    let yOffset = 0;

    levels.forEach((level) => {
        const coursesInLevel = levelGroups[level];
        const xSpacing = 250;
        const ySpacing = 150;
        const startX = -(coursesInLevel.length - 1) * xSpacing / 2;

        coursesInLevel.forEach((course, index) => {
            // Calculate default position
            const defaultX = startX + index * xSpacing;
            const defaultY = yOffset;
            
            // Use saved position if available, otherwise use default
            let position = { x: defaultX, y: defaultY };
            if (savedPositions[course.class_name]) {
                position = savedPositions[course.class_name];
            }

            // Set node class based on taken status
            let nodeClass = 'graph-node not-taken';
            if (course.taken) {
                nodeClass = 'graph-node taken';
            }

            // Create node object
            graphNodes.push({
                id: course.class_name,
                data: { 
                    label: (
                        <div className="course-node">
                            <div className="course-code">{course.class_name}</div>
                        </div>
                    )
                },
                position: position,
                draggable: true,
                className: nodeClass,
            });
        });

        // Move down for next level
        yOffset += ySpacing;
    });

    return graphNodes;
};

/**
 * Build graph edges from prerequisite relationships
 * 
 * Creates edges (arrows) connecting prerequisite courses to their dependent courses.
 * Only creates edges if both courses are in the planner.
 * 
 * @param {Array} courses - Array of course objects from the planner
 * @param {Array} allPrereqs - All prerequisite relationships from the database
 * @param {Map} courseMap - Map for quick course lookup
 * @returns {Array} Array of edge objects for ReactFlow
 */
export const buildEdges = (courses, allPrereqs, courseMap) => {
    const graphEdges = [];

    courses.forEach(course => {
        const coursePrereqs = allPrereqs.filter(p => p.course === course.class_name);
        
        coursePrereqs.forEach(prereq => {
            if (courseMap.has(prereq.prereq)) {
                graphEdges.push({
                    id: `${prereq.prereq}-${course.class_name}`,
                    source: prereq.prereq,
                    target: course.class_name,
                    type: 'smoothstep',
                    animated: true,
                    className: 'graph-edge',
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#000000',
                    },
                });
            }
        });
    });

    return graphEdges;
};
