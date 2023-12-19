import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUserContext } from './../context/usercontext';
import { AlbumGrid, AlbumMode, UserDetailsDropdown } from '../components';
import { LibraryAddCheck, AutoFixHigh, DeleteForever } from '@mui/icons-material';
import './singlealbumview.css';
import {Link, useParams} from 'react-router-dom';
import { toast } from 'sonner';




const SingleAlbumView = ({ match }) => {
  const { user, updateUser } = useUserContext();

  const { albumId } = useParams();

  const [imageObjs, setImageObjs] = useState([]);
  const [originalImageObjs, setOriginalImageObjs] = useState(imageObjs);
  const [albumInfo, setAlbumInfo] = useState({});
  const [edit, setEdit] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [discardDialog, setDiscardDialog] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const discardModalRef = useRef(null);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const ref = useRef(null);
  const [modal, setModal] = useState(false);




const hasRun = useRef(false);

  useEffect(() => {

    if (!hasRun.current){
    const fetchImages = async () => {
     try{
        const response = await axios.get(`http://localhost:9000/albums/${albumId}`,{
          withCredentials: true,
            headers: {
                'User-ID': user.userID,
                'Album-ID': albumId
            }
        })
        .then(res=>{

          const {photoObj} = res.data;
          setImageObjs(photoObj);
          setOriginalImageObjs(JSON.parse(JSON.stringify(photoObj))); 
          setAlbumInfo(res.data.album)
        })
     }catch(err){
          console.log('err in the front',err)
     }
    };

    fetchImages();
    hasRun.current = true;
  }
  }, []);

  const handleSwitch = () => {
    if (changesMade){
      setDiscardDialog(true);
    }else{
      setEdit(!edit);
    }
  }

  const handleRemove = (e, idx) => {
    e.stopPropagation();
    setPhotosToDelete(prev => [...prev, imageObjs[idx].photoId])
    setImageObjs((prevImageObjs) => 
      prevImageObjs.filter((photo, index) => index !== idx)
    );
    setChangesMade(true);
  };

  // useEffect(() => {
  //   console.log('lol',imageObjs.map(item => item));
  // }, [imageObjs]); 
  

  useEffect(() => {
    if (discardDialog) {
      discardModalRef.current?.showModal();
    }else{
      discardModalRef.current?.close();
    }
  }, [discardDialog])

  const handleCancel = () => {
    setImageObjs([...originalImageObjs]);
    setChangesMade(false);
    setDiscardDialog(false);
    setEdit(!edit)
  }

  const handleSave = async () => {

    if (changesMade){
      try {
      
        const resp = await axios.patch(`http://localhost:9000/albums/${albumId}`,{
          photoId: photosToDelete[0]
        }, {
          withCredentials: true,
        })

      toast.success("Changes saved successfully!")
  
      } catch (error) {
        throw error;
      }
    }else{
      toast.info("No changes to save!")
    }
  }

  const handleDeleteAlbum = async () => {

    setModal(true);

   
  }

  const handleDelete = async () => {
    try {
      const resp = await axios.delete(`http://localhost:9000/albums/${albumId}`,{
        withCredentials: true,
      })
      toast.success("Album deleted successfully!",{
        duration: 3000,
      })
      setModal(false);
      setTimeout(() => {
        window.location.href = `/accounts/${user.userID}/studiospace`;
      }, 2000);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (modal) {
      ref.current?.showModal();
    }else{
      ref.current?.close();
    }
  }, [modal])

  const handleDeleteCancel = () => {
    setModal(false);
  }
  

  return (
    <div className="main-container">
    <div className="create-album-wrapper">
        <div className="create-album-header">
            <div className="create-album-header-left">
                <div className="header-left-first">
                    <div className="create-album-back-studio">
                         <Link to={`/accounts/${user.userID}/studiospace`} className="header-back-studio">
                                    My Studio
                                </Link>
                    </div>
                    <span>/</span>
                </div>
                <div className="header-left-second">
                    <span>{albumInfo?.title}</span>
                </div>
            </div>
            <div className="edit-buttons-wrapper">
                  <button type='button' class='edit-button ' onClick={()=>handleSwitch()}>
                  <div className="edit-button-icon">
                      <AutoFixHigh />
                    </div>
                    <span>{edit ? 'Cancel':'Edit'}</span>
                  </button>
                  <button type='button' class='save-button'>
                    <div className="save-button-icon">
                      <LibraryAddCheck/>
                    </div>
                    <span>Save</span>
                  </button>
                  <button type='button' class='dlt-button' onClick={handleDeleteAlbum}>
                    <div className="dlt-button-icon">
                      <DeleteForever/>
                    </div>
                    <span>Delete Album</span>
                  </button>
              </div>
            <div className="create-album-header-right">
              <UserDetailsDropdown/>
             
            </div>
        </div>
        <div className="view-album-main">
        <AlbumGrid imageObjs={imageObjs} edit={edit} handleEditRemove={handleRemove} />
        {discardDialog && 
        <div className="discard-changes-dialog">
                <p>Discard the changes?</p>
                <button onClick={handleCancel}>Yes</button>
                <button onClick={handleSave}>Save</button>
              </div>
          }
        <dialog ref={ref} className='delete-dialog'>
              <div className="delete-album-dialog">
                <p>Are you sure you want to delete this album?</p>
                <button onClick={handleDeleteCancel}>Cancel</button>
                <button onClick={handleDelete}>Confirm</button>
              </div>
        </dialog>
    </div>

</div>
</div>
  );
};

export default SingleAlbumView;
