import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GetinTouch from './GetinTouch';
import Favourite from './Favourite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import HouseMap from './HouseMap';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import CardSkeleton from './CardSkeleton';
// import { Card } from './ui/card';



function Card({position}) {
    const [houses, setHouses] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState(null); 
    const [isloading , setLoading] = useState(true);
    // const authToken = localStorage.getItem('authToken'); z
    const[sort, setSort] = useState("asc");
    const [filtered, setFiltered] = useState({
        status:"",
        propertyType:""

    })
    // const touchRef = useRef(null);



    const sortedHouse = [...houses].sort((a,b) =>{
        return sort === "asc" ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location);
    })

    // const scrolltoTouchRef=()=>{
    //     touchRef.current?.scrollIntoView({behavior : "smooth"});
    // }
    

    useEffect(() => {
        const houseFilter = async () => {
            // const token = localStorage.getItem('authToken');
            // e.preventDefault();
            try {
                const response = await axios.get("http://localhost:8000/house/houseFilter",{
                    params:{
                        status: filtered.status,
                        propertyType: filtered.propertyType

                    }
                });
                console.log(response.data.data);
                setHouses(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Sorry, something went wrong:", error.message);
            }
        };

       

        houseFilter();
    }, [filtered.status, filtered.propertyType]);



    const handleCardClick = (house) => {
        setSelectedHouse(house); 
    };

    const handleBackClick = () => {
        setSelectedHouse(null); 
    };


    const handleFilterChange=(type, value)=>{
        setFiltered(prev=>({...prev, [type]: value}));

    }

    return (<>
    <div className='flex ml-[190px]'>
    <div className='flex items-center font-abyssinica justify-end mr-[20px] mt-[130px] h-[20px]  '>
        <Select onValueChange={value=> handleFilterChange("status", value)} >
            <SelectTrigger className="w-[120px] border-gray-300">
                <SelectValue placeholder="STATUS "/>

            </SelectTrigger>
            <SelectContent>
                {/* <SelectItem value="">All</SelectItem> */}
                <SelectItem value="Rent">For Rent</SelectItem>
                <SelectItem value="Sale">For Sale</SelectItem>

            </SelectContent>
        </Select>
    </div>

    <div className='flex items-center gap-4 font-abyssinica justify-end mr-[20px] mt-[130px] h-[20px] '>
         <Select onValueChange={value => handleFilterChange("propertyType", value)} >
            <SelectTrigger className="w-[160px] border-gray-300">
                <SelectValue placeholder="PROPERTY TYPE"/>

            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Land">Land</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="House">House</SelectItem>



            </SelectContent>
        </Select>

    </div>
            <div className="flex items-center gap-4 font-abyssinica justify-end mr-[20px] mt-[130px] h-[20px]  ">
        <Select defaultValue="a-z" onValueChange={(value)=> setSort(value ==="z-a" ? "desc" : "asc" )}>
          <SelectTrigger className="w-[160px] border-gray-300">
            <SelectValue placeholder="SORT: SORT A-Z" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a-z">SORT: SORT A-Z</SelectItem>
            <SelectItem value="z-a">SORT: SORT Z-A</SelectItem>
          </SelectContent>
        </Select>
        
      </div>


    </div>



        <div className=' flex flex-wrap  gap-9 w-[700px] h-auto mt-2 mb-10'>
            {isloading && Array(4).fill(0).map((_, index)=> <CardSkeleton key={index} />)}
        {sortedHouse.length > 0 ? (
            sortedHouse.map((house, index) => (
                <div
                    key={index}
                    className='h-[300px] w-[280px] shadow-lg ml-9 mt-8 '
                    onClick={() => handleCardClick(house)}
                >
                    <img src={house.img} alt='house' className='w-full h-48 mb-2 object-cover'/>
                    <Favourite houseId={house._id} key={house._id}/>
                    <h3 className='card-title'>{house.location}</h3>
                    <p className='card-details'>Price: {house.price} </p>
                    <p className='card-details'>Size: {house.size} Anna</p>
                </div>
            ))
        ) : (
            <p className='mt-[200px] ml-[200px] '>No houses available</p>
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
                    <Favourite houseId={selectedHouse._id} />

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


                    <HouseMap position={[selectedHouse.latitude, selectedHouse.longitude]} houses={[selectedHouse]} />
  
                    <GetinTouch  house={selectedHouse}  />
                </div>
            </div>
        )}
    </div>    

    </>
    );
}

export default Card;
