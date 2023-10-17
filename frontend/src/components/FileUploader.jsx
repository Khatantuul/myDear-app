import {useState, useRef} from 'react';
import axios from 'axios';
import './file-uploader.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AlbumGrid from './AlbumGrid';

const FileUploader = ({onFileSelected}) => {

    const [files, setFiles] = useState([]);
    const inputRef = useRef(null);
    const [progress, setProgress] = useState({started: false, progInPercent: 0});
    const [alert, setAlert] = useState(null);

    const maxUploads = 10;

    const handleDrag = event => {
      event.preventDefault();
      };

      const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setFiles((prevFiles) => {
          const updatedFiles = [
            ...prevFiles,
            ...Array.from(event.dataTransfer.files).map((file) => ({
              file,
              url: URL.createObjectURL(file),
            })),
          ];
          onFileSelected(updatedFiles);
          return updatedFiles;
      })
    }

    const handleUploadChange = (e) =>{
        const addedFiles = e.target.files;
    
        setFiles((prevFiles) => {
          const newFiles = [
            ...prevFiles,
            ...Array.from(addedFiles).map((file) => ({
              file,
              url: URL.createObjectURL(file),
            })),
          ];
          onFileSelected(newFiles);
          return newFiles;
      })
    }


    return (
    
    <div className="dropzone" onDragOver={handleDrag} onDrop={handleDrop}>
        <CloudUploadIcon sx={{fontSize:'100px', color:'#3984ff'}}/>
       <p>Drag & Drop</p>
       <h5>OR</h5>
       <input type="file" multiple ref={inputRef} onChange={handleUploadChange} hidden/>
      <button onClick={()=>inputRef.current.click()}>Select Files</button>

      {progress.started && <progress max="100" value={progress.progInPercent}></progress>}
      {alert && <span>{alert}</span> }
      {/* <AlbumGrid files={files}/> */}
    </div>

    );
  };
  export default FileUploader;
