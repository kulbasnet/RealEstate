import { Link, useNavigate } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserFont() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAgent, setIsAgent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authentication = localStorage.getItem("authToken");
        const agentStat = localStorage.getItem("isAgent") === "true"; // ✅ Fixed conversion

        if (authentication) {
            setLoggedIn(true);
            // setIsAgent(agentStat);
        } else {
            setLoggedIn(false);
            // setIsAgent(false);
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAgent"); 
        setLoggedIn(false);
        setIsAgent(false);
        
        toast.success("Logged out", {
            style: {
                color: "#081740",
                border: "1px solid #081740",
                width: "180px",
                
            },
            iconTheme: {
                primary: "white",
                secondary: "#081740",
            },
        });

        navigate("/login");
    }

    return (
        <div className="relative"> 
            {loggedIn ? (
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                            <FontAwesomeIcon icon={faUser} color="white" className="text-2xl" />
                        </button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent 
                        align="end" 
                        sideOffset={10} 
                        className="w-48 bg-white shadow-lg rounded-lg p-2 z-50" // ✅ Fixed z-index
                    >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {!isAgent && ( 
                            <DropdownMenuItem>
                                <Link to="/userProfile" className="block  text-black hover:bg-gray-100 p-2 rounded">
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem>
                            <Link to='/favouriteHouse' className='block text-black  hover:bg-gray-100 p-2 rounded'>
                            Favourite</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <button 
                                onClick={handleLogout} 
                                className="w-full text-left text-black hover:bg-gray-100 p-2 rounded"
                            >
                                Logout
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link to="/login">
                    <button className="text-white bg-blue-600 px-4 py-2 rounded-md">Login / Join Now</button>
                </Link>
            )}
        </div>
    );
}

export default UserFont;


{/* <Button>
<Plus className="mr-2 h-4 w-4" />
Add Property
</Button> */}