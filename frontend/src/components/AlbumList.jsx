import React, { useEffect, useState } from "react";
import AlbumPreview from "./AlbumPreview";
import { useUserContext } from "./../context/usercontext";
import axios from "axios";

const AlbumList = ({ onFetch, filterType }) => {
  const componentStyle = {
    display: "flex",
    gap: "30px",
    marginTop: "30px",
    flexWrap: "wrap",
  };

  const { user, updateUser, logoutUser } = useUserContext();
  const [allAlbumsPopulated, setAllAlbumsPopulated] = useState([]);

  useEffect(() => {
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
      console.log("All albums fetching failed", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    handleAlbumsFilter();
  }, [filterType]);

  const handleAlbumsFilter = () => {
    if (filterType === "Alphabetical") {
      sortAlbumsAlphabetically();
    } else {
      sortAlbumsByCreationDate();
    }
  };

  const sortAlbumsAlphabetically = () => {
    setAllAlbumsPopulated(
      [...allAlbumsPopulated].sort((a, b) => {
        return a.album.title.localeCompare(b.album.title);
      })
    );
  };
  const sortAlbumsByCreationDate = () => {
    setAllAlbumsPopulated(
      [...allAlbumsPopulated].sort((a, b) => {
        return new Date(a.album.createdAt) - new Date(b.album.createdAt);
      })
    );
  };

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
