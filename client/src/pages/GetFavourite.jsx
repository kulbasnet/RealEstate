import Favourite from '@/components/Favourite';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import HouseMap from '@/components/HouseMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GetinTouch from '../components/GetinTouch';



function GetFavourite({position}) {
  const [house, setHouse] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null); 
  

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
          console.log(response.data.data); 
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


    const handleCardClick = (houses) => {
        setSelectedHouse(houses); 
    };

    const handleBackClick = () => {
        setSelectedHouse(null); 
    };






  return (<>
  <div className='mt-[150px]  ml-[110px]'>
              <h1 className='text-3xl font-bold text-[#dba829]'>Favourites</h1>

  </div>

        <div className='flex justify-start gap-5 mt-[10px] ml-[70px]'>
      {house.length > 0 ? (
        house.map((houses, index) => (
          <Card key={houses._id || index} 
          className="h-[300px] min-w-[280px] shadow-lg ml-9 mt-8  "
          onClick={()=> handleCardClick(houses)}
          
          
          >
            <img src={houses.img} className='w-full h-48 mb-2 object-cover' /> 
           <div  className='flex justify-end mr-3'
>
             <Favourite houseId={houses._id} /> 
                                </div>

            <CardTitle className="ml-3"> {houses.location}</CardTitle>
            <CardDescription className="ml-3">Price: {houses.price}</CardDescription>
            <CardDescription className="ml-3" >Size: {houses.size}</CardDescription>
         

          </Card>
        ))
      ) : (
        <p>You have not yet added any houses to favorites.</p>
      )}


              {selectedHouse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="relative max-w-4xl w-full max-h-[98vh] bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
                    <button
                        onClick={handleBackClick}
                        className="absolute top-4 left-4 text-gray-600 hover:text-black text-xl"
                    >
                        <FontAwesomeIcon icon={faLongArrowLeft} />
                    </button>

                    <img src={selectedHouse.img} alt="House" className="w-full h-[305px] mt-9 mb-5 object-cover rounded-lg" />
                    <div className='flex justify-end mr-3'>
                    <Favourite houseId={selectedHouse._id} />

                        </div>

                    <h2 className="text-2xl font-bold mt-11">{selectedHouse.location}</h2>

                    <div className="flex justify-end items-center mt-2">
                    <img src={selectedHouse.listedBy?.img || "No"} className="w-16 h-16 rounded-full object-cover ml-[]"/>
                        <button className='bg-[#081740] text-white hover:bg-[#b98604] border rounded w-[120px] h-10 ' onClick={()=>{
                            document.getElementById("getInTouchSection")?.scrollIntoView({
                                behavior:"smooth",
                                block:"start",
                            })
                        }}>Book an agent</button>


                    </div>
                    <p className="text-lg">PRICE: <span className="font-semibold">Rs. {selectedHouse.price}</span></p>
                        <p className="text-lg">SIZE: <span className="font-semibold">{selectedHouse.size} Anna</span></p>

                    <p className="mt-2">PROPERTY ID: {selectedHouse.propertyNumber}</p>
                    <p className="mt-2">PROPERTY TYPE: {selectedHouse.propertyType}</p>
                    <p className="mt-2">Status: {selectedHouse.status}</p>
                    <p className="mt-2">Listed by: {selectedHouse.listedBy?.name || "Anonymous"}</p>
                    {/* <p className="mt-2">Phone Number : {selectedHouse.listedBy?.email || "Anonymous"}</p> */}


                    {/* <HouseMap position={[selectedHouse.latitude, selectedHouse.longitude]} houses={[selectedHouse]} onHouseClick={handleCardClick} /> */}
  
                    <GetinTouch  house={selectedHouse}  />
                </div>
            </div>
        )}





    </div>






  </>
  );
}

export default GetFavourite;
