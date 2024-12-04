import { useState, useRef, useEffect } from "react";
import { TagInput } from ".";
import {
  EditNote,
  Delete,
  HighlightOff,
  ModeOfTravelTwoTone,
} from "@mui/icons-material";
import "./albumgrid.css";

const AlbumGrid = ({
  photos,
  handleOnSave,
  handleRemove,
  imageObjs,
  edit,
  handleEditRemove,
}) => {
  const [singlePhoto, setSinglePhoto] = useState({});
  const ref = useRef(null);
  const [modal, setModal] = useState(false);
  const [horizontal, setHorizontal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showWarningIndex, setShowWarningIndex] = useState(null);

  const [photoValues, setPhotoValues] = useState({
    note: "",
    tags: [],
  });

  const openImage = (e, index) => {
    setModal(true);
    handleOrientation(e);
    const clicked = photos[index];
    setSinglePhoto({ ...clicked, index: index });
  };
  const openImageObj = (index) => {
    if (index === null) setHoveredIndex(null);
    setHoveredIndex(index);
    const clicked = imageObjs[index];
    setSinglePhoto({ ...clicked, index: index });
  };

  useEffect(() => {
    if (modal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [singlePhoto, modal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target === ref.current) {
        setModal(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const handleOrientation = (e) => {
    if (e.target.width > e.target.height) {
      setHorizontal(true);
    } else {
      setHorizontal(false);
    }
  };

  const handleChange = (e) => {
    setPhotoValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTags = (tags) => {
    setPhotoValues((prev) => ({ ...prev, tags: tags }));
  };

  const handleSaveAndClose = () => {
    setModal(false);
    const photo = { ...singlePhoto, ...photoValues };
    handleOnSave(singlePhoto.index, photo);
    setPhotoValues({ note: "", tags: [] });
  };

  const onDeleteClick = (e, idx) => {
    e.stopPropagation();
    setShowWarningIndex(idx);
  };

  return (
    <>
      {photos && (
        <div className="gallery">
          <dialog ref={ref} className={modal}>
            <div className="dialog-full">
              <div
                className={`dialog-img-wrapper ${
                  horizontal ? "horizontal" : "vertical"
                }`}
              >
                <img src={singlePhoto.url} alt="photos" loading="lazy" />
              </div>
              <div className="dialog-img-details-wrapper">
                <div className="dialog-img-details-note">
                  <span>
                    <EditNote
                      sx={{ color: "rgb(137, 137, 137)", marginRight: "3px" }}
                    />{" "}
                    Photo note:
                  </span>
                  <input
                    type="text"
                    placeholder="Me and the gang at Java Joe's."
                    maxLength={120}
                    name="note"
                    id="note"
                    value={photoValues["note"]}
                    onChange={handleChange}
                  />
                </div>
                <TagInput
                  title="Photo"
                  size="16px"
                  handleTags={handleTags}
                  tags={photoValues.tags}
                />
                <div className="dialog-img-details-buttons">
                  <button onClick={handleSaveAndClose}>Save</button>
                  <button onClick={() => setModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </dialog>
          {photos.map((item, index) => {
            return (
              <div
                className="picture"
                key={index}
                onClick={(e) => openImage(e, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <picture>
                  <source srcSet={item.url} type="image/webp" />
                  <img src={item.url} alt="Example" style={{ width: "100%", height:"auto" }} loading="lazy"/>
                </picture>

                {hoveredIndex === index && (
                  <Delete
                    onClick={(e) => handleRemove(e, index)}
                    sx={{
                      color: "black",
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {imageObjs && (
        <div className="gallery">
          {imageObjs.map((imageObj, index) => {
            return (
              <div
                className="picture"
                key={index}
                onMouseEnter={() => openImageObj(index)}
                onMouseLeave={() => openImageObj(null)}
              >
                <picture>
                  <source srcSet={imageObj.presignedUrl} type="image/webp" />
                  <img
                    loading="lazy"
                    src={imageObj.presignedUrl}
                    alt="Example"
                    style={{ width: "100%", height: "auto" }}
                  />
                </picture>
                <figcaption
                  className={hoveredIndex === index ? "opened" : "closed"}
                >
                  {imageObj.note}
                  <div style={{height:"20px"}}></div>
                  {imageObj.tags.map((tag,tagIdx)=>(
                    <span key={tagIdx}> #{tag}</span>
                  ))}
                </figcaption>
                {edit ? (
                  <Delete
                    onClick={(e) => onDeleteClick(e, index)}
                    sx={{
                      color: "black",
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                    }}
                  />
                ) : (
                  ""
                )}
                {showWarningIndex === index && (
                  <div className="warning-dialog">
                    <p>Are you sure you want to delete this image?</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowWarningIndex(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        handleEditRemove(e, index);
                        setShowWarningIndex(null);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AlbumGrid;
