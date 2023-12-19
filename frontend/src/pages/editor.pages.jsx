import React, { useContext, useState,createContext } from 'react'
import { UserContext } from './../App';
import { Navigate, } from 'react-router-dom';
import PublishForm from '../components/publish-form.component';
import BlogEditor from '../components/blog-editor.component';
const BlogStructure =
{
  title :'',
  banner: '',
  content:[],
  tags:[],
  des:'',
  author:{personal_info:{ }}
  
}
export const EditorContext = createContext ({

})
const Editor = () => {
const [blog,setBlog] =useState(BlogStructure)
    const [editorState, setEditorState] =useState("editor");
const [textEditor, setTextEditor] = useState({isReady:false});
    let {userAuth:{access_token }} = useContext(UserContext)

  return (
    <EditorContext.Provider value ={{blog,setBlog,editorState,setEditorState,textEditor,setTextEditor}}>
      {
    access_token === null ? <Navigate to ='/signin'/> :
    editorState == "editor" ? <BlogEditor/> :<PublishForm/> 
    }
    </EditorContext.Provider>
  )
}

export default Editor