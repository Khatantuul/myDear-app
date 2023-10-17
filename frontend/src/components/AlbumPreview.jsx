import React from 'react'
import './albumpreview.css';

const AlbumPreview = ({photos}) => {
  return (
    <div class='album-preview-container'>

        {/* <div class='album-preview-wrapper'> */}
            <div className="preview-grid">

            {photos.map((photo, index) => (
        <img key={index} src={photo.url} alt={`Photo ${index + 1}`} />
      ))}

            </div>
        {/* </div> */}
            <div className="album-preview-title">
                <span>Album Title</span>
            </div>
    </div>
    

    
  )
}

export default AlbumPreview