import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function SearchBar() {
    const [input, setInput] = useState('');
    const [houses, setHouses] = useState([]);

  

        const searchHouse = async () => {
            // const token = localStorage.getItem("authToken");
            try {
                const response = await axios.get("http://localhost:8000/house/searchhouse", {
                    params: { location: input }
                });
    
                console.log(response.data);
                if (response.data.success) {
                    setHouses(response.data.houses);
                } else {
                    setHouses([]);
                }
    
            } catch (error) {
                console.error("Error occurred:", error.message);
                setHouses([]);
            }
        };

       
    function handleInput(e) {
        setInput(e.target.value);
    }

    function handleClick(e) {
        e.preventDefault();
        searchHouse();
    }

    return (
        <div>
                        <button onClick={handleClick} className='search-button'><FontAwesomeIcon icon={faSearch} color='white'/></button>

            <input
                className='search'
                type='text'
                value={input}
                onChange={handleInput}
                placeholder='Search...'
            />

        </div>
    );
}

export default SearchBar;
