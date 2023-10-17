import {useState, useRef, useEffect} from 'react';
import {TagInput} from '.';
import { EditNote, DeleteForever, Delete,HighlightOff } from '@mui/icons-material';
import './albumgrid.css';

const AlbumGrid = ({photos, handleOnSave, handleRemove}) => {

    // const {photos} = props;

    // const albumData = [
    //     { id: 2, datasrc: '/assets/bday.jpeg' },
    //     { id: 3, datasrc: 'https://images.unsplash.com/photo-1481455473976-c280ae7c10f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
    //     { id: 4, datasrc: 'https://images.unsplash.com/photo-1579213838826-51de388c360c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
    //     { id: 5, datasrc: 'https://images.unsplash.com/photo-1514328525431-eac296c01d82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1618&q=80' },
    //     // { id: 6, datasrc: 'https://unsplash.com/photos/eHOZjZEx7u8' },
    //     { id: 1, datasrc: '/assets/child-3.jpeg' }
    //   ]

      const [singlePhoto, setSinglePhoto] = useState({});
      const ref = useRef(null);
      const [modal, setModal] = useState(false);
      const [horizontal, setHorizontal] = useState(false);
      const [hoveredIndex, setHoveredIndex] = useState(null);


      const [photoValues, setPhotoValues] = useState({
        note: '',
        tags: []
    })
      
      const openImage = (e,index) => {
        // console.log(src);
        handleOrientation(e);
        const clicked = photos[index]
        console.log('clecked', clicked)
        setSinglePhoto({...clicked, index: index});
        setModal(true);

      }

      useEffect(() => {
        if (modal) {
          ref.current?.showModal();
        }else{
            ref.current?.close();
        }
      }, [singlePhoto, modal])


      const handleOrientation = (e) => {
        // console.log(photo)
        if (e.target.width > e.target.height) {
          setHorizontal(true);
        }else{
            setHorizontal(false);
        }
      }

      const handleChange = (e) =>{
        setPhotoValues(prev=>({...prev, [e.target.name]:e.target.value}))
    }


      const handleTags= (tags) => {
        setPhotoValues(prev=>({...prev, tags:tags}));
        // setOnFileSelected(true);
      };

      const handleSaveAndClose = () => {
        setModal(false);
        //onSave pass the photoValues
        console.log('singlePhoto', singlePhoto);
        const photo = {...singlePhoto, ...photoValues};
        handleOnSave(singlePhoto.index, photo);
      }

      // const handleRemove = (idx) => {
      //   console.log('remove', idx)
      //   const updatedPhotos = photos.filter((photo, index)=> index !== idx);
      //   console.log('updatedPhotos', updatedPhotos)
      //   // setPhotos(updatedPhotos);
      // } 

  return (
    <>
    <div className="gallery">
        <dialog ref={ref} class={modal}>
            <div className="dialog-full">
                <div className={`dialog-img-wrapper ${horizontal? "horizontal" : "vertical"}`}>
                    <img src={singlePhoto.url} alt="photos" />
                </div>
                <div className="dialog-img-details-wrapper">
                    <div className="dialog-img-details-note">
                        <span><EditNote sx={{color:'rgb(137, 137, 137)', marginRight:'3px'}}/> Photo note:</span>
                        <input type="text" placeholder="Me and the gang at Java Joe's." 
                        maxLength={20} name='note' id='note'
                        onChange={handleChange}/>
                    </div>
                    <TagInput title="Photo" size='16px' handleTags={handleTags}/>
                    <div className="dialog-img-details-buttons">
                    <button onClick={handleSaveAndClose}>Save</button>
                    <button onClick={()=>setModal(false)}>Cancel</button>
                    </div>
                </div>
                
            </div>
        </dialog>
      {photos.map((item,index)=>{
        // console.log(imgData)
        return (
          <div className="picture" key={index} onClick={(e)=>openImage(e,index)} onMouseEnter={()=>setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
            {/* <img loading='lazy' src={item.url} alt='photo' style={{width: '100%'}} 
            // onLoad={(item)=>handleOrientation(item)}
            /> */}
                <picture>
                  <source srcSet={item.url}  type="image/webp" />
                  <img src={item.url}  alt="Example" style={{width: '100%'}}  />
              </picture>
              {hoveredIndex === index && 
              <Delete onClick={(e)=>handleRemove(e,index)} sx={{color:'white' ,position:'absolute', top:'5px', right:'5px'}}/>
            }
          </div>
        )
      })}
    
    </div>
    </>
  )
}

export default AlbumGrid