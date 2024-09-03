import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Agent() {
  const [users, setUsers] = useState([]);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const getUsers = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get("http://localhost:8000/getUser",{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
        setUsers(response.data.user);
      } catch (error) {
        console.error(`Sorry, some error occurred: ${error.message}`);
      }
    };
    if(authToken){
      getUsers();
      
    }else{
      console.error("No authentication found");

    }

    
  }, [authToken]);
  return (
    <div>
      {users.length > 0 ? (
        users.map((user, index) => (
          <div key={index} className='users'>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            <li>Favourite House:{user.favouriteHouse}</li>
          </div>
        ))
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default Agent;
