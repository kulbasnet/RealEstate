import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

function AdminVerification() {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    

    const adminVerify = async()=>{
        if(!value){
          toast.error("Fill out the inputs");
          return;
        }


        try{

          const response = await axios.post("http://localhost:8000/adminRoute/adminVerify", { code:value });
          if(response.error){
            toast.error("Sorry empty or invalid codes");
            console.log(`Error: ${response.error}`);

          }else{
            toast.success("Email verified");
            navigate("/adminLogin");
          }

        }catch(error){


        }
    }






  return (
    <div className='flex min-h-screen '>
            <div className="w-full flex items-center justify-center p-8">
              <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-serif mb-2">Verify Your Email</h1>
                  <p className="text-gray-500">Enter the verification code sent to your email.</p>
                </div>
      
                <div className="space-y-4">
                  <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)}>
                    <InputOTPGroup className="mx-auto">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
      
                  <div className="text-center text-sm text-gray-600">
                    {value === "" ? "Enter your verification email code." : `You entered: ${value}`}
                  </div>
      
                  <Button onClick={adminVerify} className="w-full bg-[#081740] hover:bg-[#b98604]">
                    Verify Your Email Now
                  </Button>
                </div>
              </div>
            </div>
      
      
      
    </div>
  )
}

export default AdminVerification
