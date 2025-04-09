import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2 } from "lucide-react"
// import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function UserProfile() {
  const [update, setUpdate] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    img:null
   
  })
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const authentication = localStorage.getItem('authToken');
  

  useEffect(()=>{
    const userInfo = async ()=>{
      try{
        const token = localStorage.getItem('authToken')
        const response = await axios.get("http://localhost:8000/userInfo",{
          headers: {Authorization: `Bearer ${token}`}
        });
        console.log(response.data.user);
        setUser(response.data.user);

      }catch(error){
        console.log("Sorry something is wrong", error.message);

      }
    };
    userInfo();
  },[])


const handleEdit =async()=>{

  const {name, phoneNumber, img} = update;
  const formData = new FormData();
  formData.append('img', update.img);
  formData.append("name",update.name);
  formData.append("phoneNumber", update.phoneNumber);

  if(!authentication){
    console.log('Sorry no authentication');
    toast.error("No Authentication");
    return;
  
  
  }



  try{
    const response = await axios.put(`http://localhost:8000/updateUser/${user._id}`,formData, {
      headers:{
        Authorization: `Bearer ${authentication}`,
        "Content-Type" : 'multipart/form-data',
      }   
    })

    if(response.data.error){
      toast.error("Sorry error occured");
      console.log(response.data.error);
    }else{
      setUpdate({
        name:"",
        phoneNumber:"",
        img:null
      })
      toast.success("Updated");
    }

  }catch(error){
    console.log(`${error.message}`)

  }

 

}


const handleDelete=async()=>{
  try{
    const response= await axios.delete(`http://localhost:8000/userDelete/${user._id}`,{
      headers:{
        Authorization:`Bearer ${authentication}`
      }
    })

    if(response.data.success){
      localStorage.removeItem("authToken");
      navigate('/login');
      toast.success("Account Deleted");
      
    }else{
      toast.error(response.data.message || 'Deletion failed');
    }

  }catch(error){
    console.log("Eror", error);

  }
}


function handleName(e){
  setUpdate(prev=>({...prev, name: e.target.value}))

}

function handlePhoneNumber(e){
  setUpdate(prev=>({...prev, phoneNumber: e.tarfttget.value}))

}

function handleFile(e){
  setUpdate(prev=> ({...prev, img:e.target.files[0]}));
}

 
  return ( 
  <Card className="max-w-md mx-auto mt-[150px]">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl text-[#DB9F05]">User Profile</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.img} alt={user.name} />
        </Avatar>

        <div className="text-center">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-muted-foreground">{user.phoneNumber}</p>


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
                <Input id="number" name="number" type="Number" onChange={handlePhoneNumber} value={update.phoneNumber} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input id="avatarUrl" name="avatarUrl"  type="file" accept="image/*" onChange={handleFile}  />
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
            <AlertDialogAction onClick={handleDelete} >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardFooter>
  </Card>
  )
}

export default UserProfile

