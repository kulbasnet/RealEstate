import {useNavigate, Link, Navigate  } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import {toast} from 'react-hot-toast';

function UserFont() {
    const [loggedIn ,setLoggedIn] = useState(false);
    const [seen , setSeen ] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const authentication = localStorage.getItem("authToken");
        console.log("Auth Token",authentication);

        if(authentication){
            setLoggedIn(!seen);  
        }
    },[]);

    function handleClick (){
        setSeen(true);

    }

    function handleLogout(){
        localStorage.removeItem("authToken");
        setLoggedIn(false);
        toast.success("Logged out");
        navigate('/login');

    }

  return (
    <div>
        {loggedIn ? (    
            
        <div>
            <FontAwesomeIcon icon={faUser} color='white' onClick={handleClick}/>
            {seen && (
                <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
            )}
            

        </div>
            
    ):
    <Link to={'/login'}> <button>Login</button></Link>

        

}
    </div>
  )
}

export default UserFont;
