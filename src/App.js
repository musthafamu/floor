import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from  './pages/Login';
import Home from './pages/Home';


function App() {
  return (
    <Router>

        {/* <Main/> */}
      <Routes>
        {/* Define the home route */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/floor3" element={<Main />} />
        <Route path="/floor4" element={<Main />} />
        <Route path="/floor5" element={<Main />} />
        <Route path="/floor6" element={<Main />} />

        
      </Routes>
      {/* route is completed */}
    </Router>
  );
}

export default App;
