import React from 'react'
import { useNavigate } from 'react-router-dom'
import background from '../Asset/images/home.jpeg'
import './Home.css'
function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="button-container">
      <h1 className='title'>Fire Alaram work station</h1>
        <button className="home-btn" onClick={() => navigate('/floor4')}>floor 4</button>
        <button className="home-btn" onClick={() => navigate('/floor3')}>floor 3</button>
        <button className="home-btn" onClick={() => navigate('/floor5')}>floor 5</button>
        <button className="home-btn" onClick={() => navigate('/floor6')}>floor 6</button>
      </div>
    </div>
  )
}

export default Home