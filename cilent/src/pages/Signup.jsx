import React, { useState } from 'react';
import photo from './photo1.jpg';
import { Link , useNavigate} from 'react-router-dom';
import Axios from "axios";

function Signup() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });

  const navigate = useNavigate();

    const userSignUp = async (e)=>{
        e.preventDefault();
        const {name, email,password} = data;
        try{
            const {data} = await Axios.post("/Signup",{
                name,email,password
            })

            if(!data){
                console.log("sorry");
            }else{
                setData({});
                navigate('/Login');
            }

        }catch(err){
            console.error("Sorry somthig is wrong",err.message);

        }
    }




    // Function to handle form data changes
    function handleName(e) {
        setData({ ...data, name: e.target.value });
    }

    function handleEmail(e) {
        setData({ ...data, email: e.target.value });
    }

    function handlePassword(e) {
        setData({ ...data, password: e.target.value });
    }


    return (
        <div>
            <img src={photo} alt='pic' className='image'/>
        <div className='sign'>
            <h1 className='heading'>Sign Up</h1>
            
            <form onSubmit={userSignUp} >
                <label className='label'>Name</label><br />
                <input
                    className='input'
                   
                    value={data.name}
                    onChange={handleName}
                /><br />
                <label className='label'>Email</label><br />
                <input
                    className='input'
                    
                    value={data.email}
                    onChange={handleEmail}
                /><br />
                <label className='label'>Password</label><br />
                <input
                    className='input'
              
                    value={data.password}
                    onChange={handlePassword}
                /><br />
                <button className='button' type='submit'>Submit</button>
        
            </form>
      <p className='link-sign'> Back to <Link to={"/Login"} className='link-underline'>Login</Link></p>  
        </div>
        </div>
    );
}

export default Signup;
