import React, { useEffect, useState } from "react";
import AlbumPreview from "./AlbumPreview";
import { useUserContext } from "./../context/usercontext";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import apiClient from '../util/apiClient';

const AlbumList = ({ onFetch, filterType, searchTerms }) => {
  const componentStyle = {
    display: "flex",
    gap: "30px",
    marginTop: "30px",
    flexWrap: "wrap",
  };

  const { user, updateUser, logoutUser } = useUserContext();
  const [allAlbumsPopulated, setAllAlbumsPopulated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllAlbums = ()=>{
    try {
      const response = apiClient
        .get(`/albums`, {
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
  }

  useEffect(() => {
    setIsLoading(true);
    fetchAllAlbums();
    setIsLoading(false);
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

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!searchTerms) {
        fetchAllAlbums();
        return;
      }
      try {
        const res = await apiClient.get(
          `/search?searchTerms=${searchTerms}`,
          { withCredentials: true }
        );
        setAllAlbumsPopulated(res.data);

      } catch (err) {
        console.log("Albums search failed", err);
      }
    };
  
    fetchAlbums();
  }, [searchTerms]);

  return (
    <div className="album-list-wrapper" style={componentStyle}>
      {!isLoading ? allAlbumsPopulated.map((album) => (
        <AlbumPreview
          key={album.album._id}
          album={album.album}
          presignedUrls={album.presignedUrls}
        />
      )): <BallTriangle/>}
    </div>
  );
};

export default AlbumList;
