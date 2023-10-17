import React from 'react';
import './albummode.css';

const AlbumMode = () => {

    const allphotos = [
        { id: 2, datasrc: '/assets/bday.jpeg' },
        { id: 3, datasrc: 'https://images.unsplash.com/photo-1481455473976-c280ae7c10f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
        { id: 1, datasrc: '/assets/child-3.jpeg' },
        { id: 4, datasrc: 'https://images.unsplash.com/photo-1579213838826-51de388c360c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' },
        { id: 5, datasrc: 'https://images.unsplash.com/photo-1514328525431-eac296c01d82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1618&q=80' },
        // { id: 6, datasrc: 'https://unsplash.com/photos/eHOZjZEx7u8' },
      ]
    const albumData = [];

      for(let i=0; i<allphotos.length; i+=6){
        const first = allphotos.slice(i,i+3);
        const second = (i+3 < allphotos.length) ? allphotos.slice(i+3,i+6): [];

        albumData.push({first, second});
      }

      console.log(albumData)

  return (
    <div className="album-mode-main-wrapper">
        <div className="album-mode-album-whole">
            {albumData.map((pair,idx)=>(
                <>
                {/* {pair.first.} */}
                <div className="album-mode-album-left-wrapper">
                    {pair.first.map((item,index)=>(
                          <div className={`picture ${ index===2 ? 'third':''}`} key={index}>
                              <img src={item.datasrc} alt='photosss' style={{width: '100%'}}/>
                          </div>
                    ))}
                </div>
                <div className="album-mode-album-right-wrapper">
                    {pair.second.map((item,index)=>(
                          <div className="picture" key={index}>
                              <img src={item.datasrc} alt='photosss' style={{width: '100%'}}/>
                          </div>
                    ))}
                </div>
                </>

            ))}
            </div>
            {/* <div className="album-mode-album-left-wrapper">
            {albumData.map((item,index)=>{
        return (
          <div className="picture" key={index} 
        //   onClick={(e)=>openImage(e)}
          >
            <img src={item.datasrc} alt='photo' style={{width: '100%'}} 
            // onLoad={(item)=>handleOrientation(item)}
            />
          </div>
        )
      })} 
            </div>
            <div className="album-mode-album-right-wrapper">
                Right
            </div>
         */}
    </div>
  )
}

export default AlbumMode