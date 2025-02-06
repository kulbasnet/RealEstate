import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import login from "./login1.jpg";

function VerificationEmailPage() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    if (!value) {
      toast.error("Fill out the inputs");
      return;
    }

    try {
      const { data } = await Axios.post("http://localhost:8000/VerifyEmail", { code: value });
      if (data.error) {
        toast.error("Sorry, empty or invalid code.");
        console.log(`Error: ${data.error}`);
      } else {
        toast.success("Email Verified");
        navigate("/login");
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={login} alt="Email Verification" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Right side - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
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

            <Button onClick={verifyEmail} className="w-full bg-[#081740] hover:bg-[#b98604]">
              Verify Your Email Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationEmailPage;
