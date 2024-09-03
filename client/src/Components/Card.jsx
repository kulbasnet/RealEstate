import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GetinTouch from './GetinTouch';
import Favourite from './Favourite';

function Card() {
    const [houses, setHouses] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState(null); // State for selected house
    const authToken = localStorage.getItem('authToken'); 
    

    useEffect(() => {
        const getHouses = async () => {
            const token = localStorage.getItem('authToken');
            // e.preventDefault();
            try {
                const response = await axios.get("http://localhost:8000/house/getHouse", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setHouses(response.data.houses);
            } catch (error) {
                console.error("Sorry, something went wrong:", error.message);
            }
        };

        if (authToken) {
            getHouses();
        } else {
            console.log("No authentication token found");
        }
    }, [authToken]);

    const handleCardClick = (house) => {
        setSelectedHouse(house); // Set the clicked house as selected
    };

    const handleBackClick = () => {
        setSelectedHouse(null); // Deselect house to go back to the list
    };

    return (
        <div className='cards-container'>
            {selectedHouse ? (
                <div className='house-details'>
                    <button onClick={handleBackClick}>Back to list</button>
                    <h2>{selectedHouse.location}</h2>
                    <img src={selectedHouse.img} alt='House' className='img-card' />
                    <p>Price: Rs. {selectedHouse.price}</p>
                    <p>Size: {selectedHouse.size}</p>
                    <p>Description: {selectedHouse.description}</p>
                    <p>Listed By: {selectedHouse.listedBy}</p>
                    <GetinTouch />

                  
                </div>
            ) : (
                houses.length > 0 ? (
                    houses.map((house, index) => (
                        <div 
                            key={index} 
                            className='card' 
                            onClick={() => handleCardClick(house)} // Handle card click
                        >
                            <img src={house.img} alt='House' className='img-card' />
                            <Favourite houseId={house._id}/>
                            <h3 className='card-title'>{house.location}</h3>
                            <p className='card-details'>Price: {house.price}</p>
                            <p className='card-details'>Size: {house.size}</p>
                        </div>
                    ))
                ) : (
                    <p>No houses available</p>
                )
            )}
        </div>
    );
}

export default Card;
