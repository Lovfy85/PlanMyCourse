import { useState } from 'react'
import './ProgressBar'

const calculatePercentage = (completed = 0, total = 0) => {
    if (total === 0) return 0;
    return Math.min(100, Math.max(0, (completed / total) * 100));
};

function ProgressBar({completed, total}) {
    const percentage = calculatePercentage(completed, total);

    return (
    <div className="accordion-progress-bar">
        <div className="accordion-progress-fill" style={{ width: `${percentage}%` }} />
        <span className="accordion-progress-text">{Math.floor(percentage)}% completed</span>
    </div>
  );
};

export default ProgressBar;