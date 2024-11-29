import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUserContext } from './../context/usercontext';
import { AlbumGrid, UserDetailsDropdown } from '../components';
import { LibraryAddCheck, AutoFixHigh, DeleteForever } from '@mui/icons-material';
import './singlealbumview.css';
import {Link, useParams, useLocation} from 'react-router-dom';
import { toast } from 'sonner';



const SingleAlbumView = () => {
  
  const { user } = useUserContext();

  const { albumId } = useParams();

  const location = useLocation();
  const [imageObjs, setImageObjs] = useState(location.state?.initialImages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [originalImageObjs, setOriginalImageObjs] = useState(imageObjs);
  const [albumInfo, setAlbumInfo] = useState({});
  const [edit, setEdit] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [discardDialog, setDiscardDialog] = useState(false);
  const discardModalRef = useRef(null);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const ref = useRef(null);
  const [modal, setModal] = useState(false);
 

  const abortControllerRef = useRef(null);
  useEffect(() => {
    const fetchImages = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
  
      try {
        const response = await axios.get(`http://localhost:9000/albums/${albumId}`, {
          withCredentials: true,
          signal: abortControllerRef.current.signal, 
         params:{
          limit: 10,
          offset: imageObjs.length
         }
        });
  
        const { photoObj } = response.data;
        setImageObjs((prev)=>[...prev, ...photoObj]);
        setOriginalImageObjs(JSON.parse(JSON.stringify(imageObjs)));
        setAlbumInfo(response.data.album);
      } catch (err) {
        if (err.name === 'CancelledError') {
          console.log('Request aborted.');
          return;
        }
        console.error('Error fetching album:', err);
      } finally {
        setIsLoading(false);
      }
    };
      
      fetchImages();

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
      
        await axios.patch(`http://localhost:9000/albums/${albumId}`,{
          photoId: photosToDelete[0]
        }, {
          withCredentials: true,
        }).then((res)=>{
          console.log("response in deletion of photo", res.data);
        })

      toast.success("Changes saved successfully!")
  
      } catch (error) {
        console.error("An error occurred:", error);
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
      await axios.delete(`http://localhost:9000/albums/${albumId}`,{
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
    <div className="single-main-container">
       <div className="single-album-header">
            <div className="single-album-header-left">
                <div className="single-header-left-first">
                    <div className="single-album-back-studio">
                         <Link to={`/accounts/${user.userID}/studiospace`} className="single-header-back-studio">
                                    My Studio
                                </Link>
                    </div>
                    <span>/</span>
                </div>
                <div className="single-header-left-second">
                    <span>{albumInfo?.title}</span>
                </div>
            </div>
            <div className="edit-buttons-wrapper">
                  <button type='button' className='edit-button ' onClick={()=>handleSwitch()}>
                  <div className="edit-button-icon">
                      <AutoFixHigh />
                    </div>
                    <span>{edit ? 'Cancel':'Edit'}</span>
                  </button>
                  <button type='button' className='save-button'>
                    <div className="save-button-icon">
                      <LibraryAddCheck/>
                    </div>
                    <span>Save</span>
                  </button>
                  <button type='button' className='dlt-button' onClick={handleDeleteAlbum}>
                    <div className="dlt-button-icon">
                      <DeleteForever/>
                    </div>
                    <span className="multi-line-text">Delete Album</span>
                  </button>
                
              </div>
            <div className="single-album-header-right">
               <UserDetailsDropdown/>
             
            </div>
        </div>
    <div className="single-album-wrapper">
       
        <div className="view-album-main">
          {isLoading && <div>Loading.....</div>}
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
