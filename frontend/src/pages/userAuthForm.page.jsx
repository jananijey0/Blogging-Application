import React from 'react' 
import InputBox from '../components/input.component'
const UserAuthForm = ({type}) => {
  return (
   <section className='h-cover flex items-center justify-center'>
<form className='w-[80%] max-w-[400px]'>
    <h1 className=' text-4xl font-gelasio capitalize text-center mb-24'>{type == "sign-in"? "Welcome back": "Join us Today"}</h1>
{
    type != "sign-in" ?
     <InputBox
     name ="fullname"
     type = 'text'
     placeholder = "Full Name"
     icon ="fi-rr-user"
     />
     :""

}

<InputBox
     name ="Email"
     type = 'email '
     placeholder = "Email"
     icon ="fi-rr-envelope"
     />
<InputBox
     name ="Password"
     type = "password"
     placeholder = "Password"
     icon ="fi-rr-key"
     />
</form>

   </section>
  )
}

export default UserAuthForm