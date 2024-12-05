import { useState, useRef } from "react";
import "./add-photos.css";
import {
  FileUploader,
  AlbumGrid,
  UserDetailsDropdown,
} from "../components";

import axios from "axios";
import { useUserContext } from "../context/usercontext";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { toast } from "sonner";
import { BallTriangle } from "react-loader-spinner";
import apiClient from '../util/apiClient';

const AddPhotos = () => {
  const { user, updateUser } = useUserContext();
  const location = useLocation();
  const {title,albumId} = location.state || {};
  const [onFileSelected, setOnFileSelected] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();

  const maxUploads = 10;
 

  const handleFileSelected = (photos) => {
    setSelectedPhotos(photos);
    setOnFileSelected(true);
    if (photos.length > 10) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  };



  const handleOnSave = (index, values) => {
    setSelectedPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.map((photo, idx) => {
        if (idx === index) {
          return { ...photo, ...values };
        } else {
          return photo;
        }
      });
      return updatedPhotos;
    });
  };



  const handleUploadChange = (e) => {
    const addedFiles = e.target.files;
    setSelectedPhotos((prevFiles) => {
      const newFiles = [
        ...prevFiles,
        ...Array.from(addedFiles).map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      ];
      return newFiles;
    });
    setOnFileSelected(true);

    if (selectedPhotos.length > 10) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  };


  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedPhotos.length > 10) {
      setInvalid(true);
      return;
    }
    const formData = new FormData();
    try {
      const photoInfo = {};
      selectedPhotos.forEach((photo, idx) => {
        const { index, note, tags } = photo;

        photoInfo[`${idx}`] = { index, note, tags };
        formData.append(`files`, photo.file);
      });

      formData.append(`photoInfo`, JSON.stringify(photoInfo));
      formData.append("albumInfo", JSON.stringify({albumId,creator: user.userID}));

      setIsPublishing(true);

      const res = await apiClient
        .patch("/albums", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((res) => {
          toast.success("Successfully added photos!");
          setIsPublishing(false);
          navigate(`/albums/${albumId}`);
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      throw err;
    }
  };



  const handleRemove = (e, idx) => {
    e.stopPropagation();
    const updatedPhotos = selectedPhotos.filter(
      (photo, index) => index !== idx
    );
    setSelectedPhotos(updatedPhotos);
    const photos = updatedPhotos?.length || 0;
    if(photos===0){
      setOnFileSelected(false);
    }else if(photos < 10){
      setInvalid(false);
    }
  };

  return (
    <div className="addphotos-main-container">
      <div className="create-album-header">
        <div className="create-album-header-left">
          <div className="header-left-first">
            <div className="create-album-back-studio">
              <Link
                to={`/accounts/${user.userID}/studiospace`}
                className="header-back-studio"
              >
                My Studio
              </Link>
            </div>
            <span>/</span>
          </div>
          <div className="header-left-second">
            <span>{title}</span>
          </div>
        </div>
        <div className="create-album-header-buttons-wrapper">
          <div className="create-album-add-more-button-wrapper">
            <input
              type="file"
              multiple
              ref={inputRef}
              onChange={handleUploadChange}
              hidden
            />
            <button onClick={() => inputRef.current.click()}>Add photos</button>
          </div>
          <div className="create-album-header-right">
            <Link
              to={`/albums/${albumId}`}
              className="create-album-publish"
              onClick={handleUpload}
            >
              Publish
            </Link>
          </div>
          <UserDetailsDropdown />
        </div>
      </div>
      <div className="addphotos-create-album-right">
        {invalid && 
        <div className="maxUpload-error-wrapper" invalid={invalid.toString()}>
          <span className="error-icon"></span>
          <p>Please only work on up to 10 photos at a time for an album!</p>
        </div>
}
        {onFileSelected === false ? (
          <FileUploader onFileSelected={handleFileSelected} />
        ) : !isPublishing ? (
          <AlbumGrid
            photos={selectedPhotos}
            handleOnSave={handleOnSave}
            handleRemove={handleRemove}
          />
        ) : (
          ""
        )}
        {isPublishing && (
          <div className="spinner-container">
            <BallTriangle />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPhotos;
