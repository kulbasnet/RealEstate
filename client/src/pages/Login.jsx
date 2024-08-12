import React, { useState } from 'react';
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import login from "./login1.jpg";
import {toast} from "react-hot-toast";

function Login() {   
    const [data, setData] = useState({
        email: "",
        password: "",
        isAgent:false
    });
    const navigate = useNavigate();

    const userLogin = async (e) => {
        e.preventDefault();
        const { email, password,isAgent } = data;

        try {
            const {data} = await Axios.post('http://localhost:8000/login', { email, password,isAgent });
            if (data.error) {

                toast.error(data.error)
                
            } else {
                localStorage.setItem('authToken',data.token);
                console.log("token set...", data.token);
                setData({email:'', 
                    password:"",
                    isAgent:false});
                toast.success("Welcome to dashboard")
                
            }

            if(isAgent){
                navigate('/dashBoard');
            }else{
                navigate('/');
            }

        } catch (error) {
            console.error("Sorry, an error occurred:", error.message);
        }
    };

    function handleEmail(e) {
        setData({ ...data, email: e.target.value });
    }

    function handlePassword(e) {
        setData({ ...data, password: e.target.value });
    }

    function handleChecked(e){
        setData({...data, isAgent:e.target.checked});
    }



    return (
        <div>
            <img src={login} alt='Login' className='log-img' />
            <div className='log'>
                <h1 className='Head'>Login</h1>
                <form onSubmit={userLogin} >
                    <label className='label-log'>Email</label><br />
                    <input 
                        type='email' 
                        className='input-log' 
                        value={data.email} 
                        onChange={handleEmail} 
                        required 
                    /><br />

                    <label className='label-log'>Password</label><br />
                    <input 
                        type='password' 
                        className='input-log' 
                        value={data.password} 
                        onChange={handlePassword} 
                        required 
                    /><br />
                    <input type='checkbox' value={data.isAgent}  onChange={handleChecked} className='log-check' />
                    <label className='check-label'>Agent?</label><br/>

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
