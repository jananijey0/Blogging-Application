import React, { useEffect} from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/loader.component'
export const profileDataStructure = {
    personal_info:{
        fullname:"",
        username:"",
        profile_img:"",
        bio:""
    },
   account_info: {
    total_reads:0,
    total_blogs:0

    },
    social_links:{ },
    joinedAt:" "
}

const ProfilePage = () => {
    let {id:profileId} = useParams();
    let [profile,setProfile] = useState(profileDataStructure);
    let [loading,setLoading] = useState(true);
    let {personal_info: { fullname, username: profile_username,profile_img,bio}, account_info:{total_posts,total_reads},social_links,joinedAt} = profile;


    const fetchUserProfile =() => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile",{
            user: profileId
        }).then(({data: user}) => {
            console.log(user);
            setProfile(user);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
    }
    useEffect(() =>
    {
        fetchUserProfile();
    },[])
  return (
    <AnimationWrapper>
        {
            loading ? <Loader/> : 
            <div>ProfilePage - {profileId}</div>
        }
    </AnimationWrapper>
   
  )
}

export default ProfilePage