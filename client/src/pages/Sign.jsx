import React, { useState } from 'react';
import photo from './photo1.jpg';
import { Link , useNavigate} from 'react-router-dom';
import Axios from "axios";
import {toast} from "react-hot-toast";

function Sign() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        isAgent:false,
        phoneNumber:"",
       
    });

  const navigate = useNavigate();

    const userSignUp = async (e)=>{
        e.preventDefault();
        const {name, email,password,isAgent,phoneNumber} = data;

        if (isAgent && !phoneNumber) {
            toast.error("Phone number is required for agents.");
            return;
        }
        try{
            const {data} = await Axios.post("http://localhost:8000/sign",{

                name,email,password,isAgent,phoneNumber
            })

            if(data.error){
                toast.error(data.error);
            }else{
                setData({ });
                toast.success("SignUp Succesfull")
                navigate('/login'); 
                
            }

        }catch(err){
            console.error("Sorry somthig is wrong",err.message);

        }
    }

    function handleEmail(e) {
        setData({ ...data, email: e.target.value });
    }

    function handlePassword(e) {
        setData({ ...data, password: e.target.value });
    }

    function handleName(e) {
        setData({ ...data, name: e.target.value });
    }

    function handlePhoneNumber(e) {
        setData({ ...data, phoneNumber: e.target.value });
    }

    function handleCheck(e){
        setData({...data, isAgent:e.target.checked});

    }

    

    return (
        <div>
            <img src={photo} alt='pic' className='image'/>
        <div className='sign'>
            <h1 className='heading'>Sign Up</h1>
            
            <form onSubmit={userSignUp} >
                <label className='label'>Name</label><br />
                <input
                    className='input'
                    value={data.name}
                    onChange={handleName}
                /><br />
                <label className='label'>Email</label><br />
                <input
                    className='input'
                    value={data.email}
                    onChange={handleEmail}
                /><br />
                <label className='label'>Password</label><br />
                <input
                    className='input'
                    value={data.password}
                    onChange={handlePassword}
                    required
                /><br />
                <input className='check' type='checkbox' checked={data.isAgent} onChange={handleCheck} />
                <label className='check-label'>Agent?</label><br/>

                {data.isAgent && 
                <div className='agent-info'>
                <label className='label'>Phone Number</label>
                <input type='number' className='check-input' value={data.phoneNumber} onChange={handlePhoneNumber}/><br/>
                </div>
                }
                <button className='button' type='submit'>Submit</button>
        
            </form>
      <p className='link-sign'> Back to <Link to={"/login"} className='link-underline'>Login</Link></p>  
        </div>
        </div>
    );
}

export default Sign;
