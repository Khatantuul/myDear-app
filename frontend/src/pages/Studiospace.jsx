import {useEffect, useState} from 'react';
import { NavBar, Brand, AlbumList, UserDetailsDropdown } from '../components';
import './studio-space.css';
import {SearchTwoTone, PhotoCamera,Loyalty, EmojiEvents,ChevronRightTwoTone, Add} from '@mui/icons-material';
import { useUserContext } from './../context/usercontext';
import {Link} from 'react-router-dom';
import axios from 'axios';




const Studiospace = () => {
  
  const { user, updateUser } = useUserContext();
  const [filterType, setFilterType] = useState("all");
  const [allAlbums, setAllAlbums] = useState(null);

  const handleAlbumsFetched = (albumData) => {
    setAllAlbums(albumData);
  }




  const handleFilter = async (e) => {
    const types = e.target.value === "" ? null : e.target.value;
    setFilterType(types); 
    if (types === 'all') {
   
    } else {

    }
  }
  
  const types = ["Date Created", "Alphabetical"];


  return (
    <div class='studiospace'>
      <div className="studiospace-container">
        <div className="studio-header">
           <div className="header-in-left">
            <h4>Hello,</h4>
            <span>{user.username}</span>
          </div>
        <div className="header-in-right">
            <div className="header-title-wrapper">
              <h1>My Studio</h1>
            </div>
            <div className="search-bar-wrapper">
              <div className="search-icon-wrapper">
                <SearchTwoTone/>
              </div>
              <div className="search-input-wrapper">
                <input className='search-input' type="text" placeholder='Search by tags e.g. "9th birthday"' />
              </div>
            </div>
          <UserDetailsDropdown/>

          </div>
        </div>
        <div className="studio-spaces-wrapper">
        <div className="studiospace-left">
          {/* <header> */}
          {/* <Brand/> */}
         
          <div className="studio-menu-wrapper">
            <div className="studio-menu-albums">
    
                <button class='menu-albums'>
                  <div className="menu-albums-wrapper">
                    <div className="menu-albums-left">
                      <PhotoCamera sx={{color:'rgb(137, 137, 137)'}}/>
                      <span>Albums</span>
                    </div>
                    <div className="menu-albums-right">
                      <ChevronRightTwoTone/>
                    </div>
                  </div>
                </button>
            
            </div>
            <div className="studio-menu-achieve">
              <button class='menu-achieve'>
              <div className="menu-achieve-wrapper">
                    <div className="menu-achieve-left">
                      <EmojiEvents sx={{color:'rgb(137, 137, 137)'}}/>
                      <span>Achievements</span>
                    </div>
                    <div className="menu-achieve-right">
                      <ChevronRightTwoTone/>
                    </div>
                  </div>
              </button>
            </div>
            <div className="studio-menu-special">
              <button class='menu-special'>
              <div className="menu-special-wrapper">
                    <div className="menu-special-left">
                      <Loyalty sx={{color:'rgb(137, 137, 137)'}}/>
                      <span>Special</span>
                    </div>
                    <div className="menu-special-right">
                      <ChevronRightTwoTone/>
                    </div>
                  </div>
              </button>
            </div>
          </div>
          <div className="studio-analytics-wrapper">
            <div className="analytics analytics-album-count">
              Album count: {allAlbums?.length}
            </div>
            <div className="analytics analytics-photos-count">
             Photos count: {allAlbums?.reduce((acc, album) => acc + (album.album.photos.length || 0), 0)}
            </div>
            <div className="analytics analytics-files-count">
              Files count
            </div>
          </div>
        </div>
        <div className="studiospace-right">
          
          <div className="content-in-right">
              <div className="studio-content-wrapper">
                <div className="content-header-wrapper">
                  <div className="create-album-link-wrapper">
                      <div className="createAlbum-icon">
                        <Add sx={{color:'white', fontSize:'large', marginRight:'1px', verticalAlign:'middle'}} />
                      </div>
                       <Link to="/albums" className="createAlbum-link">
                        Create new album
                      </Link>
                  </div>
                  <div className="filter">
                    <select value={filterType} onChange={handleFilter}>
                      {types.map((type) => (
                        <option key={type} value={type} >{type}</option>
                      ))}
                    </select>
                  </div>

                </div>
                <div className="main-content">
                        <AlbumList onFetch={handleAlbumsFetched}/>
                </div>
              </div>
          </div>
        </div>
        </div>
        

      </div>
    </div>
  )
}

export default Studiospace