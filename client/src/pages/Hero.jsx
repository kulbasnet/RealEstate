import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import React from 'react'

function Hero() {
  return (
    <div className="pt-[100px]" >
        <SearchBar />

        <div className='flex justify-center gap-8'>

        <Card className='h-96 w-96 mt-[110px] '>
            <CardHeader>
                <CardTitle className='font-abyssinica'>Buy a home</CardTitle>
                <CardDescription>Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.</CardDescription>
                <CardContent>
                <Link to={'/'}>  <Button>Browse Homes</Button></Link>
                </CardContent>
            </CardHeader>
        </Card>

        <Card className='h-96 w-96 mt-[110px]'>
            <CardHeader>
                <CardTitle>Sell a home</CardTitle>
                <CardDescription>Whatever route you decide to pursue to sell your house, we can guide you to a profitable transaction..</CardDescription>
                <CardContent>
                <Link to={'/sell'}>  <Button>See your options</Button></Link>
                </CardContent>
            </CardHeader>
        </Card>

        <Card className='h-96 w-96 mt-[110px]'>
            <CardHeader>
                <CardTitle>FInd an Agent</CardTitle>
                <CardDescription>Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.</CardDescription>
                <CardContent>
                <Link to={'/agent'}>  <Button>Browse Agents</Button></Link>
                </CardContent>
            </CardHeader>
        </Card>




            
        </div>
    </div>
  )
}

export default Hero
