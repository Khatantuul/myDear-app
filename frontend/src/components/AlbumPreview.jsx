import React from 'react'
import './albumpreview.css';

const AlbumPreview = ({album,presignedUrls}) => {

  
  return (
    <div class='album-preview-container'>

        {/* <div class='album-preview-wrapper'> */}
            <div className="preview-grid">

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