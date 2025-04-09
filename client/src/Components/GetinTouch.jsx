import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';

function GetinTouch({ house }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        message: "",
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const authToken = localStorage.getItem("authToken");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authToken) {
            toast.error("Please log in to send a message");
            return;
        }

        if (!selectedDate) {
            toast.error("Please select a date");
            return;
        }

        try {
            const { data } = await axios.post(
                `http://localhost:8000/house/getinTouch/${house._id}`,
                {
                    ...formData,
                    date: selectedDate.toISOString()
                },
                {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    },
                }
            );

            if (data.error) {
                toast.error(data.error);
            } else {
                setFormData({ name: "", email: "", message: "" });
                setSelectedDate(null);
                toast.success("Message Sent");
            }
        } catch (error) {
            console.log("Error occurred:", error.message);
            toast.error(error.response?.data?.error || "Failed to send message");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div id='getInTouchSection' className='bg-[#081740] h-[300px] flex w-full items-center justify-center px-10'>
            <form onSubmit={handleSubmit} className="flex w-full max-w-5xl justify-between">
                {/* Agent Details */}
                {house?.listedBy && (
                    <div className="agent-det text-white flex mt-3">
                        {house.listedBy.img ? (
                            <img 
                                src={house.listedBy.img} 
                                alt="Agent" 
                                className="w-[100px] h-[88px]"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
                                <span className="text-xs">No Image</span>
                            </div>
                        )}
                        <div className="ml-3 mt-3">
                            <p className="text-2xl font-abyssinica">{house.listedBy.name || "Anonymous Agent"}</p>
                            {house.listedBy.phoneNumber && (
                                <p className="text-sm">+977 {house.listedBy.phoneNumber}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className='flex flex-col items-start'>
                    <h1 className='text-white font-abyssinica text-2xl mb-2 ml-[85px]'>Get In Touch</h1>
                    
                    <input 
                        type='text' 
                        name='name' 
                        placeholder='NAME' 
                        value={formData.name} 
                        onChange={handleChange} 
                        className='touch-input w-full mb-2'
                    />
                    <input 
                        type='email' 
                        name='email' 
                        placeholder='EMAIL' 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        className='touch-input w-full mb-2'
                    />
                    <input 
                        type='text' 
                        name='message' 
                        placeholder='Message...' 
                        value={formData.message} 
                        onChange={handleChange} 
                        className='touch-input w-full mb-2'
                    />

                    <Popover>
                        <PopoverTrigger asChild>
                            <button className='bg-[#081740] text-white flex mt-2 ml-[100px] gap-1'>
                                <CalendarIcon />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar 
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <button type='submit' className='bg-[#b98604] border-none h-10 mt-3 px-6 rounded self-center text-white'>
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
}

export default GetinTouch;