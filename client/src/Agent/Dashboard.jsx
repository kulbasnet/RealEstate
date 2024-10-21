import React, { useState } from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import AgentHouse from '../Components/AgentHouse';
import Add from '../Components/Add';

function Dashboard() {
  const [seen, setSeen] = useState(false);

 function handleToggle(){
  setSeen(!seen);
 }

 function closeToggle(){
  setSeen(false);
 }



  return (  
    <div>
      <button className='addbutton-agent' onClick={handleToggle}> Add New <FontAwesomeIcon icon={faPlus} /> </button>
      {seen ? <Add /> : ''}
      {seen && <Add onclose={closeToggle}/>}
      <AgentHouse/>
      
    </div>
  )
}

export default Dashboard
