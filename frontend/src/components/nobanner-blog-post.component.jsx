import React from 'react'
import { Link } from 'react-router-dom';
const MinimalBlogPost = ({blog,index}) => {
    let {title,blog_id:id,author:{personal_info: {fullname,user,profile_img},publishedAt}}= blog;
  return (
    <Link to = {`/blog/${id}`} class="flex gap-3 mb-4"
    ><h1>{index + 1}</h1></Link>
  )
}

export default MinimalBlogPost