import React from 'react'
import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css";
import { Card, CardDescription, CardTitle } from './ui/card';

function CardSkeleton() {
  return (
    <div >
      <Card className="h-[300px] w-[280px] shadow-lg" >
        <CardTitle><Skeleton width={280} height={200}/></CardTitle>
        <CardDescription><Skeleton width={250}  className='mt-3 '/></CardDescription>
        <CardDescription><Skeleton width={210}/></CardDescription>
        <CardDescription><Skeleton width={210}/></CardDescription>
        <CardDescription><Skeleton width={210}/></CardDescription>

        {/* <CardDescription><Skeleton/></CardDescription> */}

        
      </Card>
        
      
    </div>
  )
}

export default CardSkeleton
