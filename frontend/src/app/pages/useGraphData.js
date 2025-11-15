import { useState } from 'react';
import axios from 'axios';
import {
    normalizeQuery,
    buildGraphEdges,
    collectCourseNames,
    computeDepths,
    groupNodesByDepth,
    buildGraphNodes
} from '../../components/Planner/graphUtils';

export const useGraphData = (fitView) => {
    // State for graph nodes (course boxes)
    const [nodes, setNodes] = useState([]);
    
    // State for graph edges (arrows between courses)
    const [edges, setEdges] = useState([]);
    
    // State for search query input
    const [query, setQuery] = useState("");

    /**
     * Handle search button click
     * Fetches prerequisite data and builds the graph
     */
    const handleSearch = async () => {
        // Clean and format the search query
        const normalizedQuery = normalizeQuery(query);
        
        // Exit if query is empty
        if (!normalizedQuery) {
            return;
        }

        try {
            // Fetch prerequisite data from backend API
            const response = await axios.get(
                `http://localhost:3001/prerequisites/recurse/${normalizedQuery}`
            );
            const prereqData = response.data;

            // Alert user if no prerequisites exist for this course
            if (prereqData.length < 1) {
                alert("No prerequisites found for this course!");
                return;
            }

            // Build edges (arrows) between courses
            const graphEdges = buildGraphEdges(prereqData);

            // Compute depth level for each node (how far from root)
            const depthMap = computeDepths(graphEdges);

            // Collect all unique course names
            const courseNames = collectCourseNames(prereqData);

            // Group courses by their depth level
            const nodesByDepth = groupNodesByDepth(courseNames, depthMap);

            // Create positioned nodes for the graph
            const graphNodes = buildGraphNodes(nodesByDepth);

            // Update graph state
            setNodes(graphNodes);
            setEdges(graphEdges);
            setQuery("");

            // Center and fit the graph in view with animation
            setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 200);
        } catch (err) {
            console.error("Error fetching course data:", err);
        }
    };

    // Return state and handlers for use in components
    return {
        nodes,
        edges,
        query,
        setQuery,
        handleSearch
    };
};
