import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';

function AgentMessage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState({
        status : ""
    })
    const authentication = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchMessages = async () => {
            if (!authentication) {
                toast.error("Please login to view messages");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/house/getMessage`, {
                    headers: {
                        Authorization: `Bearer ${authentication}`
                    }
                });

                if (response.data.success) {
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
        };

        fetchMessages();
    }, [authentication]);


    const updateStatus = async (messageId, newStatus) => {
      try {
        const response = await axios.put(
          `http://localhost:8000/house/updateStatus/${messageId}`,
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


    function handleStatus(e){
        setMessages(prev=>({...prev, status: e.target.value}))
    }

   


    if (loading) {
        return <div className="p-4">Loading messages...</div>;
    }

    

    return (
       <div className="p-4 max-w-5xl mx-auto mt-5">
  <h1 className="text-3xl font-bold text-[#dba829] ">Received Messages</h1>
  <p className="text-muted-foreground mb-6">View and manage your property viewing appointments</p>


  {messages.length === 0 ? (
    <p className="text-gray-500">No messages found</p>
  ) : (
    <div className="grid gap-4">
      {messages.map((message) => (
        <Card key={message._id} className="overflow-hidden ">
          <div className="flex">
            <div className="w-[120px]  h-[150px] mt-7 ml-6 ">
              <img
                src={message.from?.img || "/placeholder.svg"}
                alt={message.from?.name || "Unknown"}
                className="w-full h-full "
              />
            </div>

            <div className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{message.from?.name || "Unknown Sender"}</CardTitle>
                    <CardDescription className="mt-1">{message.from?.email || "No email provided"}</CardDescription>
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
                {message.status === "Pending" && (
                  <>
                    <button variant="outline" size="sm" onChange={handleStatus}  onClick={() => updateStatus(message._id ,"Cancelled" )}>
                      ❌ Cancel
                    </button>
                    <button variant="success" size="sm" onChange={handleStatus}  onClick={() => updateStatus(message._id ,"Confirmed")}>
                      ✔️ Confirm
                    </button>
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
    )
}

export default AgentMessage;