import { Badge } from '@/Components/ui/badge';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';


function AgentMessage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [update, setUpdate] = useState({
        status : ""
    })
    const authentication = localStorage.getItem("authToken");

    // Defined with useCallback so both the first load and the "Default" sort option can call it
    const fetchMessages = useCallback(async () => {
        if (!authentication) {
            toast.error("Please login to view messages");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/house/getMessage`, {
                headers: {
                    Authorization: `Bearer ${authentication}`
                }
            });

            if (response.data.success) {
                setError(null);
                setMessages(response.data.data || []);
            } else {
                setError(response.data.message || 'Failed to load messages');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching messages');
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [authentication]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);




    const getLatestMessage = async()=>{

    if(!authentication){
        console.log("Please login");
        return;
    }

    try{

        const response = await axios.get("/house/getLatestMessage", {
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



    const updateStatus = async (messageId, newStatus) => {
      try {
        const response = await axios.put(
          `/house/updateStatus/${messageId}`,
          { status: newStatus }, 
          {
            headers: {
              Authorization: `Bearer ${authentication}`,
              'Content-Type': 'application/json'
            }
          }
        );
    
        if (response.data.success) {
          setMessages(prev => prev.map(msg => 
            msg._id === messageId ? { ...msg, status: newStatus } : msg
          ));
          toast.success("Status updated successfully");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error(error.response?.data?.message || 'Error updating status');
      }
    };


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
        return <div className="p-4 mt-[100px] md:mt-[130px]">Loading messages...</div>;
    }

    

    return (<>
    {/* Sort row: the 260px right margin only applies on wide screens */}
    <div className='flex items-center gap-4 font-abyssinica justify-end mr-4 sm:mr-8 lg:mr-[260px] mt-[100px] md:mt-[130px] outline-none'>
    <Select onValueChange={(value)=>{
                if (value === "latest"){
                    getLatestMessage()
    
                } else if(value === "Default"){
                    fetchMessages();
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
           <div className="p-4 max-w-5xl mx-auto mt-[10px]">
  <h1 className="text-2xl sm:text-3xl font-bold text-[#dba829] ">Received Messages</h1>
  <p className="text-muted-foreground mb-6 text-sm sm:text-base">View and manage your property viewing appointments</p>

  {error && <p className="mb-4 text-red-500">{error}</p>}

  {messages.length === 0 ? (
    <p className="text-gray-500">No messages found</p>
  ) : (
    <div className="grid gap-4">
      {messages.map((message) => (
        <Card key={message._id} className="overflow-hidden ">
          <div className="flex">
            {/* Photo: smaller on phones so the details get the room */}
            <div className="w-[72px] h-[90px] mt-4 ml-4 shrink-0 sm:w-[120px] sm:h-[150px] sm:mt-7 sm:ml-6">
              <img
                src={message.from?.img || "/placeholder.svg"}
                alt={message.from?.name || "Unknown"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="break-words">{message.from?.name || "Unknown Sender"}</CardTitle>
                    <CardDescription className="mt-1 break-words">{message.from?.email || "No email provided"}</CardDescription>
                  </div>
                  <div className="shrink-0">{getStatus(message.status)}</div>
                </div>
              </CardHeader>

              <CardContent className="pb-2 px-4 sm:px-6">
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
                    <p className="text-sm text-muted-foreground break-words"> {message.message}</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-wrap justify-end gap-2 px-4 pb-4 sm:px-6 sm:pb-6">
                {message.status === "Pending" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => updateStatus(message._id ,"Cancelled" )}>
                      ❌ Cancel
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => updateStatus(message._id ,"Confirmed")}>
                      ✔️ Confirm
                    </Button>
                  </>
                )}
                {/* {message.status === "Cancelled" && (
                  <Button variant="outline" size="sm" onClick={() => updateStatus("Pending")}>
                    🔄 Reconsider
                  </Button>
                )} */}
                {/* {message.status === "Confirmed" && (
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                )} */}
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )}
</div>

    </>
    )
}

export default AgentMessage;