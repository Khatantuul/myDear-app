import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUserContext } from './../context/usercontext';
import { AlbumGrid, AlbumMode, UserDetailsDropdown } from '../components';
import { LibraryAddCheck, AutoFixHigh } from '@mui/icons-material';
import './singlealbumview.css';
import {Link, useParams} from 'react-router-dom';



const SingleAlbumView = ({ match }) => {
  const { user, updateUser } = useUserContext();

  const { albumId } = useParams();

  const [imageObjs, setImageObjs] = useState([]);
  const [albumInfo, setAlbumInfo] = useState({});
  const [edit, setEdit] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);



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
          setImageObjs(res.data.photoObj);
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

  console.log('albumInfo', albumInfo)

  const handleSwitch = () => {
    setEdit(!edit);
  }

  const handleRemove = (e,idx) => {
    e.stopPropagation();
    console.log("working here")
    const editedAlbumPhotos = imageObjs.filter((photo, index)=> index !== idx);
    setImageObjs(editedAlbumPhotos);
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
                  <button type='button' class='save-button '>
                    <div className="save-button-icon">
                      <LibraryAddCheck/>
                    </div>
                    <span>Save</span>
                  </button>
              </div>
            <div className="create-album-header-right">
              <UserDetailsDropdown/>
             
            </div>
        </div>
        <div className="view-album-main">
        <AlbumGrid imageObjs={imageObjs} edit={edit} handleEditRemove={handleRemove} />
            
    </div>

</div>
</div>
  );
};

export default SingleAlbumView;
