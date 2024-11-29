import React, { useEffect, useState } from "react";
import AlbumPreview from "./AlbumPreview";
import { useUserContext } from "./../context/usercontext";
import axios from "axios";

const AlbumList = ({ onFetch }) => {
  const componentStyle = {
    display: "flex",
    gap: "30px",
    "margin-top": "30px",
  };

  const { user, updateUser, logoutUser } = useUserContext();
  const [allAlbumsPopulated, setAllAlbumsPopulated] = useState([]);

  useEffect(() => {
    console.log("its working in albumslist");
    try {
      const response = axios
        .get(`http://localhost:9000/albums`, {
          withCredentials: true,
          headers: {
            preview: true,
            // 'If-None-Match': storedEtag
          },
        })
        .then((res) => {
          setAllAlbumsPopulated(res.data);
          onFetch(res.data);
        })
        .catch((err) => {
          if (err.status === 304) {
            console.log("Data served from browser cache");

            if (allAlbumsPopulated && allAlbumsPopulated.length > 0) {
              console.log("Using cached state");
              setAllAlbumsPopulated(allAlbumsPopulated);
            } else {
              console.error("No cached data available in memory");
            }
          }
          if (err.response.status === 401) {
            logoutUser();
          }
        });
    } catch (err) {
      console.log("albumssss error", err);
    }
  }, []);

  return (
    <div className="album-list-wrapper" style={componentStyle}>
      {allAlbumsPopulated.map((album) => (
        <AlbumPreview
          key={album.album._id}
          album={album.album}
          presignedUrls={album.presignedUrls}
        />
      ))}
    </div>
  );
};

export default AlbumList;
