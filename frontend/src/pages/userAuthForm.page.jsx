import React,{ useRef,useContext} from 'react' 
import InputBox from '../components/input.component'
import googleIcon from '../imgs/google.png'
import { Link,Navigate} from 'react-router-dom';
 import App from '../App';
import {Toaster,toast} from 'react-hot-toast'; 
import AnimationWrapper from './../common/page-animation';
import axios from 'axios'
 import { UserContext} from '../App';
import { storeInSession } from '../common/session';
import { authWithGoogle } from '../common/firebase';
// Import necessary Firebase modules
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';


const UserAuthForm = ({type}) => {

      const authForm = useRef(); 
   
 let { userAuth: {access_token},setUserAuth } = useContext(UserContext); 

// let { userAuth } = useContext(UserContext);
// let access_token = userAuth?.access_token;
console.log(access_token);
     const userAuthThroughServer = (serverRoute,formData) =>{
 axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
     formData)
 .then(({data}) => {
     storeInSession("user",JSON.stringify(data))
      setUserAuth(data);
  
    
 }) 
 .catch(({response})=>{
     toast.error(response.data.error)
 })

     }
     const authWithGoogle = async () => {
          // Get the Auth instance
          const auth = getAuth();
          // Create a GoogleAuthProvider instance
          const provider = new GoogleAuthProvider();
        
          try {
            // Use signInWithPopup to trigger the Google Sign-In popup
            const result = await signInWithPopup(auth, provider);
            
            // Access the user from the result
            const user = result.user;
        
            // Check if user and accessToken are defined
            if (!user || !user.accessToken) {
              throw new Error('Access token is undefined');
            }
        
            // Return the user object
            return user;
          } catch (error) {
            // Handle any errors that occurred during the Google Sign-In process
            console.error('Error signing in with Google:', error.message);
            throw error;
          }
        };
        
    
const handleSubmit = (e) => {

     e.preventDefault();
     let serverRoute =type == "sign-in" ? "/signin" : "/signup";
     let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
 
    let form = new FormData(formElement);
    //let form = new FormData(authForm.current);
     let formData = {};
     for (let [key, value] of form.entries()) {
         formData[key] = value;
     }
    
 
     let { fullname, email, password } = formData;
 
     //form validation
     if(fullname) {

if(fullname && fullname.length < 3)
{
   return toast.error("Fullname must be at least 3 letters long")//invalidation sts code 403
}}
if(!email.length) {
    return toast.error("Please Enter Email")
}
if(!emailRegex.test(email)){
    return toast.error("Email is invalid")
}
if(!passwordRegex.test(password)){
    return toast.error("Password should be 6 to 20 characters long with a numeric,1 LowerCase and 1 UpperCase Letters")
} 
userAuthThroughServer(serverRoute,formData)
}

   
const handleGoogleAuth  = (e) =>{
     e.preventDefault();
     
  
    authWithGoogle().then(user =>
          {
               
               let serverRoute ='/google-auth';
               let formData = {
                    access_token: user.accessToken
               }

               userAuthThroughServer(serverRoute,formData)
          })
          .catch (err =>{
               toast.error('Trouble login through google')
               return console.log(err)
          })

}

   
  return (
      access_token ? ( <Navigate to = "/"/> ) :(
   <AnimationWrapper keyValue={type}>
   <section className='h-cover flex items-center justify-center'>
     <Toaster/>
<form id ='formElement' ref={authForm} className='w-[80%] max-w-[400px]'>
    
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
     name ="email"
     type = 'email'
     placeholder = "Email"
     icon ="fi-rr-envelope"
     />
<InputBox
     name ="password"
     type = "password"
     placeholder = "Password"
     icon ="fi-rr-key"
     />
     <button className='btn-dark center mt-14'
     type ="submit"
     onClick ={handleSubmit}
     >
          {type.replace("-" ," ")}
     </button>
     <div className='relative w-full flex items-center gap-2 my-10 opacity uppercase text-black font-bold'>

          <hr className='w-1/2 border-black'/>
          <p>or</p>
          <hr className='w-1/2 border-black'/>
     </div>
     <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center' onClick={handleGoogleAuth}>
          <img src={googleIcon} className='w-5'/>
     continue with google
     </button>
     {
          type == "sign-in" ? 
          <p className='mt-6 text-dark-grey text-xl text-center'>
               Don't have an account?
               <Link to='/signup' className='underline text-black'> 
               Join us Today.
               </Link>
          </p>
          : 
          <p className='mt-6 text-dark-grey text-xl text-center'>
               Already a member?
               <Link to='/signin' className='underline text-black'>Sign in here</Link></p>
     }
     
</form>

   </section>
   </AnimationWrapper>
  ))
}

export default UserAuthForm ;