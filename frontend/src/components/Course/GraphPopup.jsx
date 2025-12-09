import { useEffect, useRef } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import GraphFlow from '../Graph/GraphFlow';
import { useGraphData } from '../../app/pages/useGraphData';
import './GraphPopup.css';

function GraphPopupContent({ isOpen, onClose, courseId }) {
    const { fitView } = useReactFlow();
    const { nodes, edges, handleSearch, setQuery } = useGraphData(fitView);
    const hasSearched = useRef(false);

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
        }
    }, [isOpen, courseId, handleSearch, setQuery]);

    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>Prerequisite Graph: {courseId}</h2>
                    <button className="popup-close" onClick={onClose}>×</button>
                </div>
                <div className="popup-body">
                    {nodes.length > 0 ? (
                        <GraphFlow nodes={nodes} edges={edges} />
                    ) : (
                        <div className="popup-loading">Loading graph...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function GraphPopup({ isOpen, onClose, courseId }) {
    return (
        <ReactFlowProvider>
            <GraphPopupContent 
                isOpen={isOpen} 
                onClose={onClose} 
                courseId={courseId} 
            />
        </ReactFlowProvider>
    );
}

export default GraphPopup;