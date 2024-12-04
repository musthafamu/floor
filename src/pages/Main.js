import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FloorPlan from '../components/FloorPlan';
import SmokeDetector from '../components/SmokeDetector';
import { db, collection, getDocs, onSnapshot } from "../Firebase/Firestore";
import '../App.css';
import FloorPlan4 from '../components/FloorPlan4';
import FloorPlan5 from '../components/FloorPlan5';
import FloorPlan6 from '../components/FloorPlan6';

function Main() {
  const [alarmActivated, setAlarmActivated] = useState(false);
  const [fValue, setFValue] = useState("0-");
  const [devices, setDevices] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [deviceDataMap, setDeviceDataMap] = useState({});
  const location = useLocation();

  const fetchAllDeviceNames = async () => {
    const devicesRef = collection(db, 'devices');
    const querySnapshot = await getDocs(devicesRef);
    const fetchedAddresses = querySnapshot.docs
      .map(doc => doc.id)
      .filter(address => typeof address === 'string');

    setAddresses(fetchedAddresses);
  };

  const handleActivation = () => {
    setAlarmActivated(true);
  };

  const fetchSpecificDeviceData = (deviceId) => {
    return deviceDataMap[deviceId];
  };

  useEffect(() => {
    const devicesRef = collection(db, 'devices');
    const unsubscribe = onSnapshot(devicesRef, (snapshot) => {
      const newDeviceDataMap = {};
      snapshot.docs.forEach((doc) => {
        newDeviceDataMap[doc.id] = doc.data();
      });
      setDeviceDataMap(newDeviceDataMap);
    });

    fetchAllDeviceNames();

    return () => unsubscribe();
  }, []);

  const renderFloorPlan = () => {
    switch (location.pathname) {
      case '/floor4':
        return <FloorPlan4 addresses={addresses} deviceData={fetchSpecificDeviceData} />;
      case '/floor5':
        return <FloorPlan5 addresses={addresses} deviceData={fetchSpecificDeviceData} />;
      case '/floor6':
        return <FloorPlan6 addresses={addresses} deviceData={fetchSpecificDeviceData} />;
      default:
        return <FloorPlan addresses={addresses} deviceData={fetchSpecificDeviceData} />;
    }
  };

  return (
    <div className="App">
      <h1>Architectural Floor Plan with Smoke Detector</h1>
      {renderFloorPlan()}
      <SmokeDetector onActivate={handleActivation} fValue={fValue} />
    </div>
  );
}

export default Main;
