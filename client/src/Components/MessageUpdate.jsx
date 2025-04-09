import React from 'react'
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


function MessageUpdate({messageId}) {
    const [reconsider , setReconsider] = useState({
        name: "",
        status:"Pending",
       message:"",
       phoneNumber:""
    });
    const [selectDate, setSelectDate] = useState(null);
const authentication = localStorage.getItem("authToken");


    const updateMessage = async (e)=>{
        e.preventDefault();

        // if(!authentication){
        //     console.log("No toekn found");
        //     toast.error("No aithentication found");
        //     return;
        // }

        const {name, message, phoneNumber, status} = reconsider;

        try{
            const response = await axios.put(`http://localhost:8000/house/updateMessage/${messageId}`, {

                ...reconsider,
                date: selectDate.toISOString() 

            }, 
            {
                headers:{
                    Authorization: `Bearer ${authentication}`
                }
            })

            if(response.data.error){
                toast.error("Sorry error");
                console.log(response.data.error);
            }else{
                setReconsider({
                    name:"",
                    phoneNumber:"",
                    status:"Pending",
                    message:""

                })
                toast.success("AppointMent Updated");
            }

        }catch(error){
            console.log("Error", error);
            toast.error("Sorry can be updated");

        }
    }


    function handleName(e){
        setReconsider(prev=>({...prev, name: e.target.value}));

    }

    function handlePhonenumber(e){
        setReconsider(prev=>({...prev, phoneNumber: e.target.value}));
    }

    function handleStatus(e){
        setReconsider(prev=>({...prev, status: e.target.value}));
    }
    function handleMessage(e){
        setReconsider(prev=>({...prev, message: e.target.value}));
    }


  return (
    <div>
           <Dialog >
                      <DialogTrigger asChild>
                      <Button variant="ghost" size="icon"  className="bg-[#081740] text-white">
                      <span className="sr-only">Reconsider</span>
                    </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[495px]" >
                        <DialogHeader>
                        <DialogTitle className="font-bold font-abyssinica text-lg">Update Booking</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={updateMessage}>
                        <div className="grid gap-4 ">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                        
                            <Input id="name" p onChange={handleName} value={reconsider.name} />
                            <p className='text-gray-400 font-mono text-xs '>*Please enter correct and full Name*</p>

                          </div>                 
                          <div className="grid gap-2">
                            <Label htmlFor="number">Phone Number</Label>
                           <Input  id="phoneNumber" type="number" onChange={handlePhonenumber} value={reconsider.phoneNumber} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="text" >Message</Label>
                            <Input  id="message" type="text" onChange={handleMessage} value={reconsider.message} />
                          </div> 
                         
                          
                          

                          {/* <div className="grid gap-2">
                            <Label htmlFor="time" >Time </Label>
                            <Input id="time" value={house.Description} onChange={handleDescription}  />
                          </div> */}

                          

                          <Popover>
                            <PopoverTrigger asChild>
                                <button>    
                                    <CalendarIcon/>
                                    {selectDate ? format(selectDate, "PPP"): "pick a date"}
                                </button>

                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar mode="single" selected ={selectDate} onSelect={setSelectDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className='mt-4 hover:bg-[#dda61a]'>Update</Button>
                        </DialogFooter>
                        </form>
                        
                      </DialogContent>
                    </Dialog>



      
    </div>
  )
}

export default MessageUpdate
