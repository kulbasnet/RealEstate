import React from 'react'
import { Outlet } from 'react-router-dom'

function WithoutNav() {
  return (
    <div>
  <Outlet/>
    
    </div>
  )
}

export default WithoutNav
