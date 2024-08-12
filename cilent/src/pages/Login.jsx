import React, { useState } from 'react'

function Login() {
    const [data,setData ]= useState({email:"",
                                    password:""
                                        })


  function handleEmail(e){
    setData({...data, email: e.target.value})
  }

  function handlePassword(e){
    setData({...data, password: e.target.value});
  }


  return (
    <div >
     
        <h1>Login</h1>

        <form >
        <label>Email</label><br/>
        <input type='email' value={data.email} onChange={handleEmail} placeholder='Enter your email..' />
        <label>Password</label><br/>
        <input type='password' value={data.password} onChange={handlePassword} placeholder='Enter your password..'/>

            </form>  

        


      
    </div>
  )
}

export default Login
