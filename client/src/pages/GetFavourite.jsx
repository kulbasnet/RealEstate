import Favourite from '@/components/Favourite';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function GetFavourite() {
  const [house, setHouse] = useState([]);

  useEffect(() => {
    const getFavouriteHouse = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No Authentication Found");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/house/favouriteHouse", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          console.log(response.data.data); // Fix: Correct key is `data`
          setHouse(response.data.data || []);
        } else {
          console.log(response.data.error);
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    };

    getFavouriteHouse();
  }, []);

  return (
    <div className='flex justify-start gap-10 mt-[160px] ml-[70px]'>
      {house.length > 0 ? (
        house.map((houses) => (
          <Card key={houses._id} className="h-[300px] min-w-[280px] w-[190px] ">
            <img src={houses.img} className='ml-[60px] h-[120px] mt-4' /> 
            
            <Favourite houseId={houses._id} /> 
            <CardTitle>Location: {houses.location}</CardTitle>
            <CardDescription>Price: {houses.price}</CardDescription>
            <CardDescription>Size: {houses.size}</CardDescription>
            <CardDescription>Property Number: {houses.propertyNumber}</CardDescription>
            <CardDescription> Property Type:   {houses.propertyType}</CardDescription>
            {/* <CardDescription>{houses.listedBy}</CardDescription> */}
            <CardDescription>Bedroom: {houses.Bedroom}</CardDescription>
            <CardDescription>Bathrooms: {houses.Bathrooms}</CardDescription>
            <CardDescription>Status: {houses.status}</CardDescription>





          </Card>
        ))
      ) : (
        <p>You have not yet added any houses to favorites.</p>
      )}
    </div>
  );
}

export default GetFavourite;
