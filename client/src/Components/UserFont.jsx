import { Link, useNavigate } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function UserFont() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [seen, setSeen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authentication = localStorage.getItem("authToken");
        console.log("Auth Token", authentication);

        if (authentication) {
            setLoggedIn(true);
        }
    }, []);

    function handleClick() {
        setSeen(!seen);
    }

    function handleLogout() {
        localStorage.removeItem("authToken");
        setLoggedIn(false);
        toast.success("Logged out", {
            style: {
                color: "#081740",
                border: "1px solid #081740",
                width: "180px",
            },
            iconTheme: {
                primary: '#081740',
                secondary: '#081740',
            }
        });
        navigate('/login');
    }

    function handleToggle() {
        setSeen(!seen);
    }

    return (
        <div>
            {loggedIn ? (
                <div>
                    <FontAwesomeIcon icon={faUser} color='white' onClick={handleClick} />
                    {seen && (
                        <div>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                 <Link to={'/login'}><button onClick={handleToggle}>Login / Join Now</button></Link>
                    
                </div>
            )}
        </div>
    );
}

export default UserFont;
