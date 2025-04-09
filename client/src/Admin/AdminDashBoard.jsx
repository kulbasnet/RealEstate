import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UpdateHouse from '@/components/UpdateHouse';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AlertDialogAction } from '@radix-ui/react-alert-dialog';
import toast from 'react-hot-toast';
import Delte from '@/components/Delte';
import TableSkeleton from '@/components/TableSkeleton';
import { Bar, Pie, Line  } from 'react-chartjs-2';
import { Chart as Chartjs, registerables } from 'chart.js';
Chartjs.register(...registerables);


function AdminDashBoard() {
  const [agents, setAgents] = useState([]);
  // const [houses, setHouses] = useState([]);
  const [usered, setUsered] = useState([]);
  const [isloading, setLoading] = useState(true);
  const authentication = localStorage.getItem("authToken");

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getUser", {
        headers: {
          "Authorization": `Bearer ${authentication}`
        }
      });
      setAgents(response.data.user); 
      setLoading(false);
      console.log("Agents List", response.data);
    } catch (error) {
      console.log("Error fetching ", error);
    }
  };


  const getUserOnly = async()=>{
    try{

      const response = await axios.get("http://localhost:8000/getUserOnly", {
        headers:{
          "Authorization" : `Bearer ${authentication}`
        }
      })
      setUsered(response.data.users);
      setLoading(false);

    }catch(error){
      console.log("Error fetching User", error);


    }
  }

  


  // const getHouse=async()=>{

  //   try{

  //     const response = await axios.get("http://localhost:8000/house/getHouse");
  //       setHouses(response.data.houses);
  //       setLoading(false);
  //       console.log(response.data.houses);

  //   }catch(error){
  //     console.log("Error", error.message);


  //   }
  // }



  const handleDelete = async(agentId)=>{
    try{
      const response = await axios.delete(`http://localhost:8000/userDelete/${agentId}`,{
        headers:{
          "Authorization" :`Bearer ${authentication}`
        }
       

        
      })

      if(response.data.success){
        toast.success("Account Deleted");
      }else{
        toast.error(response.data.message || "Deletation Failed");
      }




    }catch(error){
      console.log("Error", error);


    }
  

  }

  useEffect(() => {
    getUser();
    getUserOnly();
    // getHouse();
  }, []);


  return (<>
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-xl font-abyssinica mb-4 text-[#b98604] font-bold tracking-tight">Agents vs Users</h2>
    <Bar
      data={{
        labels: ['Agents', 'Users'],
        datasets: [
          {
            label: 'Count',
            data: [agents.length, usered.length],
            backgroundColor: ['#FFB74D', '#4FC3F7'],
          }
        ]
      }}
    />
  </div>


</div>
    <div className=' min-h-screen   '>
      <div className='flex mt-11'>
      <div className='container border mx-auto w-[600px] pt-3 pl-3 pr-3 rounded-md  bg-white '>
        <h1 className='font-abyssinica text-[#b98604] font-bold tracking-tight text-3xl mb-2'>Agents</h1>
        {isloading && Array(4).fill(0).map((_, index)=> <TableSkeleton key={index}/>)}
      <Table>
        <TableHeader>
          <TableRow>
           <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
           <TableHead>Email</TableHead>
          <TableHead className="text-right">Actions</TableHead>
           
                       

          </TableRow>
        </TableHeader>
        <TableBody>
        {agents.length > 0 ? (
        agents.map((agentItem, index) => (
          <TableRow key={agentItem._id || index}> 
            <TableCell className='text-black'>{agentItem.name}</TableCell>
            <TableCell className='text-black'>{agentItem.phoneNumber}</TableCell>
            <TableCell className='text-black'>{agentItem.email}</TableCell>
            <TableCell className='text-right'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='ghost'>
                    <Trash2/>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure that you want to delete this user?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>

                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(agentItem._id)}>
                      <Trash2/>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              

            </TableCell>



          </TableRow>
        ))
      ) : (
        <p className='flex justify-center'>No agents found</p>
      )}

        </TableBody>
      </Table>
      
    </div>


    <div className='container  border mx-auto w-[600px] pt-3 pl-3 pr-3 rounded-md  bg-white '>
        <h1 className='font-abyssinica text-[#b98604] font-bold tracking-tight text-3xl mb-2'>Users</h1>
        {isloading && Array(4).fill(0).map((_, index)=> <TableSkeleton key={index}/>)}

      <Table>
        <TableHeader>
          <TableRow>
           <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
           <TableHead>Email</TableHead>
          <TableHead className="text-right">Actions</TableHead>
           
                       

          </TableRow>
        </TableHeader>
        <TableBody>
        {usered.length > 0 ? (
        usered.map((userItem, index) => (
          <TableRow key={userItem._id || index}> 
            <TableCell className='text-black'>{userItem.name}</TableCell>
            <TableCell className='text-black'>{userItem.phoneNumber}</TableCell>
            <TableCell className='text-black'>{userItem.email}</TableCell>
            <TableCell className='text-right'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='ghost'>
                    <Trash2/>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure that you want to delete this user?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>

                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(userItem._id)}>
                      <Trash2/>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              

            </TableCell>



          </TableRow>
        ))
      ) : (
        <p className='font-abyssinica'>No Users found</p>
      )}

        </TableBody>
      </Table>
      
    </div>


      </div>
  
  </div>


  
  </>
  
    
  );
}

export default AdminDashBoard;