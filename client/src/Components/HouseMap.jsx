import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import  home from './home.png';
import Card from './Card';

function HouseMap({houses}) {

    // const customMark =(price)=> L.divIcon({
    //     className:"price-maker",
    //     html:`<div class="price-label">Rs. ${price}</div>`,
    //     iconSize:[100,26],
    //     iconAnchor:[30,15],
    // });

    const cus = L.icon({
        className:"ic",
        iconUrl:home,
        iconSize:[20,20]
    })





  return (
    
        <div className='h-[100vh] w-full'>
      <MapContainer 
        center={[27.7103,85.3222]}  
        zoom={13}
        // style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

    {houses.map((house,index)=>(
            <Marker position={[house.latitude, house.longitude]} key={index} icon={cus}  >
                {/* <Popup><img src={house.img} alt='house'/></Popup> */}
                <Popup>
                    <div className='w-[200px]'>
                        <img src={house.img} className='w-[300px] h-[110px]'/>
                      <h2 className='mt-1 font-bold font-abyssinica text-[#DB9F05]'>{house.location}</h2>  
                      <p>Rs. {house.price}</p>
                      <p>For {house.status}</p>
                      <p>Type: {house.propertyType}</p>

                    </div>
                </Popup>
                {/* <Popup className='h-[30px]'><Card house={house}/></Popup> */}


                </Marker>
            
        ))}





      </MapContainer>
    </div>

    
  );
}

export default HouseMap;