import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import TableSkeleton from '@/components/TableSkeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {  AlertDialogAction,AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Delte from '@/components/Delte';
import {  Pie, Line  } from 'react-chartjs-2';
import { Chart as Chartjs, registerables } from 'chart.js';
Chartjs.register(...registerables);



function AdminAnalystics() {
    const [houses, setHouses] = useState([]);
      const [isloading, setLoading] = useState(true);


      useEffect(()=>{
        getHouse();
      })


      const getHouse=async()=>{

        try{
    
          const response = await axios.get("http://localhost:8000/house/getHouse");
            setHouses(response.data.houses);
            setLoading(false);
            console.log(response.data.houses);
    
        }catch(error){
          console.log("Error", error.message);
    
    
        }
      }
    
    
  
  return (
    <div>

<div className="container mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-4 bg-white rounded-lg shadow col-span-2 border">
            <h2 className="text-xl font-bold mb-4 text-[#b98604]">Price Distribution</h2>
            <Line
              data={{
                labels: houses.map(house => house.location),
                datasets: [
                  {
                    label: 'Price',
                    data: houses.map(house => house.price),
                    borderColor: '#4CAF50',
                    tension: 0.1,
                  }
                ]
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>


          <div className="p-4 bg-white rounded-lg shadow mt-8 border">
          <h2 className="text-xl font-bold mb-4 text-[#b98604] ">Property Types</h2>
          <Pie
            data={{
              labels: [...new Set(houses.map(house => house.propertyType))],
              datasets: [
                {
                  data: [...new Set(houses.map(house => house.propertyType))].map(type => 
                    houses.filter(house => house.propertyType === type).length
                  ),
                  backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                  ],
                }
              ]
            }}
          />
        </div>

        
          {/* Status Distribution */}
          <div className="p-4 bg-white rounded-lg shadow mt-8 border">
            <h2 className="text-xl font-bold mb-4 text-[#b98604]">Property Status</h2>
            <Pie
              data={{
                labels: ['For Rent', 'For Sale'],
                datasets: [
                  {
                    data: [
                      houses.filter(house => house.status === 'Rent').length,
                      houses.filter(house => house.status === 'Sale').length
                    ],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                  }
                ]
              }}
            />
          </div>
        
      


</div>

      
          <div  className='container mx-auto w-[1200px] rounded-md border mt-[30px] bg-white pl-2 pr-3 pt-6 '>
    <h1 className='font-abyssinica ml-3 text-[#b98604] font-bold tracking-tight text-3xl  '>Property</h1>
    {isloading && Array(4).fill(0).map((_, index)=> <TableSkeleton key={index}/>)}
    <Table>
        <TableHeader>
          <TableRow>
          <TableHead>Image</TableHead>
           <TableHead>location</TableHead>
            <TableHead>Price</TableHead>
           <TableHead>Size</TableHead>
           <TableHead>Property Number</TableHead>
           <TableHead>Property Type</TableHead>
           <TableHead>Bedroom</TableHead>
           <TableHead>Bathroom</TableHead>
           <TableHead>Status</TableHead>
           <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {houses.length > 0 ? (
        houses.map((house, index) => (
          <TableRow key={house._id || index}> 
            <TableCell className='text-black w-11 h-11'><img src={house.img}/></TableCell>
            <TableCell className='text-black'>{house.location}</TableCell>
            <TableCell className='text-black'>{house.price}</TableCell>
            <TableCell className='text-black'>{house.size}</TableCell>
            <TableCell className='text-black'>{house.propertyNumber}</TableCell>
            <TableCell className='text-black'>{house.propertyType}</TableCell>
            <TableCell className='text-black'>{house.Bedroom}</TableCell>
            <TableCell className='text-black'>{house.Bathrooms}</TableCell>
            <TableCell className='text-black'>{house.status}</TableCell>
            <TableCell className='text-black'>{house.Description}</TableCell>


            <TableCell className='text-right'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='ghost'>
                    <Trash2/>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure that you want to delete this House?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>

                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction >
                     <Delte houseId={house._id}/>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              

            </TableCell>



          </TableRow>
        ))
      ) : (
        <p>No agents found</p>
      )}

        </TableBody>
      </Table>
    </div>

      
    </div>
  )
}

export default AdminAnalystics
