import React, { useState } from 'react';
import Axios from 'axios';

function GetinTouch() {
    const [data, setData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const getinTouch = async (e) => {
        e.preventDefault();
        const { name, email, message } = data;

        try {
            const {data} = await Axios.post('http://localhost:6001/touch', { name, email, message });
            if (data) {
                setData({ name: "", email: "", message: "" }); // Clear the form after submission
                console.log("Message has been sent");
            } else {
                console.log('Sorry, something went wrong.');
            }
        } catch (error) {
            console.log("Some error occurred:", error.message);
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value // Update the specific field
        });
    };

    return (
        <div>
            <br />
            <form onSubmit={getinTouch}>
                <input 
                    type='text' 
                    name='name' 
                    placeholder='NAME' 
                    value={data.name} 
                    onChange={handleChange} 
                /><br />
                <input 
                    type='email' 
                    name='email' 
                    placeholder='EMAIL' 
                    value={data.email} 
                    onChange={handleChange} 
                /><br />
                <input 
                    type='text' 
                    name='message' 
                    placeholder='MESSAGE' 
                    value={data.message} 
                    onChange={handleChange} 
                /><br />
                <button type='submit'>Send Message</button>
            </form>
        </div>
    );
}

export default GetinTouch;
