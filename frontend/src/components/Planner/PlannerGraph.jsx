/**
 * PlannerGraph Component
 * 
 * Main component for displaying the course planner graph in a modal.
 * Shows all courses in the planner with prerequisite relationships.
 * Supports dragging nodes and persists positions to localStorage.
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Handler for closing the modal
 * @param {Array} courses - Array of courses from the planner
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import GraphModel from './GraphModel';
import GraphView from './GraphView';
import GraphPopUp from './GraphPopUp';
import { loadSavedPositions, savePositions, groupCoursesByLevel, createCourseMap } from './graphUtils';
import { buildNodes, buildEdges } from './graphBuilder';

function PlannerGraph({ isOpen, onClose, courses }) {
    // State for graph nodes
    const [nodes, setNodes] = useState([]);
    
    // State for graph edges
    const [edges, setEdges] = useState([]);
    
    // Loading state for graph building
    const [loading, setLoading] = useState(true);

    /**
     * Save node positions to localStorage whenever they change
     * This allows users to maintain their custom graph layout
     */
    useEffect(() => {
        if (nodes.length > 0) {
            savePositions(nodes);
        }
    }, [nodes]);

    /**
     * Build the graph when modal opens or courses change
     * Fetches prerequisite data and constructs nodes and edges
     */
    useEffect(() => {
        const shouldNotBuild = !isOpen || !courses || courses.length === 0;
        
        if (shouldNotBuild) {
            const isOpenButEmpty = isOpen && courses && courses.length === 0;
            if (isOpenButEmpty) {
                setNodes([]);
                setEdges([]);
                setLoading(false);
            }
            return;
        }

        const buildGraph = async () => {
            setLoading(true);
            try {
                // Fetch all prerequisite relationships from API
                const prereqResponse = await axios.get('http://localhost:3001/prerequisites/');
                const allPrereqs = prereqResponse.data;

                // Load saved positions from localStorage
                const savedPositions = loadSavedPositions();
                
                // Create course lookup map
                const courseMap = createCourseMap(courses);
                
                // Group courses by level (100, 200, 300, etc.)
                const levelGroups = groupCoursesByLevel(courses);

                // Build positioned nodes
                const graphNodes = buildNodes(courses, levelGroups, savedPositions);
                
                // Build edges connecting prerequisites
                const graphEdges = buildEdges(courses, allPrereqs, courseMap);

                // Update graph state
                setNodes(graphNodes);
                setEdges(graphEdges);
            } catch (error) {
                console.error('Error building graph:', error);
            } finally {
                setLoading(false);
            }
        };

        buildGraph();
    }, [isOpen, courses, setNodes, setEdges]);

    return (
        <GraphModel isOpen={isOpen} onClose={onClose} title="Course Prerequisites Graph">
            <div className="model-body">
                <GraphView 
                    nodes={nodes}
                    edges={edges}
                    courses={courses}
                    loading={loading}
                />
            </div>
            <GraphPopUp />
        </GraphModel>
    );
}

export default PlannerGraph;
