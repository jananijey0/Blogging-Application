import React, { useState } from 'react'
import logo from '../imgs/logo.png'
import { Link,Outlet } from 'react-router-dom'

const   Navbar = () => {
    //creating state for search box visibility
    const [ searchBoxVisiblity , setSearchBoxVisibility] = useState(false)
  return (
    <>
    <div className='navbar'>  
    <Link to = "/"className='flex-none w-10'>
    <img src={logo} />
    </Link>
    <div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:pl-12 md:show ' + (searchBoxVisiblity ? "show": "hide")}>
        <input 
        placeholder='Search'
        type='text'
        className=' w-full bg-grey md:w-auto p-4 pl-6 pr-[12%] md:pr-6 rounded-full placholder:text-dark-grey'
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl" ></i>
    </div>
    <div className=' flex items-center gap-3 md:gap-6 ml-auto '> 
    <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
    onClick={()=> setSearchBoxVisibility(currentVal => !currentVal)}
    ><i className="fi fi-rr-search text-xl"></i>
    
    </button>
    <Link to ='/editor' className='hidden md:flex gap-2 link text dark-grey'>
    <i className ="fi fi-rr-file-edit"></i>
<p>Write</p>
    </Link>

    <Link className=' btn-dark py-2 to ' to ='/signin'>
        Sign In 
    </Link>
    <Link className=' btn-light py-2 to  hidden md:block' to ='/signup'>
        Sign Up
    </Link>
    </div>
    </div>
    <Outlet/>
    </>
  )
}

export default   Navbar