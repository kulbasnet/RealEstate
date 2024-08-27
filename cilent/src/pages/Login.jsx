import React, { useState } from 'react';
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import login from "./login1.jpg";

function Login() {   
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const userLogin = async (e) => {
        e.preventDefault();
        const { email, password } = data;

        try {
            const response = await Axios.post('/Login', { email, password });
            if (response.data) {
                setData({});
                navigate('/Buy');
            } else {
                console.log("Sorry, no such user found");
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
