import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function RootLayout() {
  return (
    <div>

        <Navbar/>
<Outlet/>
        <Footer/>

       

       

    </div>
  )
}
