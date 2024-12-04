import React, { useState, useEffect } from 'react';

const FloorPlan6 = ({ addresses,deviceData}) => {
  const [svgContent, setSvgContent] = useState(''); // Store SVG content
  const [selectedRoom, setSelectedRoom] = useState(null); // Store selected room ID
  const [selectedDevice, setSelectedDevice] = useState(''); // Store selected device
  const [devicesInRooms, setDevicesInRooms] = useState([
    // Each device will now have this structure:
    // { 
    //   room: string,
    //   device: string,
    //   status: string,
    //   timestamp: Date,
    //   lastReading: string,
    //   // add any other fields you need
    // }
  ]); // Track placed devices
  const [userPermission, setUserPermission] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
console.log(devicesInRooms,"devicesInRooms")
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserPermission(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch and load the SVG as inline content
    fetch('/Modified-Third-Floor-Layout.svg')
      .then((response) => response.text())
      .then((data) => setSvgContent(data))
      .catch((err) => console.error('Error loading SVG:', err));
  }, []);

  useEffect(() => {
    if (svgContent) {  // Only run after SVG is loaded
      try {
        const savedDevices = localStorage.getItem('devices');
        if (savedDevices) {
          const devicesArray = JSON.parse(savedDevices);
          const svgRoot = document.getElementById('svg-root');
          const svgElement = svgRoot.firstElementChild;

          devicesArray.forEach(deviceInfo => {
            const roomElement = svgRoot.querySelector(`#${deviceInfo.room}`);

            if (roomElement && svgElement) {
              const bbox = roomElement.getBBox();
              const centerX = bbox.x + bbox.width / 2;
              const centerY = bbox.y + bbox.height / 2;

              // Get transformations (same as in handleAddDevice)
              const groupElement = svgElement.querySelector('g');
              let scaleX = 1, scaleY = 1, translateX = 0, translateY = 0;

              if (groupElement) {
                const transform = groupElement.getAttribute('transform');
                if (transform) {
                  const scaleMatch = transform.match(/scale\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
                  if (scaleMatch) {
                    scaleX = parseFloat(scaleMatch[1]);
                    scaleY = parseFloat(scaleMatch[2]);
                  }

                  const translateMatch = transform.match(/translate\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
                  if (translateMatch) {
                    translateX = parseFloat(translateMatch[1]);
                    translateY = parseFloat(translateMatch[2]);
                  }
                }
              }

              const transformedCenterX = centerX * scaleX + translateX;
              const transformedCenterY = centerY * scaleY + translateY;

              // Recreate the device element
              const deviceElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
              
              const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              circle.setAttribute('cx', transformedCenterX);
              circle.setAttribute('cy', transformedCenterY);
              circle.setAttribute('r', '15');
              
              // Set circle color based on stored F value
              if (deviceInfo.deviceData?.F > 0) {
                circle.setAttribute('fill', 'red');
                circle.setAttribute('stroke', 'darkred');
              } else {
                circle.setAttribute('fill', '#7bdba3');
                circle.setAttribute('stroke', 'green');
              }
              circle.setAttribute('stroke-width', '2');

              const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              text.setAttribute('x', transformedCenterX);
              text.setAttribute('y', transformedCenterY);
              text.setAttribute('fill', 'black');
              text.setAttribute('font-size', '10');
              text.setAttribute('text-anchor', 'middle');
              text.setAttribute('dominant-baseline', 'middle');
              text.textContent = deviceInfo.device;

              deviceElement.appendChild(circle);
              deviceElement.appendChild(text);

              // Add hover events
              deviceElement.setAttribute('class', 'device-group');
              deviceElement.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                setTooltip({
                  show: true,
                  content: `Device ID: ${deviceInfo.device}
                            Room: ${deviceInfo.room}
                            Status: ${deviceInfo.status}
                            Last Updated: ${deviceInfo.timestamp}
                            ADD: ${deviceInfo.deviceData?.ADD || 'N/A'}
                            BAN: ${deviceInfo.deviceData?.BAN || 'N/A'}
                            C: ${deviceInfo.deviceData?.C || 'N/A'}
                            F: ${deviceInfo.deviceData?.F || 'N/A'}
                            D: ${deviceInfo.deviceData?.D || 'N/A'}
                            DT: ${deviceInfo.deviceData?.DT || 'N/A'}
                            LAB: ${deviceInfo.deviceData?.LAB || 'N/A'}
                            NAM: ${deviceInfo.deviceData?.NAM || 'N/A'}
                            T: ${deviceInfo.deviceData?.T || 'N/A'}`,
                  x: rect.left,
                  y: rect.top
                });
              });

              deviceElement.addEventListener('mouseleave', () => {
                setTooltip({ show: false, content: '', x: 0, y: 0 });
              });

              svgElement.appendChild(deviceElement);
            }
          });

          setDevicesInRooms(devicesArray);
        }
      } catch (error) {
        console.error('Error recreating devices from localStorage:', error);
      }
    }
  }, [svgContent]); // Run when SVG content is loaded

  const handleRoomClick = (event) => {
    const roomId = event.target.id;
    if (roomId) {
      console.log(`Room clicked: ${roomId}`);
      setSelectedRoom(roomId);
    } else {
      console.log('Clicked outside of a room.');
    }
  };
  const handleAddDevice = () => {
    if (selectedRoom && selectedDevice) {
      const fulldata = deviceData(selectedDevice);
      if (!fulldata) {
        console.log('No data available for device:', selectedDevice);
        return;
      }
      
      console.log('Device', fulldata);
      
      const svgRoot = document.getElementById('svg-root');
      const roomElement = svgRoot.querySelector(`#${selectedRoom}`);
      const svgElement = svgRoot.firstElementChild; // Assuming the first child is the <svg> element
  
      if (roomElement && svgElement) {
        const bbox = roomElement.getBBox();
        console.log(`BBox for ${selectedRoom}:`, bbox);
  
        // Calculate the center of the room
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
  
        // Check for transformations
        const groupElement = svgElement.querySelector('g');
        let scaleX = 1, scaleY = 1, translateX = 0, translateY = 0;
  
        if (groupElement) {
          const transform = groupElement.getAttribute('transform');
          if (transform) {
            const scaleMatch = transform.match(/scale\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
            if (scaleMatch) {
              scaleX = parseFloat(scaleMatch[1]);
              scaleY = parseFloat(scaleMatch[2]);
            }
  
            const translateMatch = transform.match(/translate\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
            if (translateMatch) {
              translateX = parseFloat(translateMatch[1]);
              translateY = parseFloat(translateMatch[2]);
            }
          }
        }
  
        console.log(`Transform - scale(${scaleX}, ${scaleY}), translate(${translateX}, ${translateY})`);
  
        // Apply transformations to the center coordinates
        const transformedCenterX = centerX * scaleX + translateX;
        const transformedCenterY = centerY * scaleY + translateY;
  
        console.log(`Transformed Center coordinates: (${transformedCenterX}, ${transformedCenterY})`);
  
        // Create a circle with the device name
        const deviceElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', transformedCenterX);
        circle.setAttribute('cy', transformedCenterY);
        circle.setAttribute('r', '15');
        
        // Check F value and set circle color accordingly
        if (fulldata?.F > 0) {
          circle.setAttribute('fill', 'red');
          circle.setAttribute('stroke', 'darkred');
        } else {
          circle.setAttribute('fill', '#7bdba3');
          circle.setAttribute('stroke', 'green');
        }
        circle.setAttribute('stroke-width', '2');
  
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', transformedCenterX);
        text.setAttribute('y', transformedCenterY);
        text.setAttribute('fill', 'black');
        text.setAttribute('font-size', '10');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = selectedDevice;
        console.log(selectedDevice,"selectedDevice")
  
        // Append circle and text to the group
        deviceElement.appendChild(circle);
        deviceElement.appendChild(text);
  
        // Add hover events to the device group
        deviceElement.setAttribute('class', 'device-group');
        const newDevice = {
          room: selectedRoom,
          device: selectedDevice,
          status: 'Active',
          timestamp: new Date().toISOString(),
          lastReading: 'No reading yet',
          deviceData: fulldata
        };
        deviceElement.addEventListener('mouseenter', (e) => {
          const deviceInfo = devicesInRooms.find(d => d.device === selectedDevice) || newDevice;
        
          const rect = e.target.getBoundingClientRect();
          setTooltip({
            show: true,
            content: `Device ID: ${deviceInfo.device}
                      Room: ${deviceInfo.room}
                      Status: ${deviceInfo.status}
                      Last Updated: ${deviceInfo.timestamp}
                      ADD: ${deviceInfo.deviceData?.ADD || 'N/A'}
                      BAN: ${deviceInfo.deviceData?.BAN || 'N/A'}
                      C: ${deviceInfo.deviceData?.C || 'N/A'}
                      F: ${deviceInfo.deviceData?.F || 'N/A'}
                      D: ${deviceInfo.deviceData?.D || 'N/A'}
                      DT: ${deviceInfo.deviceData?.DT || 'N/A'}
                      LAB: ${deviceInfo.deviceData?.LAB || 'N/A'}
                      NAM: ${deviceInfo.deviceData?.NAM || 'N/A'}
                      T: ${deviceInfo.deviceData?.T || 'N/A'}`,
            x: rect.left,
            y: rect.top
          });
        });
        
        deviceElement.addEventListener('mouseleave', () => {
          setTooltip({ show: false, content: '', x: 0, y: 0 });
        });
  
        // Add to the SVG
        svgElement.appendChild(deviceElement);
  
        // Update state
        setDevicesInRooms(prev => [...prev, newDevice]);
  
        // Store in localStorage
        const updatedDevices = [...devicesInRooms, newDevice];
        localStorage.setItem('devices', JSON.stringify(updatedDevices));
  
        // Reset selections
        setSelectedRoom(null);
        setSelectedDevice('');
      } else {
        console.error('Room or SVG element not found.');
      }
    } else {
      console.log('Room or device not selected.');
    }
  };
  

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h1>SVG Room Device Mapper</h1>

      {/* SVG Rendering */}
      <div
        id="svg-root"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          width: '100%',
          height: '100vh', // Full viewport height
          overflow: 'hidden', // Prevent overflow
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
        }}
        onClick={handleRoomClick}
      ></div>

      {/* Device Selection */}
      {userPermission && userPermission.role === "admin" && (
        <div style={{ marginTop: '20px' }}>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="">Add Device</option>
            {addresses && addresses.length > 0 ? (
              addresses.map((device, index) => (
                <option key={index} value={device}>
                  {device}
                </option>
              ))
            ) : (
              <option value="">No devices available</option>
            )}
          </select>
          <button onClick={handleAddDevice} style={{ marginLeft: '10px' }}>
            Add
          </button>
        </div>
      )}

      {/* Add tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x + 20}px`,
            top: `${tooltip.y + 20}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '14px',
            zIndex: 1000,
            whiteSpace: 'pre-line',
            pointerEvents: 'none'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default FloorPlan6;


