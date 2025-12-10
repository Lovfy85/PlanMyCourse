import { useEffect, useRef, useState } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import GraphFlow from '../Graph/GraphFlow';
import AlternativeSelector from '../Graph/AlternativeSelector';
import MessagePopup from '../MessagePopup/MessagePopup';
import { useGraphData } from '../../app/pages/useGraphData';
import alternativesData from '../../app/pages/alternatives.json';
import './GraphPopup.css';

function GraphPopupContent({ isOpen, onClose, courseId, user }) {
    const { fitView } = useReactFlow();
    const { nodes, edges, handleSearch, setQuery, replaceNode } = useGraphData(fitView);
    const hasSearched = useRef(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showAuthMessage, setShowAuthMessage] = useState(false);

    useEffect(() => {
        if (isOpen && courseId && !hasSearched.current) {
            // Automatically search for the course when popup opens
            setQuery(courseId);
            setTimeout(() => {
                handleSearch();
                hasSearched.current = true;
            }, 100);
        }
        
        if (!isOpen) {
            hasSearched.current = false;
            setSelectedNode(null);
            setShowAuthMessage(false);
        }
    }, [isOpen, courseId, handleSearch, setQuery]);

    // Handle node click to show alternatives
    const handleNodeClick = (event, node) => {
        const courseName = node.id;
        
        // Find which courses have this node as a prerequisite
        const dependentCourses = edges.filter(edge => edge.source === courseName);
        
        // Edge Case. check if alternative prerequisites exist
        if (dependentCourses.length === 0) {
            return;
        }
        
        // For each dependent course, check if there are alternative prerequisites
        const alternatives = [];
        dependentCourses.forEach(edge => {
            const targetCourse = edge.target;
            const targetData = alternativesData.courseAlternatives[targetCourse];
            
            if (targetData && targetData.alternatives && targetData.alternatives.length > 1) {
                // Find which alternative group contains the current course
                const currentGroupIndex = targetData.alternatives.findIndex(altGroup => 
                    altGroup.includes(courseName)
                );
                
                if (currentGroupIndex !== -1) {
                    // Get all OTHER alternative groups
                    targetData.alternatives.forEach((altGroup, index) => {
                        if (index !== currentGroupIndex) {
                            // Add all courses from other alternative groups
                            altGroup.forEach(altCourse => {
                                if (!alternatives.includes(altCourse)) {
                                    alternatives.push(altCourse);
                                }
                            });
                        }
                    });
                }
            }
        });
        
        if (alternatives.length > 0) {
            // Check authentication before showing alternatives
            if (!user) {
                setShowAuthMessage(true);
                return;
            }
            setSelectedNode({ ...node, alternativesList: alternatives });
        }
    };

    // Handle selecting an alternative to replace the current node
    const handleSelectAlternative = (oldCourse, newCourse) => {
        replaceNode(oldCourse, newCourse);
        setSelectedNode(null);
    };

    // Get alternatives for selected node
    const getAlternatives = () => {
        if (!selectedNode || !selectedNode.alternativesList) return null;
        // Return as array of arrays to match expected format
        return selectedNode.alternativesList.map(alt => [alt]);
    };

    if (!isOpen) return null;

    let graphContent;
    if (nodes.length > 0) {
        graphContent = <GraphFlow nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />;
    } else {
        graphContent = <div className="popup-loading">Loading graph...</div>;
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>Prerequisite Graph: {courseId?.toUpperCase()}</h2>
                    <button className="popup-close" onClick={onClose}>×</button>
                </div>
                <div className="popup-body">
                    {graphContent}
                    <AlternativeSelector
                        selectedNode={selectedNode}
                        alternatives={getAlternatives()}
                        onSelectAlternative={handleSelectAlternative}
                        onClose={() => setSelectedNode(null)}
                    />
                    
                    {/* Authentication message popup */}
                    <MessagePopup
                        isOpen={showAuthMessage}
                        onClose={() => setShowAuthMessage(false)}
                        title="Authentication Required"
                        message="Must be logged in to switch prerequisites"
                        buttonText="OK"
                    />
                </div>
            </div>
        </div>
    );
}

function GraphPopup({ isOpen, onClose, courseId, user }) {
    return (
        <ReactFlowProvider>
            <GraphPopupContent 
                isOpen={isOpen} 
                onClose={onClose} 
                courseId={courseId} 
                user={user}
            />
        </ReactFlowProvider>
    );
}

export default GraphPopup;