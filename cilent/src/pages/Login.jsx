import React, { useState } from 'react'
import {Link} from "react-router-dom";

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

      <div className='log'>
      <h1 className='Head'>Login</h1>

        <form >
        <label className='label-log'>Email</label><br/>
        <input type='email' className='input-log'  value={data.email}  onChange={handleEmail}  /><br/>

        <label className='label-log'>Password</label><br/>
        <input type='password' className='input-log'  value={data.password}  onChange={handlePassword}  /><br/>

        <button type='submit' className='button-log'> Login</button>

        <p className='link-log'> <Link to={'/Signup'}>Create an Account</Link></p>



          </form>  


      </div>
     
       
    </div>
  )
}

export default Login
