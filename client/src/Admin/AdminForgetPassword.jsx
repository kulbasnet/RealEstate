import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function AdminForgetPassword() {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    
    const adminForget =async(e)=>{
        e.preventDefault();

        if(!email){
            toast.error("Email is Mandatory");
            return;
        }

        try{

            const response = await axios.post("http://localhost:8000/adminRoute/adminForget",  {email});
            if(response.error){
                toast.error(response.error);
            }else{
                toast.success(response.success);
                
            }



        }catch(error){
            console.log("Error", error);

        }

    }







  return (
    <div className="flex min-h-screen">
        <div className="w-full flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                  <div className="text-center">
                    <h1 className="text-4xl font-serif mb-2">Forgot Password</h1>
                    <p className="text-gray-500">Enter your email to reset your password.</p>
                  </div>
        
                  <form onSubmit={adminForget} className="space-y-6">
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
                      <Link to="/adminLogin" className="text-sm text-blue-600 hover:underline">
                      Know your password? Login
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
      
    </div>
  )
}

export default AdminForgetPassword
