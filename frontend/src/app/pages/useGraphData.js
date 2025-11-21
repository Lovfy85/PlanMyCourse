import { useState } from 'react';
import {
    normalizeQuery,
    computeDepths,
    groupNodesByDepth,
    buildGraphNodes
} from '../../components/Planner/graphUtils';
import alternativesData from './alternatives.json';
import coursesData from '../../../../web-scraper/courses.json';
import CourseNode from '../../components/Graph/CourseNode';

export const useGraphData = (fitView) => {
    // State for graph nodes (course boxes)
    const [nodes, setNodes] = useState([]);
    
    // State for graph edges (arrows between courses)
    const [edges, setEdges] = useState([]);
    
    // State for search query input
    const [query, setQuery] = useState("");

    /**
     * Build prerequisite graph from alternatives.json
     * Recursively finds all prerequisites for a course
     */
    const buildPrereqGraph = (courseName, visited = new Set()) => {
        if (visited.has(courseName)) {
            return { nodes: new Set(), edges: [] };
        }
        
        visited.add(courseName);
        const nodes = new Set([courseName]);
        const edges = [];
        
        const courseData = alternativesData.courseAlternatives[courseName];
        if (!courseData || !courseData.alternatives) {
            return { nodes, edges };
        }
        
        // Use the first alternative path by default
        const firstAlternative = courseData.alternatives[0];
        if (!firstAlternative || firstAlternative.length === 0) {
            return { nodes, edges };
        }
        
        // Process each prerequisite in the first alternative
        firstAlternative.forEach(prereq => {
            edges.push({
                id: `${prereq}-${courseName}`,
                source: prereq,
                target: courseName,
                type: 'smoothstep',
                animated: true,
                markerEnd: {
                    type: 'arrowclosed',
                    color: '#3a3a3a',
                },
            });
            
            // Recursively get prerequisites of this prerequisite
            const subGraph = buildPrereqGraph(prereq, visited);
            subGraph.nodes.forEach(node => nodes.add(node));
            edges.push(...subGraph.edges);
        });
        
        return { nodes, edges };
    };

    /**
     * Handle search button click
     * Builds prerequisite graph from alternatives.json
     */
    const handleSearch = () => {
        // Clean and format the search query
        const normalizedQuery = normalizeQuery(query);
        
        // Exit if query is empty
        if (!normalizedQuery) {
            return;
        }

        // Check if course exists in alternatives data
        if (!alternativesData.courseAlternatives[normalizedQuery]) {
            alert("Course not found!");
            return;
        }

        // Build the prerequisite graph
        const { nodes: courseNodes, edges: graphEdges } = buildPrereqGraph(normalizedQuery);

        if (courseNodes.size === 0) {
            alert("No prerequisites found for this course!");
            return;
        }

        // Compute depth level for each node
        const depthMap = computeDepths(graphEdges);

        // Group courses by their depth level
        const nodesByDepth = groupNodesByDepth(courseNodes, depthMap);

        // Create positioned nodes for the graph
        const graphNodes = buildGraphNodes(nodesByDepth);
        
        // Add custom node type and check for alternatives
        const enhancedNodes = graphNodes.map(node => {
            // Check if this node is a prerequisite that can be swapped
            let hasAlternatives = false;
            
            // Find edges where this node is the source (it's a prerequisite)
            const outgoingEdges = graphEdges.filter(edge => edge.source === node.id);
            
            // For each course that depends on this node, check if there are alternatives
            outgoingEdges.forEach(edge => {
                const targetCourse = edge.target;
                const targetData = alternativesData.courseAlternatives[targetCourse];
                
                if (targetData && targetData.alternatives && targetData.alternatives.length > 1) {
                    // Check if this node is in one of the alternative groups
                    const foundInGroup = targetData.alternatives.some(altGroup => 
                        altGroup.includes(node.id)
                    );
                    
                    if (foundInGroup) {
                        hasAlternatives = true;
                    }
                }
            });
            
            // Get course title from courses.json
            const course = coursesData.find(c => c.class_name === node.id);
            const courseTitle = course ? course.title : node.id;
            
            return {
                ...node,
                type: 'courseNode',
                data: {
                    label: node.id,
                    hasAlternatives: hasAlternatives,
                    title: courseTitle
                }
            };
        });

        // Update graph state
        setNodes(enhancedNodes);
        setEdges(graphEdges);
        setQuery("");

        // Center and fit the graph in view with animation
        setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 200);
    };

    /**
     * Replace a node in the graph with an alternative course
     * Rebuilds the graph to include the new course's prerequisites
     */
    const replaceNode = (oldCourse, newCourse) => {
        // Get all courses that depend on the old course (courses downstream)
        const downstreamCourses = new Set();
        const findDownstream = (courseName) => {
            edges.forEach(edge => {
                if (edge.source === courseName && !downstreamCourses.has(edge.target)) {
                    downstreamCourses.add(edge.target);
                    findDownstream(edge.target);
                }
            });
        };
        findDownstream(oldCourse);
        
        // Remove old course and its prerequisites (upstream)
        const nodesToKeep = new Set();
        downstreamCourses.forEach(course => nodesToKeep.add(course));
        
        // Build prerequisites for the new course
        const { nodes: newPrereqNodes, edges: newPrereqEdges } = buildPrereqGraph(newCourse, new Set());
        
        // Combine: keep downstream courses + add new course and its prerequisites
        const allNodes = new Set([...nodesToKeep, ...newPrereqNodes]);
        
        // Rebuild edges: keep downstream edges + add new prerequisite edges
        const downstreamEdges = edges.filter(edge => 
            downstreamCourses.has(edge.source) && downstreamCourses.has(edge.target)
        );
        
        // Add edges connecting new course to downstream courses
        const connectingEdges = [];
        downstreamCourses.forEach(downstreamCourse => {
            const courseData = alternativesData.courseAlternatives[downstreamCourse];
            if (courseData && courseData.alternatives) {
                courseData.alternatives.forEach(altGroup => {
                    if (altGroup.includes(newCourse)) {
                        connectingEdges.push({
                            id: `${newCourse}-${downstreamCourse}`,
                            source: newCourse,
                            target: downstreamCourse,
                            type: 'smoothstep',
                            animated: true,
                            markerEnd: {
                                type: 'arrowclosed',
                                color: '#3a3a3a',
                            },
                        });
                    }
                });
            }
        });
        
        const allEdges = [...downstreamEdges, ...newPrereqEdges, ...connectingEdges];
        
        // Recompute layout
        const depthMap = computeDepths(allEdges);
        const nodesByDepth = groupNodesByDepth(allNodes, depthMap);
        const graphNodes = buildGraphNodes(nodesByDepth);
        
        // Add custom node type and check for alternatives
        const enhancedNodes = graphNodes.map(node => {
            let hasAlternatives = false;
            const outgoingEdges = allEdges.filter(edge => edge.source === node.id);
            
            outgoingEdges.forEach(edge => {
                const targetCourse = edge.target;
                const targetData = alternativesData.courseAlternatives[targetCourse];
                
                if (targetData && targetData.alternatives && targetData.alternatives.length > 1) {
                    const foundInGroup = targetData.alternatives.some(altGroup => 
                        altGroup.includes(node.id)
                    );
                    
                    if (foundInGroup) {
                        hasAlternatives = true;
                    }
                }
            });
            
            // Get course title from courses.json
            const course = coursesData.find(c => c.class_name === node.id);
            const courseTitle = course ? course.title : node.id;
            
            return {
                ...node,
                type: 'courseNode',
                data: {
                    label: node.id,
                    hasAlternatives: hasAlternatives,
                    title: courseTitle
                }
            };
        });
        
        // Update graph state
        setNodes(enhancedNodes);
        setEdges(allEdges);
        
        // Re-center the graph
        setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 200);
    };

    // Return state and handlers for use in components
    return {
        nodes,
        edges,
        query,
        setQuery,
        handleSearch,
        replaceNode
    };
};
