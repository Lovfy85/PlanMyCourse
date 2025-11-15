/**
 * Load saved node positions from localStorage
 * 
 * Retrieves previously saved positions so users can maintain their custom graph layout.
 * 
 * @returns {Object} Map of node IDs to position objects {x, y}
 */
export const loadSavedPositions = () => {
    try {
        const saved = localStorage.getItem('plannerGraphPositions');
        if (saved) {
            return JSON.parse(saved);
        }
        return {};
    } catch (error) {
        console.error('Error loading saved positions:', error);
        return {};
    }
};

/**
 * Save node positions to localStorage
 * 
 * Persists the current positions of all nodes so they can be restored later.
 * 
 * @param {Array} nodes - Array of node objects with position data
 */
export const savePositions = (nodes) => {
    const positions = {};
    nodes.forEach(node => {
        positions[node.id] = node.position;
    });
    localStorage.setItem('plannerGraphPositions', JSON.stringify(positions));
};

/**
 * Group courses by their level (100, 200, 300, etc.)
 * 
 * Organizes courses into level groups for vertical positioning in the graph.
 * 
 * @param {Array} courses - Array of course objects
 * @returns {Object} Object with level numbers as keys and arrays of courses as values
 */
export const groupCoursesByLevel = (courses) => {
    const levelGroups = {};
    courses.forEach(course => {
        const level = Math.floor(course.number / 100) * 100;
        if (!levelGroups[level]) {
            levelGroups[level] = [];
        }
        levelGroups[level].push(course);
    });
    return levelGroups;
};

/**
 * Create a Map for quick course lookup by class name
 * 
 * @param {Array} courses - Array of course objects
 * @returns {Map} Map with class_name as key and course object as value
 */
export const createCourseMap = (courses) => {
    const courseMap = new Map();
    courses.forEach(course => {
        courseMap.set(course.class_name, course);
    });
    return courseMap;
};

/**
 * Normalize a course query string
 * Removes spaces and converts to uppercase
 * 
 * @param {string} query - Raw search query
 * @returns {string} Normalized query
 */
export const normalizeQuery = (query) => {
    return query.trim().toUpperCase().replace(/\s+/g, '');
};

/**
 * Build graph edges from prerequisite data
 * 
 * @param {Array} prereqData - Array of prerequisite relationships
 * @returns {Array} Array of edge objects
 */
export const buildGraphEdges = (prereqData) => {
    return prereqData.map(prereq => ({
        id: `${prereq.prereq}-${prereq.course}`,
        source: prereq.prereq,
        target: prereq.course,
        type: 'smoothstep',
        animated: true,
    }));
};

/**
 * Collect all unique course names from prerequisite data
 * 
 * @param {Array} prereqData - Array of prerequisite relationships
 * @returns {Set} Set of unique course names
 */
export const collectCourseNames = (prereqData) => {
    const courseNames = new Set();
    prereqData.forEach(prereq => {
        courseNames.add(prereq.course);
        courseNames.add(prereq.prereq);
    });
    return courseNames;
};

/**
 * Compute depth level for each node in the graph
 * Uses BFS to determine how far each course is from root courses
 * 
 * @param {Array} edges - Array of edge objects
 * @returns {Map} Map of course names to depth levels
 */
export const computeDepths = (edges) => {
    const depthMap = new Map();
    const inDegree = new Map();
    const adjList = new Map();

    // Build adjacency list and in-degree map
    edges.forEach(edge => {
        if (!adjList.has(edge.source)) {
            adjList.set(edge.source, []);
        }
        adjList.get(edge.source).push(edge.target);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        if (!inDegree.has(edge.source)) {
            inDegree.set(edge.source, 0);
        }
    });

    // Find root nodes (courses with no prerequisites)
    const queue = [];
    inDegree.forEach((degree, node) => {
        if (degree === 0) {
            queue.push(node);
            depthMap.set(node, 0);
        }
    });

    // BFS to compute depths
    while (queue.length > 0) {
        const current = queue.shift();
        const currentDepth = depthMap.get(current);
        const neighbors = adjList.get(current) || [];

        neighbors.forEach(neighbor => {
            const newDegree = inDegree.get(neighbor) - 1;
            inDegree.set(neighbor, newDegree);

            if (newDegree === 0) {
                queue.push(neighbor);
                depthMap.set(neighbor, currentDepth + 1);
            }
        });
    }

    return depthMap;
};

/**
 * Group nodes by their depth level
 * 
 * @param {Set} courseNames - Set of all course names
 * @param {Map} depthMap - Map of course names to depth levels
 * @returns {Object} Object with depth levels as keys and arrays of courses as values
 */
export const groupNodesByDepth = (courseNames, depthMap) => {
    const nodesByDepth = {};
    courseNames.forEach(courseName => {
        const depth = depthMap.get(courseName) || 0;
        if (!nodesByDepth[depth]) {
            nodesByDepth[depth] = [];
        }
        nodesByDepth[depth].push(courseName);
    });
    return nodesByDepth;
};

/**
 * Build positioned graph nodes
 * 
 * @param {Object} nodesByDepth - Courses grouped by depth level
 * @returns {Array} Array of node objects for ReactFlow
 */
export const buildGraphNodes = (nodesByDepth) => {
    const graphNodes = [];
    const depths = Object.keys(nodesByDepth).sort((a, b) => a - b);
    
    depths.forEach((depth, depthIndex) => {
        const coursesAtDepth = nodesByDepth[depth];
        const xSpacing = 250;
        const ySpacing = 150;
        const startX = -(coursesAtDepth.length - 1) * xSpacing / 2;

        coursesAtDepth.forEach((courseName, index) => {
            graphNodes.push({
                id: courseName,
                data: { 
                    label: courseName
                },
                position: { 
                    x: startX + index * xSpacing, 
                    y: depthIndex * ySpacing 
                },
                draggable: true,
                className: 'node',
            });
        });
    });

    return graphNodes;
};
