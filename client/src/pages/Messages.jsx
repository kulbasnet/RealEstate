import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MessageUpdate from '@/components/MessageUpdate';



function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const [error, setError] = useState('');
    const authentication = localStorage.getItem("authToken");



    const getMessage = async () => {
        if (!authentication) {
            setError("Please log in to view messages");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/house/getMessage", {
                headers: {
                    Authorization: `Bearer ${authentication}`
                }
            });

            if (response.data.success) {
                setMessages(response.data.data || []);
                console.log(response.data.data)
            } else {
                setError(response.data.message || "Failed to fetch messages");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Server error");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getMessage();
    }
        , [authentication]);


const getLatestMessage = async()=>{

    if(!authentication){
        console.log("Please login");
        return;
    }

    try{

        const response = await axios.get("http://localhost:8000/house/getLatestMessage", {
            headers:{
                Authorization : `Bearer ${authentication}`
            }
        })

        if(response.data.success){
            setMessages(response.data.data);
            console.log(response.data.data);
        }else{
            console.log("Sorry error");
        }

        
    }catch(error){
        console.log("Error", error);

    }
}

    // const handleReconsider=(message)=>{
    //     setReconsider(message);

    // }

        function getStatus(status){
            switch(status){
                case "Pending" :
                return <Badge className="bg-blue-500 hover:bg-blue-600">Pending </Badge>
    
                case "Confirmed":
                    return <Badge className="bg-green-500 hover:bg-green-600"> Confirmed</Badge>
    
                case "Cancelled":
                    return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
            }
    
        }
    

    if (loading) {
        return <div>Loading messages...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
        <div className='flex items-center gap-4 font-abyssinica justify-end mr-[260px] mt-[130px] outline-none '>
            <Select onValueChange={(value)=>{
                if (value === "latest"){
                    getLatestMessage()
    
                } else if(value === "Default"){
                    getMessage();
                }

            }  }  >
                <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="SORT"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latest" >Latest</SelectItem>
                    <SelectItem value="Default" >Default</SelectItem>

                </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
            </Button>
        </div>
                <div className="p-4 max-w-5xl mx-auto mt-[10px] ">
        <h1 className="text-3xl font-bold text-[#dba829] ">Received Messages</h1>
        <p className="text-muted-foreground mb-11">View and manage your appointments</p>
      
      
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages found</p>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card key={message._id} className="overflow-hidden ">
                <div className="flex">
                  <div className="w-[120px]  h-[150px] mt-7 ml-6 ">
                    <img
                      src={message.to?.img || "/placeholder.svg"}
                      alt={message.to?.name || "Unknown"}
                      className="w-full h-full "
                    />
                  </div>
      
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{message.to?.name || "Unknown Sender"}</CardTitle>
                          <CardDescription className="mt-1">{message.to?.email || "No email provided"}</CardDescription>
                        </div>
                        {getStatus(message.status)}
                      </div>
                    </CardHeader>
      
                    <CardContent className="pb-2">
                        <div className="flex items-center gap-2 justify-end">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(message.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(message.date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
      
                      {message.message && (
                        <div >
                          <p className='font-bold'>Messages:</p>
                          <p className="text-sm text-muted-foreground"> {message.message}</p>
                        </div>
                      )}
                    </CardContent>
      
                    <CardFooter className="flex justify-end gap-2">
                      
                      {message.status === "Cancelled" && (
                        <>
                         <MessageUpdate  messageId={message._id} key={message._id} />

                        <Button variant="destructive" size="sm" className='bg-red-700'> Cancel</Button>


                        </>
                      )}
                     
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        




      </div>

        </>
          );
}

export default Messages;