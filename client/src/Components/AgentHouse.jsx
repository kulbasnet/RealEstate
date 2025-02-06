import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import Delte from './Delte';

function AgentHouse() {
    const [agentHouse, setAgentHouse] = useState([]);

    const getAgentHouse = async () => {
        const token = localStorage.getItem("authToken");
        if(!token){
            console.log("No authentication found");
            return;
        }
        try {
            const response = await Axios.get("http://localhost:8000/house/agentHouse",{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log(response.data.agentHouse);
                setAgentHouse(response.data.agentHouse);
            } else {
                console.log(response.data.error);
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        getAgentHouse(); 
    }, []);

  

    return (
        <div>

            <div className='table'>
            <table>
            <thead>
            <tr>
                <th>Location</th>
                <th>Price</th>
                <th>Size</th>
                <th>Property Number</th>
                <th>Property Type</th>
                <th>Actions </th>
            </tr>
            </thead>
            <tbody>
            {agentHouse.length > 0 ?
                (agentHouse.map((house, index) => (
              <tr key={house._id||index} className='Agent-House'>
                  
                    <td> {house.location}</td>
                     <td>{house.price}</td> 
                     <td> {house.size}</td>   
                     
                     <td>{house.propertyNumber}</td>   
                     <td> {house.propertyType} </td> 
                     <td> <Delte houseId={house._id}/></td>
                  
              </tr>
          ))
         
      )  : (
        <tr>
        <td colSpan="6">No houses found.</td>
    </tr>
            )}
            </tbody>
           
             </table>

        
            </div>
        </div>
    );
}

export default AgentHouse;
