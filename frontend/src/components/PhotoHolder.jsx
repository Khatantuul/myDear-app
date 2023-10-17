import './photoholder.css';
import { Box, CardMedia, Typography } from '@mui/material';
import { useState } from 'react';

const PhotoHolder = ({photo,layout,larger}) => {

    const [flip, setFlip] = useState(false)

    // sx={{ width: layout === 'horizontal' ? (larger ? '800px':'550px') : '350px' , 
    // height: layout === 'horizontal' ? (larger ? '450px': '300px') : '450px' }}

  return (
    <Box className={`card ${flip ? 'flip':''}`} 
        onClick={()=>setFlip(!flip)}
        // sx={{width:'800px', height:'450px'}}  
   >
       <Box className='front'>
        <img src={photo.src} 
        alt="random"
        style={{width:'400px',
        height:'auto'}} />
       </Box>
       <Box className='back'>
        <Typography variant='h4' sx={{fontStyle:'italic', fontFamily:'cursive'}}>Title</Typography>
       </Box>
    </Box>

  )
}

export default PhotoHolder