import axios from 'axios';
import React, { useEffect, useState} from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Dialog,
   DialogContent,
    DialogDescription,
     DialogFooter,
      DialogHeader,
      DialogTitle,
       DialogTrigger } from '@/components/ui/dialog';
import {
   AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogDescription, 
  AlertDialogFooter,
   AlertDialogContent,
   AlertDialogTitle,
    AlertDialogTrigger,
  AlertDialogHeader
 } from '@/components/ui/alert-dialog';

 import { useNavigate } from 'react-router-dom';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { Pencil, Trash2 } from 'lucide-react';
 import { Avatar, AvatarImage } from "@/components/ui/avatar"
 import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';




function AdminProfile() {
  const[admin, setadmin] = useState({});
  const [update, setUpdate] = useState({
    name:"",
    phoneNumber: "",
    img:null
  })
  const navigate= useNavigate();



  const authentication = localStorage.getItem("authToken");

    const adminInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/adminRoute/adminInfo", {
          headers: { "Authorization": `Bearer ${authentication}` }
        });
        setadmin(response.data.data); // Make sure your backend returns { data: ... }
      } catch (error) {
        console.error("Error:",error);
      }
    }

    useEffect(()=>{
      adminInfo();
    },[])



    const handleEdit = async()=>{

      const {name, phoneNumber, img}= update;
      const formData = new FormData();
      formData.append("name", update.name);
      formData.append("phoneNumber", update.phoneNumber);
      if(update.img){
        formData.append("img", update.img);

      }

      if(!authentication){
        toast.error("Sorry no authentication found");
        console.error("No authentication");
        return;
      }


      try{
        const response = await axios.put(`http://localhost:8000/adminRoute/adminUpdate/${admin._id}`, formData, {
          headers:{
            "Authorization" : `Bearer ${authentication}`,
            "Content-Type" : "multipart/form-data",
          }
        } )

        if(response.data.error){
          toast.error("Sorry updated cannot be done");
          console.error(response.data.error);
        }else{
          setUpdate({
            name:"",
            phoneNumber:"",
            img:null
          })
          toast.success("Admin Updatd");
        }

      }catch(error){
        console.error(`${error.message}`);

      }
      
    }


    function handleName(e){
      setUpdate(prev=>({...prev, name: e.target.value}));
    }

    function handlePhoneNumber(e){
      setUpdate(prev=>({...prev, phoneNumber: e.target.value}));
    }

    function handleFile(e){
      setUpdate(prev=>({ ...prev, img: e.target.files[0] }))}


    const adminDelete = async ()=>{
      try{

        const response = await axios.delete(`http://localhost:8000/adminRoute/adminDelete/${admin._id}`,{
          headers:{
            "Authorization": `Bearer ${authentication}`
          }
        })

        if(response.data.success){
          localStorage.removeItem("authToken");
          toast.success("Account Deleted");
          navigate("/adminLogin")
                }else{
                  toast.error("Cannot delte user");
                  console.log("Error", response.data.message);
                }



      }catch(error){
        console.log("Error",error);


      }
    }
    

    

  return (
    <div>
        <Card className="max-w-md mx-auto mt-[90px]">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl text-[#DB9F05]">Admin Profile</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={admin.img} alt={admin.name} />
        </Avatar>

        <div className="text-center">
          <h2 className="text-xl font-bold">{admin.name}</h2>
          <p className="text-muted-foreground">{admin.email}</p>
          <p className="text-muted-foreground">{admin.phoneNumber}</p>


        </div>
      </div>

      <div className="flex justify-center">
        <Dialog  >
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" onChange={handleName} value={update.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Phone Number</Label>
                <Input id="number" name="number" type="number" onChange={handlePhoneNumber} value={update.phoneNumber}  />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatarUrl">Image URL</Label>
                <Input id="avatarUrl" name="avatarUrl"  type="file" accept="image/*"  onChange={handleFile}  />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEdit} >Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
    <CardFooter className="flex justify-center border-t pt-6">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Profile
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={adminDelete} >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardFooter>
  </Card>

      
    </div>
  )
}

export default AdminProfile
