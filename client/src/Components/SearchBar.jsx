import axios from 'axios';
import React, { useState } from 'react';

function SearchBar() {
    const [input, setInput] = useState('');
    const [houses, setHouses] = useState([]);

    const searchHouse = async () => {
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
            <input
                className='search'
                type='text'
                value={input}
                onChange={handleInput}
                placeholder='Search...'
            />
            <button onClick={handleClick}>Search</button>

        </div>
    );
}

export default SearchBar;
