import React, { useState } from 'react'
import './tagInput.css';
import {Sell} from '@mui/icons-material';


const TagInput = (props) => {

    const h2Style = {
        'font-size': props.size 
    }

    const [tags, setTags] = useState([]);
    const maxLimit = 10;

    const addTag = (e) =>{
        if (e.key === 'Enter') {
            let tag = e.target.value.replace(/\s+/g, ' ');
            if (tag.length > 1 && !tags.includes(tag)) {
                if (tags.length < 10){
                    tag.split(',').forEach(tag=>{
                        setTags((prevTags)=>{
                            const added = [
                                ...prevTags,
                                tag
                            ]
                            props.handleTags(added);
                            return added;
                        })
                    })
                }
            }
            e.target.value = '';
        }
    
    }

    const removeTag = (idx) => {
       setTags(prevTags=> prevTags.filter((tag,index) => index !== idx))
    }

  return (
    <div className="wrapper">
        <div className="title">
            <Sell sx={{color:'rgb(137, 137, 137)',marginRight:'3px'}}/>
            <h2 style={h2Style}>{props.title} Tags</h2>
        </div>
  
    <div class='tag-content-container'>
        <p>Press Enter or add a comma after each tag</p>
            <ul>
                {tags.map((tag,index)=>(
                    <li key={index}>{tag}<i onClick={()=>removeTag(index)}>&#10005;</i></li>
                ))
                }
                <input type="text" onKeyUp={addTag} name='tags' id='tags' />
            </ul>
    </div>
    <div className="details">
        <p><span>{maxLimit-tags.length}</span> tags are remaining</p>
    </div>
    </div>
  )
}

export default TagInput