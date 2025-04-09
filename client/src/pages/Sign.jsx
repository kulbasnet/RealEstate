import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import login from "./login1.jpg";
// import Google from "./Google.png";

export default function Sign() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    isAgent: false,
    phoneNumber:"",
    location:"",
    img: null
  });
  const navigate = useNavigate();

  const userSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, isAgent, phoneNumber, location, img } = data;

    const formData = new FormData()
    formData.append('img', img);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("location", location);
    formData.append("isAgent", isAgent);


    if (isAgent && !phoneNumber && !location) {
      toast.error("Phone number is required for agents.");
      return;
  }
  // If not an agent, clear the phoneNumber field to avoid sending empty strings
  let updatedPhoneNumber = phoneNumber;
  let updatedLocation = location;
  if (!isAgent) {
      updatedPhoneNumber = null;
      updatedLocation= null;

  }

    try {
      const { data } = await Axios.post("http://localhost:8000/sign", formData);

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({
          name:'',
          email:"",
          password:"",
          img: null,
          location:'',
          phoneNumber:'',
        });
        toast.success("Verification code is sent in your Email", {
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
        navigate("/verifyEmail");
      }
    } catch (error) {
      console.error("Server response:", error.response?.data);      
      toast.error(err.response?.data?.message || "An error occurred.");
      
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
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={login} alt="Modern house" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-2">Sign Up</h1>
          </div>

          <form onSubmit={userSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-abyssinica text-lg">Name</Label>
              <Input id="name" type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border-zinc-200" />
            </div>

             <div className="space-y-2">
             <Label htmlFor="image" className="font-abyssinica text-lg">Profile Image</Label>
              <Input id="image" type="file" onChange={handleImage} className="cursor-pointer" />
             </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-abyssinica text-lg">Email</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required className="border-zinc-200" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-abyssinica text-lg">Password</Label>
              <Input id="password" type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required className="border-zinc-200" />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="agent" checked={data.isAgent} onChange={(e) => setData({ ...data, isAgent: e.target.checked })} />
              <Label htmlFor="agent" className="font-abyssinica text-sm">Agent?</Label>
            </div>

            {data.isAgent && 
            
            <div className="space-y-2">
            <Label htmlFor="Number" className="font-abyssinica text-lg">Phone Number</Label>
            <Input id="Number" type="number" value={data.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} required className="border-zinc-200" />

            <Label htmlFor="text" className="font-abyssinica text-lg"> Location</Label>
            <Input id="text" type="text" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} required className="border-zinc-200" />

          </div>
          }

            <div className="space-y-4">
              <Button type="submit" className="w-full bg-[#081740] hover:bg-[#b98604]">Sign Up</Button>
            </div>

            <div className="text-center space-y-2">
              <div className="text-sm">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
