import { useState, useRef, useEffect } from "react";
import "./create-album.css";
import {
  TagInput,
  FileUploader,
  AlbumGrid,
  UserDetailsDropdown,
} from "../components";
import { Camera, Description } from "@mui/icons-material";
import axios from "axios";
import { useUserContext } from "./../context/usercontext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BallTriangle } from "react-loader-spinner";
import apiClient from '../util/apiClient';

const CreateAlbum = () => {
  const { user, updateUser } = useUserContext();
  const [title, setTitle] = useState("New Album");
  const [onFileSelected, setOnFileSelected] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [tags, setTags] = useState([]);
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef(null);
  const [values, setValues] = useState({
    title: "",
    tags: [],
    description: "",
    creator: user.userID,
  });
  const [albumId, setAlbumId] = useState(null);
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

  const handleTags = (tags) => {
    setValues((prev) => ({ ...prev, tags: tags }));
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

  const setAlbumTitle = (e) => {
    setTitle(e.target.value);
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

    if (values.title.trim() === "") {
      toast.error("Please set an album title!");
      return;
    }

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
      formData.append("albumInfo", JSON.stringify(values));

      setIsPublishing(true);

      const res = await apiClient
        .post("/albums", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((res) => {
          setAlbumId((prev) => {
            return res.data.album._id;
          });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (albumId) {
      setIsPublishing(false);
      navigate(`/albums/${albumId}`);
    }
  }, [albumId, navigate]);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <div className="main-container">
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

      <div className="create-album-main">
        <div className="create-album-left">
          <div className="create-album-left-menu">
            <div className="left-menu-album-title">
              <span>
                <Camera
                  sx={{ color: "rgb(137, 137, 137)", marginRight: "3px" }}
                />{" "}
                Album Title:
              </span>
              <input
                type="text"
                placeholder="New Album"
                name="title"
                id="title"
                maxLength={20}
                onKeyUp={setAlbumTitle}
                onChange={handleChange}
              />
            </div>
            <div className="left-menu-album-tags">
              <TagInput title="Album" size="16px" handleTags={handleTags} />
            </div>
            <div className="left-menu-album-desc">
              <span>
                <Description
                  sx={{ color: "rgb(137, 137, 137)", marginRight: "3px" }}
                />{" "}
                Album Description:
              </span>
              <textarea
                rows="4"
                cols="25"
                maxLength="150"
                name="description"
                id="description"
                placeholder="This is dedicated to my son's 1st birthday"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="create-album-right">
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

export default CreateAlbum;
