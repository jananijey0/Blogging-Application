import React, { useContext } from 'react' 
import lightPageNotFoundImage from "../imgs/404-light.png"
import darkPageNotFoundImage from "../imgs/404-dark.png"
import { Link } from 'react-router-dom'
import LightfullLogo from '../imgs/full-logo-light.png'
import DarkfullLogo from '../imgs/full-logo-dark.png'
import { ThemeContext } from '../App'
const PageNotFound = () => {

  let {theme} = useContext(ThemeContext)
  return (
   <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
    <img src = {theme == 'light' ? darkPageNotFoundImage : lightPageNotFoundImage} className='select-none border-2 border-grey w-72 aspect-square object-cover rounded'/>
   <h1 className='text-4xl font-gelasio leading-7'>Page Not Found</h1>
   
   
   <p className='text-dark-grey text-xl leading-7 -mt-8'>The page you are looking for does not exists.Headback to <Link to ='/' className='text-black underline'>HomePage</Link></p>
   <div className='mt-auto'>
    <img src ={theme == 'light' ? DarkfullLogo : LightfullLogo} className='h-8 object-contain block mx-auto select-none'/>
  <p className='mt-5 text-dark-grey'>Read Millions of stories around the world</p>
  </div>
   </section>
  
  )
}

export default PageNotFound