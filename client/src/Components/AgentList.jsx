import axios from 'axios';
import React, { useEffect, useState } from 'react';

function AgentList() {
  const [users, setUsers] = useState([]);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const getUsers = async () => {
      const token = localStorage.getItem('authToken');
    
      try {
        const response = await axios.get("http://localhost:8000/getUser", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userList = response.data.user || [];
        console.log("User list from response:", userList);
        setUsers(userList);
      } catch (error) {
        console.error(`Sorry, some error occurred: ${error.message}`);
      }
    };

    if (authToken) {
      getUsers();
    } else {
      console.error("No authentication found");
    }
  }, [authToken]);

  return (
    <div>
      {users.length > 0 ? (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <div className='agent-name'>Name: {user.name}</div>
              <div className='agent-email'>Email: {user.email}</div>
              <div>Phone Number: {user.phoneNumber}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default AgentList;
