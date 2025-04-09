import React, { useState } from 'react'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "./ui/label";
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { Button } from './ui/button';


function UpdateHouse({houseId}) {
  const [house, setHouse] = useState({
    location:"",
    size:"",
    latitude: "",
    longitude: "",
    price:"",
    Bedroom:"",
    Bathrooms:"",
    status:"",
    propertyNumber:"",
    Description:"",
    propertyType:'',
    img: null,

  })


  const authentication = localStorage.getItem("authToken");

  const updateHouse=async(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("location", house.location);
    formData.append("size", house.size);
    formData.append("price", house.price);
    formData.append("bedroom", house.Bedroom);
    formData.append("bathrooms", house.Bathrooms);
    formData.append("status", house.status);
    formData.append("propertyNumber", house.propertyNumber);
    formData.append("Description", house.Description);
    formData.append("img", house.img);
    formData.append("PropertyType", house.propertyType);
    formData.append("longitude", house.longitude);
    formData.append("latitude", house.latitude);

    if(!authentication){
      console.log("No token found");
      toast.error("No Authentication");
      return;
    }


    try{

      const response = await axios.put(`http://localhost:8000/house/updateHouse/${houseId}`, formData, {
        headers:{
          Authorization: `Bearer ${authentication}`,
          "Content-Type" : 'multipart/form-data'
        }
      })
      if(response.data.error){
        toast.error("Sorry some Error found");
        console.log(response.data.error);
      }else{
        setHouse({
          location:"",
          size:"",
          latitude: "",
          longitude: "",
          price:"",
          Bedroom:"",
          Bathrooms:"",
          status:"",
          propertyNumber:"",
          Description:"",
          propertyType:'',
          img: null,

        })
        toast.success("Updated");
      }

    }catch(error){
      console.log("Error", error);
      toast.error("Some error occured");


    }




  
  }

  function handleLatitude(e){
    setHouse(prev=>({...prev, latitude: e.target.value}))
  }

  function handleLongitude(e){
    setHouse(prev=>({...prev, longitude: e.target.value}));
  }

  function handleLocation(e){
    setHouse(prev=>({...prev, location: e.target.value}))
  }
  function handleSize(e){
    setHouse(prev=>({...prev, size: e.target.value}))
  }
  function handlePrice(e){
    setHouse(prev=>({...prev, price: e.target.value}))
  }
  function handleStatus(e){
    setHouse(prev=>({...prev, status: e.target.value}))
  }
  function handleBedroom(e){
    setHouse(prev=>({...prev, Bedroom: e.target.value}))
  }

  function handleBathrooms(e){
    setHouse(prev=>({...prev, Bathrooms: e.target.value}))
  }

  function handlePropertyNumber(e){
    setHouse(prev=>({...prev, propertyNumber: e.target.value}))
  }

  function handlePropertyType(e){
    setHouse(prev=>({...prev, propertyType: e.target.value}))
  }

  function handleDescription(e){
    setHouse(prev=>({...prev, Description: e.target.value}))
  }

  function handleImage(e){
    setHouse(prev=>({...prev, img: e.target.files[0]}))
  }


    


  return (
    <div>
                          <Dialog >
                      <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[495px]" >
                        <DialogHeader>
                        <DialogTitle className="font-bold font-abyssinica text-lg">Update House</DialogTitle>
                        <DialogDescription>Make changes to your House Information here. Click save when you're done.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={updateHouse}>
                        <div className="grid gap-4 ">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Location</Label>
                        
                            <Input id="location" placeholder="Kuleshwor" onChange={handleLocation} value={house.location} />
                            <p className='text-gray-400 font-mono text-xs '>*Please enter correct and full location*</p>

                          </div>

                          <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="number">Size</Label>
                           <Input placeholder="Sq ft" id="size" type="number" onChange={handleSize} value={house.size} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="number" >Price</Label>
                            <Input placeholder="Rs." id="price" type="number" onChange={handlePrice} value={house.price} />
                          </div> 
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="number">Latitude</Label>
                           <Input  id="latitude" type="number" onChange={handleLatitude} value={house.latitude} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="number" >Longitude</Label>
                            <Input  id="longitude" type="number" onChange={handleLongitude} value={house.longitude} />
                          </div> 
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="number">Property Number</Label>
                            <Input  id="number" onChange={handlePropertyNumber} value={house.propertyNumber} />


                            {["House", "Apartment", "Flat"].includes(house.propertyType) && (
                              <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="bedroom">Bedrooms</Label>
                                <Input id="bedroom" type="number" onChange={handleBedroom} value={house.Bedroom} />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="bathrooms">Bathrooms</Label>
                                <Input id="bathrooms" type="number"  onChange={handleBathrooms} value={house.Bathroom} />
                              </div>
                            </div>

                            )}

                          

                          </div> 
                          <div className="grid gap-2">
                            <Label htmlFor="description" >Description </Label>
                            <Input id="description" value={house.Description} onChange={handleDescription}  />


                          </div> 
                          <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="propertyType">Propery Type</Label>
                            <Select onValueChange={(value) => setHouse(prev => ({ ...prev, propertyType: value }))}value={house.propertyType} >
                              <SelectTrigger>
                                <SelectValue placeholder="Select property Type"/>
                        
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="House">House</SelectItem>
                                <SelectItem value="Land" >Land</SelectItem>
                                <SelectItem value="Apartment">Apartment</SelectItem>
                                <SelectItem value="Flat" >Flat</SelectItem>

                              </SelectContent>
                            </Select>
                            

                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={house.status} onValueChange={(value) => setHouse(prev => ({ ...prev, status: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder='Select Status'/> 
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sale">For Sale</SelectItem>
                                <SelectItem value="Rent">For Rent</SelectItem>

                              </SelectContent>
                            </Select>

                          </div>


                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="image">Propery Image</Label>
                            <Input id='image' type='file'onChange={handleImage}  />

                          </div>

                        </div>
                        <DialogFooter>
                          <Button type="submit" className='mt-4 hover:bg-[#dda61a]'>Update</Button>
                        </DialogFooter>
                        </form>
                        
                      </DialogContent>
                    </Dialog>

      
    </div>
  )
}

export default UpdateHouse
