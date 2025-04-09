import React, { useEffect, useState } from 'react'
import AgentList from '../components/AgentList'
import agentHouse from './agentHouse.jpg';
import SearchAgent from '@/components/SearchAgent';
import axios from 'axios';
import GetinTouch from '@/components/GetinTouch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

function Agent() {
const [loggedIn, setLoggedIn]= useState(false);
const [agents, setAgents] = useState([]);
const [searchTerm, setSearchTerm]= useState('');  
const [selectedAgent, setSelectedAgent] = useState(null);   


useEffect(()=>{
 const authentication= localStorage.getItem("authToken");

 const getUser = async()=> {

  try{
    const response = await axios.get("http://localhost:8000/getUser", {
      headers:{
        'Authorization' : `Bearer ${authentication}`
      }
    });
  
    setAgents(response.data.user || []);
    console.log("User list", response.data);

  }catch(error){
    console.log("Error fetching", error);
  }
  


 }
 

 if(authentication){
  setLoggedIn(true);
  getUser();
 }
},[]);

const handleSearch = async (term) => {
  if (!term) {
    // If search term is empty, refresh original list
    const token = localStorage.getItem('authToken');
    const response = await axios.get("http://localhost:8000/getUser", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAgents(response.data.user || []);
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get("http://localhost:8000/searchAgent", {
      params: { name: term },
      headers: { Authorization: `Bearer ${token}` }
    });
    setAgents(response.data.agents || []);
  } catch (error) {
    console.error('Search error:', error);
  }
};

  

  return (
    <div>
      {loggedIn ? 
      ( <>
      <div className="relative mt-[100px] flex justify-center">
      <img
        src={agentHouse}
        className="w-full h-[400px] object-cover"
        alt="Real estate agents discussing property"
      />
      <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better text readability */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-semibold font-abyssinica mb-10 text-[#DB9F05] text-center max-w-[1000px] px-[250px]">
          A great agent makes all the difference
        </h1>
        <SearchAgent 
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        
        />
      </div>
    </div>


     

              {selectedAgent ? (
                <div className='flex bg-[#081740]' >
                  <div className='w-[180px] mt-7 mr-10'>
                  <button onClick={() => setSelectedAgent(null)} className=" text-white rounded">
                    <FontAwesomeIcon icon={faLongArrowAltLeft} className='w-10 '/>
                  Back to List
                </button>

                </div>
                <div className='w-[400px] mt-[100px] '>

                <img src={selectedAgent.img} alt={selectedAgent.name} className="w-[300px] h-[300px] object-cover" />
                <h2 className="text-3xl font-serif text-white mt-4">{selectedAgent.name}</h2>
                <p className="text-xl text-white">{selectedAgent.location}</p>
                <p className="text-lg text-white">{selectedAgent.email}</p>
                <p className="text-lg text-white">{selectedAgent.phoneNumber}</p>
                  </div>

               {/* <div className=' mt-[100px] '>
               <GetinTouch/>

               </div>
               */}
              </div>
              


              ):(
                <AgentList agents={agents} onSelectAgent={setSelectedAgent}/>

              )} 

      
      </>

      )
      : ( <div>

        <p>You have to be logged in</p>         </div>

        )
        }
     
    </div>
  )
}

export default Agent
