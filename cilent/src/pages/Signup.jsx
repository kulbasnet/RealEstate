import React, { useState } from 'react';
import photo from './photo1.jpg';

function Signup() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });

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

    // const userSignUp = (e) => {
    //     e.preventDefault();
    //     const { name, email, password } = data;
    //     try {
    //         // Your signup logic here
    //     } catch (err) {
    //         console.log('Error occurred during Signup', err);
    //     }
    // };

    return (
        <div>
            <img src={photo} alt='pic' className='image'/>
        <div className='sign'>
            <h1 className='heading'>Sign Up</h1>
            
            <form >
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
        </div>
        </div>
    );
}

export default Signup;
