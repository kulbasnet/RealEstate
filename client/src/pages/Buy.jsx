import React, { useState } from 'react'
import Card from '../components/Card'
import { Input } from 'postcss';
import axios from 'axios';
import { useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import Map from '@/components/HouseMap';

function Buy() {
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


  const handleSearch = async(input)=>{
    if(!input){
      const response = await axios.get("http://localhost:8000/house/gethouse");
      console.log(response.data.houses);
      setHouses(response.data.houses);
      return;
    }

    try{
      const response= await axios.get("http://localhost:8000/house/searchhouse",{
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
      <div className='flex'>
      <div className='fixed '>
      <Map houses={houses}/>
      </div>

          <div className='ml-[820px]'>
          <Card houses={houses}/>   
          </div>
          </div>
     

  </>
      
      
  )
}
export default Buy
