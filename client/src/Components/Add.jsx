import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Add({onclose}) {
    const [houseData,setHouseData] = useState({location:"",
                                                size:"",
                                                price:"",
                                                propertyNumber:'',
                                                propertyType:"",
                                                listedBy:'',
                                                img:null})

    const authToken =localStorage.getItem('authToken');

    


    const createHouse =  async(e)=>{
      e.preventDefault();
      const {location,size,price,propertyNumber,propertyType,listedBy,img} = houseData;
      const formData = new FormData();
    formData.append('img',img);    
    formData.append('size',size)
    formData.append('price',price)
    formData.append('location',location)
    formData.append('propertyNumber',propertyNumber)
    formData.append('propertyType',propertyType)
    formData.append('listedBy',listedBy)

    if (!authToken) {
      console.log("No authentication found");
      toast.error("No Authentication");
      return;
  }
        try{
          const response = await axios.post('http://localhost:8000/house/createhouse',formData,{
            headers:{
              'Content-Type':'multipart/form-data',
              "Authorization":`Bearer ${authToken}`
            }
          })


            if(response.data.error){
              toast.error("An error occurred while adding the house")
            }else{
              setHouseData({location:"",
                size:"",
                price:"",
                propertyNumber:'',
                propertyType:"",  
                listedBy:'',
                img:null});
              toast.success("New house has been Added");

            }
        }catch(error){
            console.log(`something is wrong ${error.message}`);
        }
        
        }


        function handleLocation(e){
          setHouseData({...houseData, location:e.target.value});
        }

        function handleSize(e){
          setHouseData({...houseData, size:e.target.value});
        }

        function handlePrice(e){
          setHouseData({...houseData, price:e.target.value});
        }

        
        function handlePropertyNumber(e){
          setHouseData({...houseData, propertyNumber:e.target.value});
        }
        function handlePropertyType(e){
          setHouseData({...houseData, propertyType:e.target.value});
        }
        function handleListedBy(e){
          setHouseData({...houseData, listedBy:e.target.value});
        }

        function handleImage(e){
          setHouseData({...houseData,img:e.target.files[0]})
        }


        useEffect(()=>{
          if(houseData.img){
            console.log("file has beesent")
          }
        },[houseData.img])



  return (
    <div className='popup-container'>
      <div className='popup'>
      <form onSubmit={createHouse}>
      <button className='close' onClick={onclose} ><FontAwesomeIcon icon={faTimes}/></button>  
        <h1 className='pop-head'>Add New House</h1>
        <label>Location</label>
        <input type='text' onChange={handleLocation} value={houseData.location} className='add-input' /><br/>
        <label>Size</label>
        <input type='number' onChange={handleSize} value={houseData.size} className='add-input' /><br/>
        <label>Price</label>
        <input type='number' onChange={handlePrice} value={houseData.price} className='add-input' /><br/>
        <label>Property Number</label>
        <input type='number' onChange={handlePropertyNumber} value={houseData.propertyNumber} className='add-input' /><br/>
        <label>Property Type</label>
        <input type='text' onChange={handlePropertyType} value={houseData.propertyType} className='add-input' /><br/>
        <label>listed By</label>
        <input type='text' onChange={handleListedBy} value={houseData.listedBy} className='add-input' /><br/>
        <input type='file' onChange={handleImage} /><br/>

        <button type='submit'>Add</button>
        </form>

      </div>
    </div>
  )
}
export default Add
