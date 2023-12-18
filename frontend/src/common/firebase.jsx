// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg841HkTAnGKlj-QF04va-tYdLgZ4tyiQ",
  authDomain: "blogging-application-b9b6d.firebaseapp.com",
  projectId: "blogging-application-b9b6d",
  storageBucket: "blogging-application-b9b6d.appspot.com",
  messagingSenderId: "530462115233",
  appId: "1:530462115233:web:97d5e0e6c8be0514d477e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//google auth
const provider = new GoogleAuthProvider
const auth = getAuth();
export const authWithGoogle = async() =>
{
    let user = null ;
    await signInWithPopup(auth,provider) 
    .then((result) => {
        user = result.user 
    })
    .catch((err) =>{
        console.log(err)
    })
}