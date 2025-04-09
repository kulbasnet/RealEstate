import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {  useNavigate } from 'react-router-dom';

function SearchBar({searchInput, setSearchInput, onSearch}) {
    // const [input, setInput] = useState('');
    const navigate = useNavigate();
    // const [houses, setHouses] = useState([]);

  

    //     const searchHouse = async () => {
    //         // const token = localStorage.getItem("authToken");
    //         try {
    //             const response = await axios.get("http://localhost:8000/house/searchhouse", {
    //                 params: { location: input }
    //             });
    
    //             console.log(response.data);
    //             if (response.data.success) {
    //                 setHouses(response.data.houses);
    //             } else {
    //               console.error(response.data);
    //             }
    
    //         } catch (error) {
    //             console.error("Error occurred:", error.message);
    //         }
    //     };

       
    // function handleInput(e) {
    //     setInput(e.target.value);
    // }

    // function handleClick(e) {
    //     e.preventDefault();
    //     searchHouse();
    // }


    const handleClick = async(e)=>{
        e.preventDefault();
        await onSearch(searchInput);
        navigate('/');
        
        

    }





    return (
        <div>

<div className="relative max-w-2xl w-full mx-auto">
      <Input
        type="text"
        placeholder="Enter an address or location"
        onChange={(e)=> setSearchInput(e.target.value)}
        className="bg-white pl-4 pr-12 py-6  placeholder:text-base font-abyssinica  border shadow-sm  h-[60px] w-[500px]"
      />
 <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-transparent"
        onClick={handleClick}
      >
        <Search className="h-5 w-5 text-gray-500" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
            {/* {houses.length>0 ? (houses.map((house,index)=>{
                <div key={index} className='house-card'>
                    <h3>{house.location}</h3>
                    <p>{house.price}</p>

                    </div>
            })):
            (
                <p>No such houses</p>
                
            )} */}

        </div>
    );
}

export default SearchBar;
