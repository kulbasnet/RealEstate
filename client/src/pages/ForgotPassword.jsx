import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import toast from "react-hot-toast";
import login from "./login1.jpg"; // Ensure the correct path to the image

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const forgetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is needed");
      return;
    }

    try {
      const { data } = await Axios.post("http://localhost:8000/forgetPassword", { email });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={login} alt="Forgot Password" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-2">Forgot Password</h1>
            <p className="text-gray-500">Enter your email to reset your password.</p>
          </div>

          <form onSubmit={forgetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-abyssinica">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-zinc-200"
              />
            </div>

            <Button type="submit" className="w-full bg-[#081740] hover:bg-[#b98604]">
              Reset Password
            </Button>

            <div className="text-center space-y-2">
              <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Know your password? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
