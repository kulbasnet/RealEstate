import React, { useState } from 'react';
import axios from 'axios';
import {toast} from "react-hot-toast";

function GetinTouch({userId, houseId, isAgent}) {
    const [data, setData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const authToken = localStorage.getItem("authToken");

    const getinTouch = async (e) => {

        if(!authToken){
            console.log("No authentication found");
            return;
        }
        e.preventDefault();
        const { name, email, message } = data;

        try {
            const {data} = await axios.post('http://localhost:8000/house/touch', { name, email, message },{
                headers:{
                    "Authorization":`Bearer ${authToken}`,
                },
            });
            if (data.error) {
                toast.error(data.error);
                
            } else {
                setData({ name: "", email: "", message: "" }); 
                toast.success("Message Sent");
            }
        } catch (error) {
            console.log("Some error occurred:", error.message);
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value 
        });
    };

    return (
        <div>
            <div className='touch-form'>
            <br />
            <form onSubmit={getinTouch} >
            <h1 className='touch-heading'>Get In Touch</h1><br/>
            <div className='agent-det'>
                <p>{isAgent?.email || "NA"}</p>
                <p>{isAgent?.name || "NA"}</p>
                <p>{isAgent?.phoneNumber || "NA"}</p>
            </div>

                <input 
                    type='text' 
                    name='name' 
                    placeholder='NAME' 
                    value={data.name} 
                    onChange={handleChange} 
                    className='touch-input'
                /><br />
                <input 
                    type='email' 
                    name='email' 
                    placeholder='EMAIL' 
                    value={data.email} 
                    onChange={handleChange} 
                    className='touch-input'

                /><br />
                <input 
                    type='text' 
                    name='message' 
                    placeholder='Message...' 
                    value={data.message} 
                    onChange={handleChange} 
                    className='touch-input'
                /><br />
                <button type='submit' className='touch-button'>Send Message</button>
            </form>


            </div>
          
        </div>
    );
}

export default GetinTouch;
