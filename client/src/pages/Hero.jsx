import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import React from 'react';
import sell from './sell.jpg';
import buy from './buy.jpg';
import agent from './agent.png';
import burberry from './burberry.png';
import house from './house.jpg';
import  {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '@/components/Footer';
import LatestHouse from '@/components/LatestHouse';
import { useState } from 'react';

function Hero({handleSearch, onSearch}) {
  const [searchinput, setSearchInput] = useState('');

  return (<>
<div className="relative mt-[100px]">
  <img src={house} alt="pic" className="w-full h-[520px] object-cover" />

  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
    <h1 className="text-white font-semibold font-abyssinica text-5xl mb-2">Agent. Homes.</h1>
    
    <div >
      <SearchBar onSearch={handleSearch} searchinput={searchinput} setSearchInput={setSearchInput}/>
    </div>
  </div>
</div>

      <div>
        
      <div className=' ml-[160px] mt-[40px]'>
          <h1 className=' font-semibold text-2xl'>Homes For You</h1>
          <p className='text-gray-600 '>Based on homes you recently viewed </p>
          </div>
          <Card className="h-[340px] w-96 mt-[20px] ml-[160px] flex flex-col items-center text-center p-4 shadow-lg">
  <CardHeader className="flex flex-col items-center gap-4">
    <img src={sell} alt="pic" className="w-full h-50 object-cover" />
    <CardTitle className="font-abyssinica text-2xl">Buy a Home</CardTitle>
    <CardDescription className="text-black px-10">
    </CardDescription>
    <CardContent>
      
    </CardContent>
  </CardHeader>
</Card>
      </div>

      <div>
        <LatestHouse  />
      </div>
        
        

        <div className='flex justify-center gap-8 mb-16'>
        <Card className="h-[480px] w-96 mt-[110px] flex flex-col items-center text-center p-4 shadow-lg">
  <CardHeader className="flex flex-col items-center gap-4">
    <img src={sell} alt="pic" className="w-full h-50 object-cover" />
    <CardTitle className="font-abyssinica text-2xl">Buy a Home</CardTitle>
    <CardDescription className="text-black px-10">
      Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.
    </CardDescription>
    <CardContent>
      <Link to={'/'}>
        <Button className="bg-[#081740] text-white px-6 py-2 rounded-md hover:bg-[#06122e] transition">
          Browse Homes
        </Button>
      </Link>
    </CardContent>
  </CardHeader>
</Card>


<Card className="h-[480px] w-96 mt-[110px] flex flex-col items-center text-center p-4 shadow-lg">
  <CardHeader className="flex flex-col items-center gap-4">
    <img src={buy} alt="pic" className="w-full h-45 object-cover" />
    <CardTitle className="font-abyssinica text-2xl">Sell a Home</CardTitle>
    <CardDescription className="text-black  ">
    Regardless of the approach you choose to undertake in selling your home, we are equipped to assist you in achieving a successful transaction.   </CardDescription>
    <CardContent>
      <Link to={'/sell'}>
        <Button className="bg-[#081740] text-white px-6 py-2 rounded-md hover:bg-[#06122e] transition">
          See your options
        </Button>
      </Link>
    </CardContent>
  </CardHeader>
</Card>

<Card className="h-[480px] w-96 mt-[110px] flex flex-col items-center text-center p-4 shadow-lg">
  <CardHeader className="flex flex-col items-center gap-4">
    <img src={agent} alt="pic" className="w-ful h-48 object-cover" />
    <CardTitle className="font-abyssinica text-2xl">Find an Agent</CardTitle>
    <CardDescription className="text-black px-10">
    Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else. </CardDescription>
 <CardContent>
      <Link to={'/agent'}>
        <Button className="bg-[#081740] text-white px-6 py-2 rounded-md hover:bg-[#06122e] transition">
          Find Agents
        </Button>
      </Link>
    </CardContent>
  </CardHeader>
</Card>
    </div>

    <div className='bg-[#081740] flex justify-center items-center  mb-10 h-[550px] px-8'>
  <img src={burberry} alt='picture' className='h-[450px] mt-10 mr-20' />

  <div className="flex flex-col text-white max-w-lg">
    <h1 className='text-4xl font-abyssinica mb-4'>Our Story</h1>
    <p className="mb-4 text-base ">
      Only one network of agents represents the longest standing tastemaker in the world. In the spirit of innovation, an exceptional luxury real estate company bearing the Basnet's Realties name was launched in 1976. Beyond the beautiful properties and the personal touch of our agents, only one brand can deliver a lifestyle that caters to you. With a network of homes for sale worldwide, our website lets you search property listings globally, and includes a large inventory of luxury homes for sale, including houses, condos, townhomes, villas, and more.
    </p>
    <Link to={'/about'} className="text-white font-semibold flex items-center gap-2 hover:underline">
      Read More <FontAwesomeIcon icon={faArrowRight} />
    </Link>
  </div>
</div>

<Footer/>

  </>
  )
}

export default Hero
