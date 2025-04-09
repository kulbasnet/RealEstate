
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Axios from "axios"
import { toast } from "react-hot-toast"
import { signInWithPopup } from "firebase/auth"
import { auth, googleAuthprovider } from "../firebase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import login from './login1.jpg';
import Google from './Google.png';

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
    isAgent: false,
  })
  const navigate = useNavigate()

  const userLogin = async (e) => {
    e.preventDefault()
    const { email, password } = data

    try {
      const { data } = await Axios.post("http://localhost:8000/login", { email, password })
      const { token, isAgent } = data

      if (data.error) {
        toast.error(data.error)
      } else {
        localStorage.setItem("authToken", token)
        localStorage.setItem("isAgent", isAgent)

        console.log("token set...", data.token)
        setData({
          email: "",
          password: "",
          isAgent: false,
        })
        toast.success("Welcome to dashboard", {
          style: {
            color: "#081740",
            border: "1px solid #081740",
            width: "180px",
            
        },
        iconTheme: {
            primary: "white",
            secondary: "#081740",
        },
        })
      }

      if (!email && !password) {
        toast.error("Fill out the inputs")
      }

      if (isAgent) {
        navigate("/dashBoard")
      } else {
        navigate("/hero");
      }
    } catch (error) {
      console.error("Sorry, an error occurred:", error.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthprovider)
      const token = await result.user.getIdToken(true)

      console.log("Google Token:", token)

      const { data } = await Axios.post(
        "http://localhost:8000/protected",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      localStorage.setItem("authToken", data.token)
      console.log("token set", data.token)

      toast.success("Google sign-in successful")
      navigate("/hero")
    } catch (error) {
      console.error("Error during Google sign-in:", error.response?.data || error.message)
      toast.error(error.response?.data?.error || "An error occurred during Google sign-in")
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={login}
          alt="Modern house"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 ">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-2">Login</h1>
          </div>

          <form onSubmit={userLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className='font-abyssinica  text-lg'>Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="border-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className='font-abyssinica text-lg'>Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                className="border-zinc-200"
              />
            </div>

            {/* <div className="flex items-center space-x-2">
              <input
                id="agent"
                type="checkbox"
                defaultChecked={data.isAgent}
                onChange={(e)=>setData({...data, isAgent: e.target.checked})}
              />  
              <Label htmlFor="agent" className="font-abyssinica text-sm">
                Agent?
              </Label>
            </div> */}

            <div className="space-y-4">
              <Button type="submit" className="w-full bg-[#081740] hover:bg-[#b98604]">
                Login
              </Button><br/>
              <Label className='flex justify-center'  >OR</Label>

              <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full">
                <img 
                src={Google} 
                alt="google"
                className="w-14 h-15"
                />
                Sign in with Google
                
              </Button>
            </div>

            <div className="text-center space-y-2">
              <Link to="/forgetPassword" className=" text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>

              <div className="text-sm">
                Don't have an account?{" "}
                <Link to="/Sign" className="text-blue-600 hover:underline">
                  Create an Account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

