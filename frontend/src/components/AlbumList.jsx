import React, { useEffect, useState } from 'react'
import AlbumPreview from './AlbumPreview'
import { useUserContext } from './../context/usercontext';
import axios from 'axios';



const AlbumList = () => {

  const componentStyle = {
    display: 'flex',
    gap: '20px',
    border: '1px solid blue'
    // fontSize: '16px',
    // Add more styles as needed
  };

  const {user} = useUserContext();
  console.log('user here', user)
  const [allAlbumsPopulated, setAllAlbumsPopulated] = useState([]);


  useEffect(() => {
    try{
      const response = axios.get(`http://localhost:9000/albums`,{
        withCredentials: true,
        headers: {
          'preview': true
        }
      })
      .then((res)=>{
        console.log('albums resp', res.data)
        setAllAlbumsPopulated(res.data);
      })
      .catch((err)=>{
        console.log('albums error',err)
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