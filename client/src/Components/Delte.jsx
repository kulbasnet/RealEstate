import axios from 'axios'
import React from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {toast} from 'react-hot-toast';
import { Trash2 } from 'lucide-react';


function Delte({houseId}) {
    console.log("houseId",houseId);

//    const authToken = localStorage.getItem("authToken");

    const houseDelete = async()=>{
        const token = localStorage.getItem("authToken")
        if(!token){
            console.log("No authentication");
            return;
        }
        try{
            const response = await axios.delete(`http://localhost:8000/house/delete/${houseId}`,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            if(response.data.success){
                toast.success("House Has been deleted");
                console.log(response.data.message);
            }else{
                toast.error('Sorry some error');
                console.log(response.data.error);
            }

        }catch(error){
            console.log(`Error:${error.message}`);
        }
    }


  return (
    <div>
        
<button onClick={houseDelete} className="p-2 rounded">
    <Trash2/>
</button>
        
       
      
    </div>
  )
}

export default Delte
