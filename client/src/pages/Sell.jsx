import React from 'react'
// import agent from "./agent.jpg"
// import office from './office.jpg'
import { useNavigate } from 'react-router-dom'
function Sell() {

  const navigate = useNavigate();

  function handleClick(){
    navigate('/agent');
    
  }

  return (
    <div>
      <div className='heading-sale'>
      <h1  className='text-shadow'>Sell With Us</h1>
      <h2 className='heading-para'>Your Properties deserves extra-oridinary marketing</h2>
      </div>
      <div className='main-card'>
      <div className='sell-card'>
        {/* <img src={agent} alt='agent' className='card2-img'/> */}
        <h4>Meet your Local Agent</h4>
        <p>Our local real estate professionals use their market expertise to create a customized plan for your home. Find an agent nearby to benefit from their local knowledge.</p>
      <button onClick={handleClick} className='sellcard-but'>FIND YOUR AGENT</button>
      </div>

      <div className='sell-card2'>
        {/* <img src={office} alt='agent' className='card2-img'/> */}
        <h4 >Access our exceptional Service</h4>
        <p>With a global team of experts, we have a local presence worldwide. Our local brokerage offices combine cutting-edge technology and exceptional service to enhance your property.</p>
       <button className='sellcard1-but'>CONTACT YOUR LOCAL OFFICE</button>
      </div>
      </div>

      
        
        
      
    </div>
  )
}

export default Sell;
