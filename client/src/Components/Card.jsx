import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GetinTouch from './GetinTouch';
import Favourite from './Favourite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Card() {
    const [houses, setHouses] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState(null); // State for selected house
    // const authToken = localStorage.getItem('authToken'); 
    

    useEffect(() => {
        const getHouses = async () => {
            // const token = localStorage.getItem('authToken');
            // e.preventDefault();
            try {
                const response = await axios.get("http://localhost:8000/house/gethouse");
                console.log(response.data.houses);
                setHouses(response.data.houses);
            } catch (error) {
                console.error("Sorry, something went wrong:", error.message);
            }
        };

        // if (authToken) {
        //     getHouses();
        // } else {
        //     console.log("No authentication token found");
        
        // }

        getHouses();
    }, []);

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
                                        <img src={selectedHouse.img} alt='House' className='inside-img-card' />
                                        <h2>{selectedHouse.location}</h2>
                                        <div className='button-back'> 
                                        <button onClick={handleBackClick} className='back'><FontAwesomeIcon icon={faLongArrowLeft}/></button>
                                        <Favourite houseId={selectedHouse._id} />


                                        </div>
                    <p  className='select-name'> {selectedHouse.location}</p>
                    <p className='select-price'>PRICE<br/> Rs. {selectedHouse.price}</p>
                    <p className='select-size'>SIZE<br/> {selectedHouse.size} Anna</p>
                    <p className='select-number' >PROPERTY ID<br/> {selectedHouse.propertyNumber}</p>
                    <p  className='select-type'>PROPERTY TYPE<br/> {selectedHouse.propertyType}</p>

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
                            {/* <img src={house.img} alt='House' className='img-card' /> */}
                            <img src={house.img} alt='house' className='img-card'/>
                            
                            <Favourite houseId={house._id} key={house._id}/>
                            <h3 className='card-title'>{house.location}</h3>
                            <p className='card-details'>Price: {house.price} </p>
                            <p className='card-details'>Size: {house.size} Anna</p>


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
