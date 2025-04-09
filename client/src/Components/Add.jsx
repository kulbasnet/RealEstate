import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

function Add({ onclose }) {
  const [houseData, setHouseData] = useState({
    location: "",
    size: "",
    price: "",
    latitude:"",
    longitude:"",
    propertyNumber: "",
    propertyType: "",
    Bathrooms: "",
    Bedroom: "",
    Description: "",
    listedby: "",
    status: "",
    img: null
  })

  const authToken = localStorage.getItem("authToken")
console.log("Retrieved authToken:", authToken); //

  const createHouse = async (e) => {
    e.preventDefault()
    const {
      location,
      size,
      price,
      propertyNumber,
      propertyType,
      Description,
      Bedroom,
      latitude,
      longitude,
      Bathrooms,
      status,
      img,
      // userId,
    } = houseData
    const formData = new FormData()
    formData.append("img", img)
    formData.append("size", size)
    formData.append("price", price)
    formData.append("location", location)
    formData.append("propertyNumber", propertyNumber)
    formData.append("propertyType", propertyType)
    formData.append("Bathrooms", Bathrooms)
    formData.append("Description", Description)
    formData.append("Bedroom", Bedroom)
    formData.append("status", status)
    formData.append("latitude", latitude)
    formData.append("longitude", longitude)
    // formData.append("listedBy", userId)

    if (!authToken) {
      console.log("No authentication found")
      toast.error("No Authentication")
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/house/createHouse", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        }
      })

      if (response.data.error) {
        toast.error("An error occurred while adding the house")
      } else {
        setHouseData({
          location: "",
          size: "",
          price: "",
          propertyNumber: "",
          propertyType: "",
          Bedroom: "",
          Bathrooms: "",
          Description: "",
          status: "",
          longitude:"",
          latitude:"",
          img: null
        })
        toast.success("New house has been Added")
       
      }
    } catch (error) {
      console.log(`${error.message}`)
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
  
  function handleBedroom(e){
    setHouseData({...houseData, Bedroom:e.target.value});
  }
  function handleBathrooms(e){
    setHouseData({...houseData, Bathrooms:e.target.value});
  }

  function handleDescription(e){
    setHouseData({...houseData, Description:e.target.value});
  }

  function handleStatus(e){
    setHouseData({...houseData, status:e.target.value});
  }


  function handleLatitude(e){
    setHouseData({...houseData, latitude: e.target.value});
  }

  function handleLongitude(e){
    setHouseData({...houseData, longitude: e.target.value});

  }

  function handleImage(e){
    setHouseData({...houseData,img:e.target.files[0]})
  }


  useEffect(() => {
    if (houseData.img) {
      console.log("file has been sent")
    }
  }, [houseData.img])

  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add New House</DialogTitle>
          <DialogDescription>Add the details of the new property here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={createHouse}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={houseData.location} onChange={handleLocation} placeholder="Kuleshwor" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="size">Longitude</Label>
                <Input id="size" type="number" value={houseData.longitude} onChange={handleLongitude} placeholder="" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Latitude</Label>
                <Input id="price" type="number" value={houseData.latitude} onChange={handleLatitude} placeholder="" />
              </div>
            </div>

            

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="size">Size</Label>
                <Input id="size" type="number" value={houseData.size} onChange={handleSize} placeholder="Sq ft" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={houseData.price} onChange={handlePrice} placeholder="Rs" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="propertyNumber">Property Number</Label>
              <Input
                id="propertyNumber"
                type="number"
                value={houseData.propertyNumber}
                onChange={handlePropertyNumber}
              />
            </div>

            {["House", "Flat", "Apartment"].includes(houseData.propertyType) && (
  <div className="grid grid-cols-2 gap-4">
    <div className="grid gap-2">
      <Label htmlFor="bedroom">Bedrooms</Label>
      <Input id="bedroom" type="number" value={houseData.Bedroom} onChange={handleBedroom} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="bathrooms">Bathrooms</Label>
      <Input id="bathrooms" type="number" value={houseData.Bathrooms} onChange={handleBathrooms} />
    </div>
  </div>
)}

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={houseData.Description} onChange={handleDescription} />
            </div>


            <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={houseData.propertyType}
                onValueChange={(value) => setHouseData({ ...houseData, propertyType: value })}
                onChange={handlePropertyType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Flat">Flat</SelectItem>

                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={houseData.status} onValueChange={(value) => setHouseData({ ...houseData, status: value })} onChange={handleStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>



            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Property Image</Label>
              <Input id="image" type="file" onChange={handleImage} className="cursor-pointer" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add property</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Add

