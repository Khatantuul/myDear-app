import React from "react";
import "./albumpreview.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiClient from '../util/apiClient';

const AlbumPreview = ({ album, presignedUrls }) => {
  const navigate = useNavigate();
  const fetchInitial = async (albumId, { limit }) => {
    try {
      const response = await apiClient.get(
        `/albums/${albumId}`,
        {
          withCredentials: true,
          params: {
            limit,
          },
        }
      );
      return response.data.photoObj;
    } catch (err) {
      console.error("Error fetching high-res images:", err);
      return [];
    }
  };

  const handleRedirect = async () => {
    navigate(`/albums/${album._id}`);
  };

  return (
    <div className="album-preview-container">
      <div className="preview-grid" onClick={handleRedirect}>
        {presignedUrls.map((presignedUrl, index) => (
          <img
            key={index}
            src={presignedUrl.presignedUrl}
            alt={`Photo ${index + 1}`}
          />
        ))}
      </div>

      <div className="album-preview-title">
        <span>{album.title}</span>
      </div>
    </div>
  );
};

export default AlbumPreview;
