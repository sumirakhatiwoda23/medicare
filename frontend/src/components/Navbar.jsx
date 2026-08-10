import { assets } from '@/assets/assets'
import { AppContext } from '@/context/AppContext';
import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {

const nav=useNavigate();


const{token,setToken , userData}=useContext(AppContext)
const[showMenu,setShowMenu]=useState(false)

const logout=()=>{
  setToken(false)
  localStorage.removeItem('token')
}

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 px-4 sm:px-[5%] border-b border-b-gray-400'>

      <img onClick={()=>nav('/')}
        className='w-44 cursor-pointer'
        src={assets.logo} alt="logo" />

      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          {({ isActive }) => (
            <>
              <li className='py-1'>HOME</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? '' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/doctors'>
          {({ isActive }) => (
            <>
              <li className='py-1'>ALL DOCTORS</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? '' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/about'>
          {({ isActive }) => (
            <>
              <li className='py-1'>ABOUT</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? '' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/contact'>
          {({ isActive }) => (
            <>
              <li className='py-1'>CONTACT</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? '' : 'hidden'}`} />
            </>
          )}
        </NavLink>
      </ul>

<div>
    {
        token 
        && userData
        ? 

        <div className='flex items-center gap-2 cursor-pointer group relative'>

     <img className='w-8 rounded-full' src={userData.image} alt="" />

     <img className='w-2.5' src={assets.dropdown_icon} alt="" />

     <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
       
        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
           
            <p onClick={()=>nav('/my-profile')}  className='hover:text-black cursor-pointer'>My Profile</p>
            <p onClick={()=>nav('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointment</p>
            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>

        </div>
     </div>
        </div>
        :
      <button onClick={()=>nav('/login')} 
      className='bg-primary text-primary-foreground cursor-pointer px-8 py-3 rounded-full font-light hidden md:block hover:opacity-90 transition'>
        Create Account
      </button>
    }
    <img onClick={()=>setShowMenu(true)}

    className='w-6 md:hidden '
    
    src=
    {assets.menu_icon} alt="" />
    {/*  mobile menu */}
    <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 botto-0 z-0 overflow-hidden bg-white transition-all`}>
      <div className='flex items-center justify-between px-5 py-6'>
        <img className='w-6' src={assets.logo} alt="" />
        <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
      </div>
      <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
        <NavLink onClick={()=>setShowMenu(false)}  to = '/'><p className=' px-4 py-2 rounded inline-block '>Home</p></NavLink>
        <NavLink onClick={()=>setShowMenu(false)} to = '/doctors'> <p className=' px-4 py-2 rounded inline-block '>ALL DOCTORS</p></NavLink>
        <NavLink onClick={()=>setShowMenu(false)} to = '/about'> <p className=' px-4 py-2 rounded inline-block '>ABOUT</p></NavLink>
        <NavLink onClick={()=>setShowMenu(false)} to = '/contact'><p className=' px-4 py-2 rounded inline-block '>CONTACT</p></NavLink>
      </ul>
    </div>

</div>

    </div>
  )
}