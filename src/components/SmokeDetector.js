import React from 'react';
import './SmokeDetector.css';

function SmokeDetector({ onActivate, fValue }) {
  // Determine the smoke color based on the "F" value of the specific device
  const smokeColor = fValue === "0-" ? "#50b380" : "red"; // Green for "0-", Red for other values

  return (
    <div className="smoke-detector">
      <div className="detector">
        <div className="smoke" style={{ backgroundColor: smokeColor }}></div>
      </div>
      <button onClick={onActivate}>Activate Smoke Detector</button>
    </div>
  );
}

export default SmokeDetector;

