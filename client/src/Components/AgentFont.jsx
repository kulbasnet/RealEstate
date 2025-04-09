import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
function AgentFont() {
    const [logged, setLogged] = useState(false);
    const [seen, setSeen] = useState(false);
    const [isAgent, setIsAgent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const agentStatus = localStorage.getItem("isAgent") === "true"; // Ensure it is converted to boolean

        if (token) {
            setLogged(true);
            setIsAgent(agentStatus); 
        } else {
            setLogged(false);
            setIsAgent(false);
        }
    }, []);

    function handleClick() {
        setSeen(!seen);
    }

    function handleLogout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAgent"); 
        setLogged(false);
        setIsAgent(false);
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

    return (
        <div className="relative">
            {logged && isAgent ? (
                <div className="relative">
                    <FontAwesomeIcon 
                        icon={faUser} 
                        color='white' 
                        className="cursor-pointer text-2xl"
                        onClick={handleClick} 
                    />
                    {seen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-10">
                            <ul className="text-black">
                                <li>
                                    <Link 
                                        to={'/agentProfile'} 
                                        className="block px-4 py-2 hover:bg-gray-200"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={handleLogout} 
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <Link to={'/login'}>
                    <button className="bg-[#081740] text-white px-4 py-2 rounded-lg">
                        Login / Join Now
                    </button>
                </Link>
            )}
        </div>
    );
}

export default AgentFont;
