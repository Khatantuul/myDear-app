import React, {useState} from 'react';
import './albummode.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const AlbumMode = ({imageObjs}) => {

    const allphotos = [
        { id: 2, datasrc: '/assets/bday.jpeg' },
        { id: 3, datasrc: 'https://images.unsplash.com/photo-1481455473976-c280ae7c10f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
        { id: 1, datasrc: '/assets/child-3.jpeg' },
        { id: 4, datasrc: 'https://images.unsplash.com/photo-1579213838826-51de388c360c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
        { id: 5, datasrc: 'https://images.unsplash.com/photo-1514328525431-eac296c01d82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1618&q=80' },
        // { id: 6, datasrc: 'https://unsplash.com/photos/eHOZjZEx7u8' },
      ]
  

     const [active, setActive] = useState(2);
     const count = imageObjs.length;
     const visible_count = 1;
     const [flip, setFlip] = useState(false)

     const handleImageClick = (i) => {
      // Toggle the 'flipped' class on the clicked image
      const imageWrappers = document.querySelectorAll('.img-wrapper');
      imageWrappers[i].classList.toggle('flipped');
    };

      

  return (
    
      <div className="album-mode-main-wrapper">
        <div className={`carousel ${flip ? 'flip': ''}`} onClick={()=>setFlip(!flip)} >
        
        {active > 0 && <button className='switch left' onClick={() => setActive(i => i - 1)}><ChevronLeft/></button>}
        
        {imageObjs.map((imageObj, i) => {
     return (
      <>
          <div className={`img-wrapper front`}   style={{
            '--active': i === active ? 1 : 0,
            '--offset': (active - i) / 3,
            '--direction': Math.sign(active - i),
            '--abs-offset': Math.abs(active - i) / 3,
            'display': Math.abs(active - i) > visible_count ? 'none' : 'block'
            }} 
            // onClick={() => handleImageClick(i)}
            >
            <img src={imageObj.presignedUrl}  alt={`photo` + i}/>
             
          </div>
           <div className="back">
           <p>{"SOmething for now"}</p>
          </div>
          </>
          )
          })}

      {active < count - 1 && <button className='switch right' onClick={() => setActive(i => i + 1)}><ChevronRight/></button>}
     
      </div>
    </div>
    
    
  );
}

export default AlbumMode

