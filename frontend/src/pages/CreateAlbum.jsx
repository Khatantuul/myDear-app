import {useState, useRef, useEffect} from 'react';
import './create-album.css';
import { TagInput, FileUploader, AlbumGrid, UserDetailsDropdown } from '../components';
import {Camera, Description} from '@mui/icons-material';
import axios from 'axios';
import { useUserContext } from './../context/usercontext';
import {Link, useNavigate} from 'react-router-dom';




const CreateAlbum = () => {
    const { user, updateUser } = useUserContext();
    console.log('user', user)

    const [title, setTitle] = useState('New Album');
    const [onFileSelected, setOnFileSelected] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [tags, setTags] = useState([]);
    const [invalid, setInvalid] = useState(false);
    const inputRef = useRef(null);
    const [values, setValues] = useState({
        title: '',
        tags: [],
        description: '',
        creator: user.userID
    })
    const [albumId, setAlbumId] = useState(null);
    const navigate = useNavigate();

    const maxUploads = 10;

    



  const handleFileSelected = (photos) => {
    // Update the selected photos state when files are selected

    //compress files before setting to selectedPhotos
    // const compressedFiles = photos.map(async (photo,idx) => {
    //     const compressedFile = await sharp(photo.file)
    //     .resize({width: 800})
    //     .toBuffer()
    //     .then((data)=>{
    //         return new File([data], photo.file.name, {type: photo.file.type})
    //     })
    //     return {...photo, file:compressedFile, index:idx}
    // })

    setSelectedPhotos(photos);
    setOnFileSelected(true);
    if (selectedPhotos.length > 10){
        setInvalid(true);
      }else{
        setInvalid(false);
      }
  };

const handleTags= (tags) => {
    // Update the selected photos state when files are selected
    // setTags((prevTags)=>[...prevTags, ...tags]);
    setValues(prev=>({...prev, tags:tags}));
    // setOnFileSelected(true);
  };

const handleOnSave = (index,values) => {
    // setPhotoValues(prev => ({...prev, note: values.note, tags: values.tags }))
    setSelectedPhotos((prevPhotos)=>{
        const updatedPhotos = prevPhotos.map((photo, idx)=>{
            if (idx === index){
                return {...photo, ...values}
            }else{
                return photo;
            }
        })
        return updatedPhotos;
    })
}

    const setAlbumTitle = (e) => {
        setTitle(e.target.value);
    }


    const handleUploadChange = (e) =>{
        const addedFiles = e.target.files;
        setSelectedPhotos((prevFiles) => {
          const newFiles = [
            ...prevFiles,
            ...Array.from(addedFiles).map((file) => ({
              file,
              url: URL.createObjectURL(file),
            })),
          ];
          return newFiles;
      })
      if (selectedPhotos.length > 10){
        setInvalid(true);
      }else{
        setInvalid(false);
      }
    }

    const [photoValues, setPhotoValues] = useState({
        note: '',
        tags: []
    })


    const handleUpload = async (e)=> {
        e.preventDefault();
        // const photosFD = new FormData();
        if (selectedPhotos.length > 10){
            setInvalid(true);
            return;

        }
        const formData = new FormData();
        try{
            const photoInfo = {}
            selectedPhotos.forEach((photo, idx)=>{

                const {index, note, tags} = photo;
                
                photoInfo[`${idx}`] = {index, note, tags};
                formData.append(`files`,photo.file)
            })
            
            formData.append(`photoInfo`, JSON.stringify(photoInfo));
            formData.append('albumInfo', JSON.stringify(values));

            const res = await axios.post('http://localhost:9000/albums', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
                .then((res)=>{
                    setAlbumId((prev) => {
                        return res.data.album._id;
                      });
                  
                    // navigate(`/albums/${albumId}`);
                })
                .catch((err)=>{
                    console.log("something bad happened", err)
                })
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        if (albumId) {
          navigate(`/albums/${albumId}`);
        }
      }, [albumId, navigate]);


    const handleChange = (e) =>{
        setValues(prev=>({...prev, [e.target.name]:e.target.value}))
    }

    const handleRemove = (e,idx) => {
        e.stopPropagation();
        const updatedPhotos = selectedPhotos.filter((photo, index)=> index !== idx);
        setSelectedPhotos(updatedPhotos);
    }

    

  return (
    <div className="main-container">
        <div className="create-album-wrapper">
            <div className="create-album-header">
                <div className="create-album-header-left">
                    <div className="header-left-first">
                        <div className="create-album-back-studio">
                            {/* <a href="http://localhost:3000/accounts/:accountId/studiospace"
                            class='header-back-studio'>My Studio</a> */}
                             <Link to={`/accounts/${user.userID}/studiospace`} className="header-back-studio">
                                    My Studio
                                </Link>
                        </div>
                        <span>/</span>
                    </div>
                    <div className="header-left-second">
                        <span>{title}</span>
                    </div>
                </div>
                <div className="create-album-header-buttons-wrapper">

                    <div className="create-album-add-more-button-wrapper">
                        <input type="file" multiple ref={inputRef} onChange={handleUploadChange} hidden/>
                        <button onClick={()=>inputRef.current.click()}>Add photos</button>
                    </div>
                    <div className="create-album-header-right">
                        {/* <a href='#' class='create-album-publish' onClick={handleUpload}>
                            <span>Publish</span>
                        </a> */}
                        <Link to={`/albums/${albumId}`} className="create-album-publish" onClick={handleUpload}>
                                    Publish
                                </Link>
                    </div>
                    <UserDetailsDropdown/>
                </div>
            </div>
            <div className="create-album-main">
                <div className="create-album-left">
                    <div className="create-album-left-menu">
                        <div className="left-menu-album-title">
                            <span><Camera sx={{color:'rgb(137, 137, 137)', marginRight:'3px'}}/> Album Title:</span>
                            <input type="text" placeholder='New Album'name='title' id='title' maxLength={20} onKeyUp={setAlbumTitle} onChange={handleChange} />
                        </div>
                        <div className="left-menu-album-tags">
                            <TagInput title='Album' size='16px' handleTags={handleTags}/>
                        </div>
                        <div className="left-menu-album-desc">
                            <span><Description sx={{color:'rgb(137, 137, 137)',marginRight:'3px'}}/> Album Description:</span>
                            <textarea rows="4" cols="25" maxlength="150" name='description' id='description' placeholder="This is dedicated to my son's 1st birthday" onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <div className="create-album-left-analytics">
                        <div className="create-album-counts">
                            <span>Number of photos</span>
                            <span>23</span>
                        </div>
                    </div>
                </div>
                <div className="create-album-right">
                   {/* <div className="create-album-right-header-wrapper"> */}
                        <div class='maxUpload-error-wrapper' invalid={invalid.toString()}>
                            <span class='error-icon'></span>
                            <p>Please only work on up to 10 photos at a time for an album!</p>
                        </div>
                    {/* </div>  */}

                    {onFileSelected === false ? 
                    <FileUploader onFileSelected={handleFileSelected}/>
                    : <AlbumGrid photos={selectedPhotos} 
                            handleOnSave={handleOnSave} 
                            handleRemove={handleRemove}/>
                        }
                </div>
            </div>
        </div>

    </div>
  )
}

export default CreateAlbum