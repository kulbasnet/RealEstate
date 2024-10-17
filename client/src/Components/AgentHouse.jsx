import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Delte from './Delte';

function AgentHouse() {
    const [agentHouse, setAgentHouse] = useState([]);
    const authToken = localStorage.getItem("authToken");

    const getAgentHouse = async () => {
        const token = localStorage.getItem("authToken");
        if(!authToken){
            console.log("No authentication found");
            return;
        }
        try {
            const response = await axios.get("http://localhost:8000/house/agentHouse",{
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
                {/* <th>Gallery</th> */}
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
              <tr key={index} className='Agent-House'>
                  
                 {/* <td><img src='{house.img}' alt='house' width="20px"/></td> */}
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
