import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Card() {
  return (
    <div>
        <div className='card'>
        <img src='' alt='picture' className='img-card'/>
        <FontAwesomeIcon icon={faStar} className='star-card' />
        <h3 className='card-title'> Title</h3>
        <p className='card-details'> Details</p>


        </div>
       

      
    </div>
  )
}

export default Card
