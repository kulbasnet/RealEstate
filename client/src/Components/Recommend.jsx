import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CardSkeleton from './CardSkeleton';
import { Card, CardTitle, CardDescription } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GetinTouch from './GetinTouch';
import Favourite from './Favourite';
import HouseMap from './HouseMap';


const Recommend = ({ houseId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardSelect, setCardSelect] = useState(null);
    const [error, setError] = useState(null);


  useEffect(() => {
    const getRecommendation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/A/getRecommend/${houseId}`,{
            headers:{
              "Content-Type" : "application/json"
            }
          }
        );
        setRecommendations(response.data.recommendations);
        setLoading(false);
      } catch (error) {
      setError( 'Failed to load recommendations');
        setLoading(false);
        console.log('Error', error.message);
      }
    };

    if (houseId) 
      getRecommendation();
  }, [houseId]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>

        <div className='flex  gap-3 ml-[140px] mt-10'>
    {loading &&  <CardSkeleton/> }     

      {recommendations.map((house) => (
        <Card 
        key={house._id} 
        className="h-[320px] min-w-[280px] border rounded-lg  shadow-sm hover:shadow-md transition-shadow"
        onClick={
          ()=>{
            setCardSelect(house)
          }
        }
        >
      <img 
        src={`data:${house.img.contentType};base64,${house.img.data}`}
        alt={house.location}
        className="w-full h-48 object-cover mb-2 rounded"
      />
         <div className='flex justify-end mr-3'>
                  <Favourite houseId={house._id} />

                      </div>
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
      ))}

{cardSelect && (
    <div className="fixed top-0 left-0 ml-[330px]  mt-5 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="relative max-w-4xl w-full h-[100vh] bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
            <button
                onClick={() => setCardSelect(null)}
                className="absolute top-4 left-4 text-gray-600 hover:text-black text-xl"
            >
                <FontAwesomeIcon icon={faLongArrowLeft} />
            </button>

      <img 
        src={`data:${cardSelect.img.contentType};base64,${cardSelect.img.data}`}
        alt={cardSelect.location}
        className="w-full h-[285px] object-cover mt-9 mb-5 rounded-lg"
      />
            <Favourite houseId={cardSelect._id} />

            <h2 className="text-2xl font-bold mt-11">{cardSelect.location}</h2>

            <div className="flex justify-end items-center mt-2">
                {/* <img src={cardSelect.listedBy.img || "NO"} className='w-16 h-16 rounded-full object-cover' /> */}
                <button className='' onClick={
                    ()=>{
                        document.getElementById("getInTouchSection")?.scrollIntoView({
                            behavior: "smooth",
                            block:"start"
                        })
                    }
                }>Book an Agent</button>

            </div>
            <p className="mt-2">PRICE: <span className="font-semibold">Rs. {cardSelect.price}</span></p>
            <p className="mt-2">SIZE: <span className="font-semibold">{cardSelect.size} Anna</span></p>
            <p className="mt-2">PROPERTY ID: {cardSelect.propertyNumber}</p>
            <p className="mt-2">PROPERTY TYPE: {cardSelect.propertyType}</p>
            <p className="mt-2">Status: {cardSelect.status}</p>

            <HouseMap position={[cardSelect.latitude, cardSelect.longitude]} houses={[cardSelect]} />

            <div className="mt-4">
                <GetinTouch house={cardSelect} />
            </div>
        </div>
    </div> 

              )}


    </div>

    </>

  );
};

export default Recommend;