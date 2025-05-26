import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Sparkle } from 'lucide-react';

function Favourite({ houseId }) { 
    const [favourite, setFavourite] = useState([]);
    const authToken = localStorage.getItem("authToken");

    const addToFavourite = async () => {  
        if (!authToken) {
            console.log("No authentication found");
            toast.error("Please log in to add favorites.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/house/addToFavourite", 
                { houseId },  
                {   
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                }
            );

            if (response.data.success) {
                setFavourite((prev) => [...prev, houseId]);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.error);
            }

        } catch (error) {
            console.log("Error while adding to the favourites", error);
            toast.error("Failed to add to favourites");
        }
    };

    return (
        <div>
            <FontAwesomeIcon 
                icon={faStar} 
                onClick={addToFavourite}  
                className='text-gray-500   w-5 hover:text-[#DB9F05] cursor-pointer'

                />
        </div>
    );
}

export default Favourite;
