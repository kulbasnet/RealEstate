import React, { useState } from 'react'
import Card from '../Components/Card'
import axios from 'axios';
import { useEffect } from 'react';
import SearchBar from '@/Components/SearchBar';
import Map from '@/Components/HouseMap';

function Buy({onHouseSelect}) {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null); // State for selected house


  useEffect(() => {
      const getHouses = async () => {
          // const token = localStorage.getItem('authToken');
          // e.preventDefault();
          try {
              const response = await axios.get("/house/gethouse");
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


  const handleSearch = async(input)=>{
    if(!input){
      const response = await axios.get("/house/gethouse");
      console.log(response.data.houses);
      setHouses(response.data.houses);
      return;
    }

    try{
      const response= await axios.get("/house/searchhouse",{
        params:{location : input}
      });
      console.log(response.data);
      if(response.data.success){
        setHouses(response.data.houses);
      }else{
        console.log("error:", response.error);
      }

    }catch(error){
      console.error("Error: ", error);

    }
  }


  return (<>
  {/* <div className='mt-20'><SearchBar/></div> */}
      <div className="min-h-screen overflow-x-hidden">
        {/* Desktop/tablet: fixed left half. Phones: stacked on top, pushed below the 100px navbar. */}
        <div className="isolate fixed left-0 top-0 h-screen w-1/2 max-md:relative max-md:mt-[100px] max-md:h-[50vh] max-md:w-full">
          <Map houses={houses} className="h-full w-full" />
        </div>

        {/* Desktop/tablet: right half that scrolls on its own. Phones: full width below the map. */}
        <div className="ml-[50%] h-screen w-1/2 overflow-y-auto overflow-x-hidden overscroll-contain max-md:ml-0 max-md:h-auto max-md:w-full max-md:overflow-visible">
          <Card houses={houses} onHouseSelect={onHouseSelect} />
        </div>
      </div>
     

  </>
      
      
  )
}
export default Buy