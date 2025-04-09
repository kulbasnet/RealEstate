import React, { useEffect, useState } from 'react'
import AgentHouse from '../components/AgentHouse';
import Add from '../components/Add';
import { Plus } from 'lucide-react';

function Dashboard() {
  const [seen, setSeen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(()=>{
    const token = localStorage.getItem("authToken");
    console.log("token:::",token);
    if(token){
      setLoggedIn(true);

    }

  })


 function handleToggle(){
  setSeen(!seen);
 }

 function closeToggle(){
  setSeen(false);
 }



  return (  
    <div>
      {loggedIn ? ( <>
        <div>
          <div className='flex justify-end mr-[45px] mt-11'>
          <button className='inline-flex items-center px-4 py-2 border-2 border-primary text-primary rounded-lg
        hover:bg-primary hover:text-[#b98604] transition-all duration-100 
        font-medium group'
        onClick={handleToggle}>            
        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200"/>Add New  </button>
          </div>
        {seen ? <Add /> : ''}
        {seen && <Add onclose={closeToggle}/>}
        <AgentHouse/> </div>
        
    
      </>
        
      ):(<div>
        <p>Please be logged in</p>
        </div>)
      
    }
      
      
    </div>
  )
}

export default Dashboard
