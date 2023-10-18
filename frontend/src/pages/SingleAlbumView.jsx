import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUserContext } from './../context/usercontext';
import { AlbumGrid } from '../components';
import { PictureInPicture, Apps } from '@mui/icons-material';
import './singlealbumview.css';
import {Link, useParams} from 'react-router-dom';



const SingleAlbumView = ({ match }) => {
  // const [album, setAlbum] = useState(null);
  const { user, updateUser } = useUserContext();

  console.log('user here', user)
  const { albumId } = useParams();

  const [imageObjs, setImageObjs] = useState([]);

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
                  <button type='button' class='grid'>
                  <div className="view-button-icon">
                      <Apps />
                    </div>
                    <span>Grid</span>
                  </button>
                  <button type='button' class='album'>
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
        
          <AlbumGrid imageObjs={imageObjs}/>
            {/* <div className="create-album-left">
                <div className="create-album-left-menu">
                    <div className="left-menu-album-title">
                        <span><Camera sx={{color:'rgb(137, 137, 137)', marginRight:'3px'}}/> Album Title:</span>
                        <input type="text" placeholder='New Album' maxLength={20} onKeyUp={setAlbumTitle} />
                    </div>
                    <div className="left-menu-album-tags">
                        <TagInput title='Album' size='16px'/>
                    </div>
                    <div className="left-menu-album-desc">
                        <span><Description sx={{color:'rgb(137, 137, 137)',marginRight:'3px'}}/> Album Description:</span>
                        <textarea rows="4" cols="25" maxlength="150" placeholder="This is dedicated to my son's 1st birthday"></textarea>
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
                <FileUploader/>
            </div> */}
            {/* <>
            <div className="gallery">
              {albumData.map((imgData)=>{
            
                return (
                  <div className="picture" key={imgData.id}>
                    <img src={imgData.datasrc}/>
                  </div>
                )
              })}
            
            </div>
            </> */}
        </div>
    </div>

</div>
    // <div>
    //     <h1>My Photo Album</h1>
    //     <div className="album-pages">
    //       {albumData[currentPage].map((photo) => (
    //         <PhotoHolder key={photo.id} photo={photo} layout='horizontal' larger />
    //       ))}
    //     </div>
    //     <div className="pagination">
    //       <button onClick={prevPage} disabled={currentPage === 0}>
    //         Previous Page
    //       </button>
    //       <button onClick={nextPage} disabled={currentPage === albumData.length - 1}>
    //         Next Page
    //       </button>
    //     </div>
    //   </div>
  );
};

export default SingleAlbumView;
