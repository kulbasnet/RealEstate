import axios from "axios";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
  
} from "@/components/ui/dialog";
import Delte from "./Delte"; 
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "./ui/select";
import UpdateHouse from "./UpdateHouse";
import TableSkeleton from "./TableSkeleton";

export default function AgentHouse() {
  const [agentHouse, setAgentHouse] = useState([]);
  const [isloading, setLoading] = useState(true);
  // const [deleteId, setDeleteId] = useState(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getAgentHouse = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No authentication found");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8000/house/agentHouse", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        console.log(response.data.agentHouse);
        setAgentHouse(response.data.agentHouse);
        setLoading(false);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    getAgentHouse();
  }, []);

  return (
    <div className="container mx-auto w-[1400px] py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#b98604]">Property Listings</h1>
          <p className="text-muted-foreground">Manage your property listings here.</p>
        </div>
       
      </div>

      <div className="rounded-md border">
        {isloading && Array(3).fill(0).map((_, index)=> <TableSkeleton key={index}/>)}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Property Number</TableHead>
              <TableHead>Property Type</TableHead>
              <TableHead>Bedroom</TableHead>
              <TableHead>Bathrooms</TableHead>
              <TableHead> Status</TableHead>
              <TableHead> Description</TableHead>



              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentHouse.length > 0 ? (
              agentHouse.map((house) => (
                <TableRow key={house._id}>
                  {/* <TableCell><img src={house.img}/></TableCell> */}
                  <TableCell>{house.location}</TableCell>
                  <TableCell>${house.price.toLocaleString()}</TableCell>
                  <TableCell>{house.size}</TableCell>
                  <TableCell>{house.propertyNumber}</TableCell>
                  <TableCell>{house.propertyType}</TableCell>
                  <TableCell>{house.Bedroom}</TableCell>
                  <TableCell>{house.Bathrooms}</TableCell>
                  <TableCell>{house.status}</TableCell>
                  <TableCell>{house.Description}</TableCell>


                  <TableCell className="text-right ">
                    <UpdateHouse houseId={house._id}  key={house._id} />
                    {/* <Dialog >
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
                        <form>
                        <div className="grid gap-4 ">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Location</Label>
                            <Input id="name" placeholder="Kuleshwor" />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="number">Size</Label>
                           <Input placeholder="Sq ft" id="size" type="number" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="number" >Price</Label>
                            <Input placeholder="Rs." id="price" type="number" />
                          </div> 
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="number">Property Number</Label>
                            <Input placeholder="Sq ft" id="size" /> */}


                            {/* {["House", "Land", "Apartment", "Flat"].includes()} */}

                            {/* <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="bedroom">Bedrooms</Label>
                                  <Input id="bedroom" type="number" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="bathrooms">Bathrooms</Label>
                                  <Input id="bathrooms" type="number"  />
                                </div>
                              </div>



                          </div> 
                          <div className="grid gap-2">
                            <Label htmlFor="description">Description </Label>
                            <Input id="description"  />


                          </div> 
                          <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="propertyType">Propery Type</Label>
                            <Select >
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
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder='Select Status'/> 
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sale">For Sale</SelectItem>
                                <SelectItem value="Rent">For Sale</SelectItem>

                              </SelectContent>
                            </Select>

                          </div>


                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="image">Propery Image</Label>
                            <Input id='image' type='file'/>

                          </div>

                        </div>
                        <DialogFooter>
                          <Button type="submit" className='mt-4'>Update</Button>
                        </DialogFooter>
                        </form>
                        
                      </DialogContent>
                    </Dialog> */}
                    
                              <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your House and remove your House information from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-[#081740] hover:bg-[#DB9F05]"  > <Delte houseId={house._id}/>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                    
                  </TableCell>
                </TableRow>
              ))
            ) : (
             <p></p>
            )}
          </TableBody>
        </Table>
      </div>


    </div>
  );
}
