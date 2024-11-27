import React, { useEffect, useState } from 'react'
import AlbumPreview from './AlbumPreview'
import { useUserContext } from './../context/usercontext';
import axios from 'axios';



const AlbumList = ({onFetch}) => {

  const componentStyle = {
    display: 'flex',
    gap: '20px',
  };

  const {user, updateUser, logoutUser} = useUserContext();
  const [allAlbumsPopulated, setAllAlbumsPopulated] = useState([]);


  useEffect(() => {
    console.log("its working in albumslist");
    try{
      // const storedEtag = localStorage.getItem("albumsPreviewEtag") || '';
      // console.log("storedEtag", storedEtag);
      const response = axios.get(`http://localhost:9000/albums`,{
        withCredentials: true,
        headers: {
          'preview': true,
          // 'If-None-Match': storedEtag
        }
      })
      .then((res)=>{
        console.log("dsdae")
      //  // Correctly retrieve the ETag
      //  const newEtag = res.headers['etag']; // Access Axios headers
      //  console.log("newEtag", newEtag);
 
      //  // Update localStorage with the new ETag
      //  if (newEtag) {
      //    localStorage.setItem("albumsPreviewEtag", newEtag);
      //  }
        setAllAlbumsPopulated(res.data);      
        onFetch(res.data);
       
      })
      .catch((err)=>{
        if(err.status === 304){
          console.log('Data served from browser cache');
           // Fallback to cached state
           if (allAlbumsPopulated && allAlbumsPopulated.length > 0) {
            console.log("Using cached state");
            setAllAlbumsPopulated(allAlbumsPopulated); // Reuse existing state
          } else {
            console.error("No cached data available in memory");
          }
        }
        if(err.response.status === 401){
          logoutUser();
        }
      })
    }catch(err){
      console.log('albumssss error',err)
    }
  },[])

  return (
    <div className="album-list-wrapper" style={componentStyle}>
      {allAlbumsPopulated.map((album) => (
        <AlbumPreview key={album.album._id} album={album.album} presignedUrls={album.presignedUrls} />
      ))}
    </div>
  );
};

export default AlbumList