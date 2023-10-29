import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUserContext } from './../context/usercontext';
import { AlbumGrid, AlbumMode } from '../components';
import { PictureInPicture, Apps } from '@mui/icons-material';
import './singlealbumview.css';
import {Link, useParams} from 'react-router-dom';



const SingleAlbumView = ({ match }) => {
  // const [album, setAlbum] = useState(null);
  const { user, updateUser } = useUserContext();

  console.log('user here', user)
  const { albumId } = useParams();

  const [imageObjs, setImageObjs] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

//   useEffect(() => {
//     const fetchAlbum = async () => {
//       try {
//         const albumId = match.params.albumId;
//         const response = await axios.get(`/api/albums/${albumId}`);
//         const fetchedAlbum = response.data;
//         setAlbum(fetchedAlbum);
//       } catch (error) {
//         console.error('Error fetching album details', error);
//       }
//     };

//     fetchAlbum();
//   }, [match.params.albumId]);
const hasRun = useRef(false);

  useEffect(() => {

    if (!hasRun.current){
    const fetchImages = async () => {
     try{
        const response = await axios.get(`http://localhost:9000/albums/${albumId}`,{
            headers: {
                'User-ID': user.userID,
                'Album-ID': albumId
            }
        })
        .then(res=>{
          console.log('responssss', res.data)
          setImageObjs(res.data);
        })
     }catch(err){
          console.log('err in the front',err)
     }
    };

    fetchImages();
    hasRun.current = true;
  }
  }, []);

  console.log('imageObjs', imageObjs)

  const handleSwitch = (mode) => {
    setViewMode(mode);
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
                    <span>New Album</span>
                </div>
            </div>
            <div className="view-buttons-wrapper">
                  <button type='button' class='view-button ' onClick={()=>handleSwitch('grid')}>
                  <div className="view-button-icon">
                      <Apps />
                    </div>
                    <span>Grid</span>
                  </button>
                  <button type='button' class='view-button ' onClick={()=>handleSwitch('album')}>
                    <div className="view-button-icon">
                      <PictureInPicture/>
                    </div>
                    <span>Album</span>
                  </button>
              </div>
            <div className="create-album-header-right">
                {/* <a href='' class='create-album-publish'>
                    <span>Publish</span>
                </a> */}
                  <div className="user-details-wrapper">
                    <button>
                      <div className="user-details">
                        {/* <img src='/assets/baby.jpeg' alt='user'/> */}
                        <span>KB</span>
                      </div>
                    </button>
                    {/* <div className="user-settings">
                      <IconButton>
                        <SettingsTwoTone/>
                      </IconButton>
                    </div> */}
                </div>
             
            </div>
        </div>
        <div className="view-album-main">
        {viewMode === 'grid' && <AlbumGrid imageObjs={imageObjs}/>}
        {viewMode === 'album' && <AlbumMode imageObjs={imageObjs} />}
            
    </div>

</div>
</div>
  );
};

export default SingleAlbumView;
