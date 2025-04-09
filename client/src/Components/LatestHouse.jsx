import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Favourite from './Favourite';
import { CardTitle, Card, CardDescription } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GetinTouch from './GetinTouch';
import { useNavigate } from 'react-router-dom';
import HouseMap from './HouseMap';
import CardSkeleton from './CardSkeleton';

function LatestHouse() {
    const [latest, setLatest] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isloading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getLatestHouse = async () => {
            try {
                const response = await axios.get("http://localhost:8000/house/getLatestHouse");
                setLatest(response.data.Houses);
                setLoading(false);
            } catch (error) {
                console.log("Sorry", error);
            }
        };

        getLatestHouse();
    }, []);

    return (
    <>  
                    <div className="relative mt-[100px] px-16 ml-[70px] mr-[70px] ">    
                    <div className=' ml-7 mb-6'>
                        <h1 className='font-semibold text-2xl '> Latest House</h1>
                        <p className='text-gray-600 '>Based on uploaded time</p>
                    </div>
        
                    <div className="flex gap-10 overflow-hidden">
                   {isloading && Array(4).fill(0).map((_, index)=> <CardSkeleton key={index} latest={10}/> )  }     
                        {latest.length > 0 ? (
                            latest
                                .slice(currentIndex, currentIndex + 4)
                                .map((house) => (
                                    <Card
                                        key={house._id}
                                        className="h-[300px] min-w-[280px] shadow-lg"
                                        onClick={()=>{
                                            setSelected(house)
                                            console.log("clicked House",house);

                                        } }
                                    >
                                        <img
                                            src={house.img}
                                            alt="house"
                                            className="w-full h-48 mb-2 object-cover"
                                        />
                                        <Favourite houseId={house._id} />
                                        <div className="p-4">
                                                <CardTitle className="font-abyssinica">{house.location}</CardTitle>
                                            <CardDescription>
                                                Property: {house.propertyNumber}
                                            </CardDescription>
                                            <CardDescription>
                                                Size: {house.size} sqft
                                            </CardDescription>
                                            <CardDescription>
                                                Price: Rs{house.price}
                                            </CardDescription>
                                        </div>
                                    </Card>
                                    
                                ))
                        ) : (
                            <p></p>
                        )}
                    </div>
        
                    {/* Navigation Buttons */}
                    {latest.length > 4 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex((prev) => Math.max(prev - 4, 0))}
                                disabled={currentIndex === 0}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/100 rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentIndex((prev) => prev + 4)}
                                disabled={currentIndex + 4 >= latest.length}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/100 rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                →
                            </button>
                        </>
                    )}


{selected && (
    <div className="fixed top-0 left-0 ml-[330px]  mt-5 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="relative max-w-4xl w-full h-[100vh] bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
            <button
                onClick={() => setSelected(null)}
                className="absolute top-4 left-4 text-gray-600 hover:text-black text-xl"
            >
                <FontAwesomeIcon icon={faLongArrowLeft} />
            </button>

            <img src={selected.img} alt="House" className="w-full h-[285px] mt-9 mb-5 object-cover rounded-lg" />
            <Favourite houseId={selected._id} />

            <h2 className="text-2xl font-bold mt-11">{selected.location}</h2>

            <div className="flex justify-end items-center mt-2">
                <img src={selected.listedBy?.img || "NO"} className='w-16 h-16 rounded-full object-cover' />
                <button className='' onClick={
                    ()=>{
                        document.getElementById("getInTouchSection")?.scrollIntoView({
                            behavior: "smooth",
                            block:"start"
                        })
                    }
                }>Book an Agent</button>

            </div>
            <p className="mt-2">PRICE: <span className="font-semibold">Rs. {selected.price}</span></p>
            <p className="mt-2">SIZE: <span className="font-semibold">{selected.size} Anna</span></p>
            <p className="mt-2">PROPERTY ID: {selected.propertyNumber}</p>
            <p className="mt-2">PROPERTY TYPE: {selected.propertyType}</p>
            <p className="mt-2">Status: {selected.status}</p>

            <HouseMap position={[selected.latitude, selected.longitude]} houses={[selected]} />

            <div className="mt-4">
                <GetinTouch house={selected} />
            </div>
        </div>
    </div> 


    )}

                </div>
        


    </>
    );
}

export default LatestHouse;