import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function Favourite({ houseId }) {  // Accept houseId as a prop
    const [favourite, setFavourite] = useState([]);
    const authToken = localStorage.getItem("authToken");

    const addToFavourite = async () => {  // Remove parameter, use houseId from props
        if (!authToken) {
            console.log("No authentication found");
            toast.error("Please log in to add favorites.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/house/addToFavourite", 
                { houseId },  // Use houseId from props
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
                onClick={addToFavourite}  // Correct function call
                className='star-card' 
            />
        </div>
    );
}

export default Favourite;
