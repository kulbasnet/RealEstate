import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import login from "./login1.jpg";
// import Google from "./Google.png";

export default function Sign() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: true,
    phoneNumber:"",
    img: null
  });
  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    const { name, email, password, isAdmin, phoneNumber, img } = data;

    const formData = new FormData()
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("isAdmin", isAdmin);
    formData.append("img", img);


    if (isAdmin && !phoneNumber) {
      toast.error("Phone number is required for Admins.");
      return;
  }


    try {
      const { data } = await Axios.post("http://localhost:8000/adminRoute/createUser", formData, {
        headers:{
          "Content-Type" : "multipart/form-data"
        }
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({
          name:'',
          email:"",
          password:"",
          phoneNumber:'',
          img: null,
        });
        toast.success("SuccessFully signup as admin", {
          style: {
            color: "#081740",
            border: "1px solid #081740",
            width: "180px",
          },
          iconTheme: {
            primary: "#081740",
            secondary: "#081740",
          },
        });
        navigate("/adminVerify");
      }
    } catch (error) {
      console.error("Server response:", error.response?.data);      
      toast.error(error.response?.data?.message || "An error occurred.");
      
    //   if (err.response && err.response.data && err.response.data.error) {
    //     toast.error(err.response.data.error);
    // } else {
    //     toast.error("An unexpected error occurred");
    // }

    }
  };

  useEffect(()=>{
    if(data.img){
      console.log("File has been sent");
    }
  }, [data.img])

  function handleImage(e){
    setData({...data, img: e.target.files[0]});
  }










  return (
    <div className="flex min-h-screen">
     

      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-2">Sign Up</h1>
          </div>

          <form onSubmit={createUser} className="space-y-6">

          <div className="space-y-2">
             <Label htmlFor="image" className="font-abyssinica text-lg">Profile Image</Label>
              <Input id="image" type="file" onChange={handleImage} className="cursor-pointer" />
             </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="font-abyssinica text-lg">Name</Label>
              <Input id="name" type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border-zinc-200" />
            </div>

            

            <div className="space-y-2">
              <Label htmlFor="email" className="font-abyssinica text-lg">Email</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required className="border-zinc-200" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-abyssinica text-lg">Password</Label>
              <Input id="password" type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required className="border-zinc-200" />
            </div>

           
           
            
            <div className="space-y-2">
            <Label htmlFor="Number" className="font-abyssinica text-lg">Phone Number</Label>
            <Input id="Number" type="number" value={data.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} required className="border-zinc-200" />


            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="admin" checked={data.isAdmin} onChange={(e) => setData({ ...data, isAdmin: e.target.checked })} />
              <Label htmlFor="admin" className="font-abyssinica text-sm">Admin?</Label>
            </div>

          

            <div className="space-y-4">
              <Button type="submit" className="w-full bg-[#081740] hover:bg-[#b98604]">Sign Up</Button>
            </div>

            <div className="text-center space-y-2">
              <div className="text-sm">Already have an account <Link to="/adminLogin" className="text-blue-600 hover:underline">login</Link></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
