import {useState} from 'react';
import {Stack, Box} from '@mui/material';
import { PictureInPicture, Apps } from '@mui/icons-material';
import PhotoHolder from './PhotoHolder';
import {AlbumGrid} from '.';
import './album.css';


const Album = () => {

    const albumData = [
        { id: 1, datatsrc: 'https://images.unsplash.com/photo-1527349974300-f63f8ff9992d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1526&q=80' },
        { id: 2, datatsrc: 'https://images.unsplash.com/photo-1514328525431-eac296c01d82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1618&q=80' },
        { id: 3, datatsrc: 'https://images.unsplash.com/photo-1481455473976-c280ae7c10f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
        { id: 4, datatsrc: 'https://images.unsplash.com/photo-1579213838826-51de388c360c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
        { id: 5, datatsrc: 'https://images.unsplash.com/photo-1514328525431-eac296c01d82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1618&q=80' },
        { id: 6, datatsrc: 'https://images.unsplash.com/photo-1481455473976-c280ae7c10f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' }
      ]

    const [currentPage, setCurrentPage] = useState(0);

    const nextPage = () => {
      if (currentPage < albumData.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };

  return (
    <div className="main-container">
    <div className="create-album-wrapper">
        <div className="create-album-header">
            <div className="create-album-header-left">
                <div className="header-left-first">
                    <div className="create-album-back-studio">
                        <a href="http://localhost:3000/accounts/:accountId/studiospace"
                        class='header-back-studio'>My Studio</a>
                    </div>
                    <span>/</span>
                </div>
                <div className="header-left-second">
                    <span>New Album</span>
                </div>
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
          <AlbumGrid/>
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
  
  )
}

export default Album