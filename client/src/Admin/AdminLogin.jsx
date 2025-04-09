
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
// import login from './login1.jpg';
// import Google from './Google.png';

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
    isAdmin: true,
  })
  const navigate = useNavigate()

  const adminLogin = async (e) => {
    e.preventDefault()
    const { email, password } = data

    try {
      const { data } = await Axios.post("http://localhost:8000/adminRoute/adminLogin", { email, password })
      const { token, isAdmin  } = data

      if (data.error) {
        toast.error(data.error)
      } else {
        localStorage.setItem("authToken", token)
        localStorage.setItem("isAdmin", isAdmin)

        console.log("token set...", data.token)
        setData({
          email: "",
          password: "",
          isAdmin:true,
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

      if (isAdmin) {
        navigate("/adminDashboard");
        return;
      }
    } catch (error) {
      console.error("Sorry, an error occurred:", error.message)
    }
  }

  return (
    <div className="flex min-h-screen">
     

      <div className="w-full  flex items-center justify-center p-8 ">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-2">Login</h1>
          </div>

          <form onSubmit={adminLogin} className="space-y-6">
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

            <div className="flex items-center space-x-2">
              <input
                id="agent"
                type="checkbox"
                defaultChecked={data.isAgent}
                onChange={(e)=>setData({...data, isAdmin: e.target.checked})}
              />  
              <Label htmlFor="agent" className="font-abyssinica text-sm">
                Admin?
              </Label>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full bg-[#081740] hover:bg-[#b98604]">
                Login
              </Button>
            </div>

            <div className="text-center space-y-2">
              <Link to="/adminForget" className=" text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>

              <div className="text-sm">
                Don't have an account?{" "}
                <Link to="/adminSignUp" className="text-blue-600 hover:underline">
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

