import { Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext,useEffect,useState } from "react";
import {lookInSession} from "./common/session.jsx"

 export const UserContext = createContext({});   //global state can access it from anywhere on the port - context
const App = () => {
    const [userAuth,setUserAuth] = useState({});

    useEffect(()=>
    {
        
 let userInSession = lookInSession("user");
userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
    },[])  //runs only once when rendering is complete
    return (
    
            <UserContext.Provider value={{ userAuth, setUserAuth }}>
       <Routes>
        <Route  path = '/' element ={<Navbar/>}>
        <Route  path = 'signin' element ={<UserAuthForm type= 'sign-in'/> }/>
        <Route  path = 'signup' element ={<UserAuthForm type= 'sign-up'/>}/>
        </Route>
    
       </Routes>
       </UserContext.Provider>

    )
}

export default App;
//  