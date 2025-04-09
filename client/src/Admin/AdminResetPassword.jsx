import { data } from 'autoprefixer';
import axios from 'axios';
import React, { useState } from 'react'
import {toast} from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardTitle, CardContent, CardDescription, CardFooter, CardHeader
 } from '@/components/ui/card';

 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';

function AdminResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const {token } = useParams();
  const navigate = useNavigate;


  const adminResetPassword = async(e)=>{
    e.preventDefault();
    
    if(password !== confirmPassword ){
      toast.error("Password dont match");
      return;
    }

    try{
      const response = await axios.post(`http://localhost:8000/adminRoute/adminResetPassword/${token}`, {password});
      if(response.error){
        toast.error(response.error);
        console.log(response.error);
      }else{
        toast.success(response.success);
        navigate("/adminDashBoard");
      }


    }catch(error){
      console.log("Error", error);
      toast.error("Something went Wrong" );



    }
  }





  return (
    <div className='flex min-h-screen'>      
      <div className="w-full flex items-center justify-center p-8">
            <Card className="w-full max-w-md border-0">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your new password.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={adminResetPassword} className="space-y-6">
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button type="submit" className="w-full bg-[#081740] hover:bg-[#b98604]">
                    Reset Password
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" className="px-0">
                  <Link to="/adminLogin">Back to Login</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
    
      
    </div>
  )
}

export default AdminResetPassword
