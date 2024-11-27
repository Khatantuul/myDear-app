import React from 'react'
import './albumpreview.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AlbumPreview = ({album,presignedUrls}) => {

  const navigate = useNavigate();
  const fetchInitial = async (albumId, { limit }) => {
    try {
        const response = await axios.get(`http://localhost:9000/albums/${albumId}`, {
            withCredentials: true,
            params:{
              limit
            }
          
        });
        console.log("response in fetchInitial", response.data);
        return response.data.photoObj; 
    } catch (err) {
        console.error("Error fetching high-res images:", err);
        return [];
    }
};

  const handleRedirect = async () => {
    const initialImages = await fetchInitial(album._id,{limit: 3});
    
    navigate(`/albums/${album._id}`, {state: {initialImages}});
  }
  
  return (
    <div class='album-preview-container'>

        {/* <div class='album-preview-wrapper'> */}
            <div className="preview-grid" onClick={handleRedirect}>

            {presignedUrls.map((presignedUrl, index) => (
        <img key={index} src={presignedUrl.presignedUrl} alt={`Photo ${index + 1}`} />
      ))}

            </div>
        {/* </div> */}
            <div className="album-preview-title">
                <span>{album.title}</span>
            </div>
    </div>
    

    
  )
}

export default AlbumPreview