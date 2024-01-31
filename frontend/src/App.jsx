import { Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext,useEffect,useState } from "react";
import {lookInSession} from "./common/session.jsx"
import Editor from './pages/editor.pages';
import HomePage from "./pages/home.page.jsx";
import SearchPage from "./pages/search.page.jsx";
import PageNotFound from "./pages/404.page.jsx";
import ProfilePage from "./pages/profile.page.jsx";
import BlogPage from "./pages/blog.page.jsx";
import SideNav from "./components/sidenavbar.component.jsx";
import ChangePassword from "./pages/change-password.page.jsx";
import EditProfile from "./pages/edit-profile.page.jsx";
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
        <Route path ='/editor' element ={<Editor/>}/>
        <Route path ='/editor/:blog_id' element ={<Editor/>}/>
        <Route Route path = '/' element ={<Navbar/>}>
        <Route index element = {<HomePage/>}/>
        <Route path="settings" element ={<SideNav/>}>
            <Route path ="edit-profile" element={<EditProfile/>}/>
            <Route path ="change-password" element={<ChangePassword/>}/>
        </Route>
        <Route  path = 'signin' element ={<UserAuthForm type= 'sign-in'/> }/>
        <Route  path = 'signup' element ={<UserAuthForm type= 'sign-up'/>}/>
        <Route  path = 'search/:query' element = {<SearchPage/>}/>
        <Route  path = 'user/:id' element = {<ProfilePage/>}/>
        <Route path ="blog/:blog_id" element = {<BlogPage/>}/>
        <Route path ='*'element ={<PageNotFound/>}/>
       
    </Route>
       </Routes>
       </UserContext.Provider>

    )
}

export default App;
