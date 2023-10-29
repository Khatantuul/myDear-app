import React from 'react'
import './albumpreview.css';
import { useNavigate } from 'react-router-dom';

const AlbumPreview = ({album,presignedUrls}) => {

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/albums/${album._id}`);
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