import React, { useEffect, useState } from 'react'
import AlbumPreview from './AlbumPreview'
import { useUserContext } from './../context/usercontext';
import axios from 'axios';


const AlbumList = () => {

  const {user} = useUserContext();
  const [albums, setAlbums] = useState([]);


  useEffect(() => {
    try{
      const response = axios.get(`http://localhost:9000/albums`,{
        withCredentials: true
      })
      .then((res)=>{
        console.log('albums resp', res.data)
        setAlbums(res.data);
      })
      .catch((err)=>{
        console.log('albums error',err)
      })
    }catch(err){
      console.log('albumssss error',err)
    }
  },[])

  return (
    <div className="album-list-wrapper">
      {albums.map((album) => (
        <AlbumPreview key={album._id} photos={album.photos} />
      ))}
    </div>
  );
};

export default AlbumList