import React, { useState } from 'react';
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import login from "./login1.jpg";
import axios from 'axios';

function Login() {   
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

<<<<<<< HEAD
    const userLogin = async (e) => {
        e.preventDefault();
        const { email, password } = data;
=======
    try{
      const {data} =await axios.post('/Login', {
        email,password
      });
      if(!data){
        console.log("Sorry no such user found");
      }else{
        setData({});
        navigate('/Buy');
>>>>>>> 196eb96f7f699c9eea1085eeedb7fd169c3f68ad

        try {
            const { data } = await Axios.post('/login', {
                email,
                password
            });
            if (!data) {
                console.log("Sorry no such user found");
            } else {
                setData({});
                navigate('/');
            }
        } catch (error) {
            console.error("Sorry Error occured", error.message);
        }
    };

    function handleEmail(e) {
        setData({ ...data, email: e.target.value });
    }

    function handlePassword(e) {
        setData({ ...data, password: e.target.value });
    }

    return (
        <div>
            <img src={login} alt='pic' className='log-img' />
            <div className='log'>
                <h1 className='Head'>Login</h1>
                <form onSubmit={userLogin} >
                    <label className='label-log'>Email</label><br />
                    <input type='email' className='input-log' value={data.email} onChange={handleEmail} /><br />

                    <label className='label-log'>Password</label><br />
                    <input type='password' className='input-log' value={data.password} onChange={handlePassword} /><br />

                    <button type='submit' className='button-log'> Login</button>

                    <p className='link-log'> 
                        <Link to={'/Sign'} className='link-log-underline'>Create an Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
