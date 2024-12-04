import { useEffect, useState } from "react";
import { NavBar, Brand, AlbumList, UserDetailsDropdown } from "../components";
import "./studio-space.css";
import {
  SearchTwoTone,
  PhotoCamera,
  Loyalty,
  EmojiEvents,
  ChevronRightTwoTone,
  Add,
  ModeNight,
  Clear
} from "@mui/icons-material";
import { useUserContext } from "./../context/usercontext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Achievements from "./Achievements";
import debounce from "lodash.debounce"; // Use lodash's debounce for simplicity


const Studiospace = () => {
  const mainContentTypes = ["albums", "achievements", "special"];
  const types = ["Date Created", "Alphabetical"];
  const { user, updateUser } = useUserContext();
  const [filterType, setFilterType] = useState(types[0]);
  const [allAlbums, setAllAlbums] = useState(null);
  const [mainContentType, setMainContentType] = useState("albums");
  const [activeTab, setActiveTab] = useState(mainContentTypes[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Debounced value

  const navigate = useNavigate();

  const handleAlbumsFetched = (albumData) => {
    setAllAlbums(albumData);
  };

  const handleTabClick = (contentType) => {
    setActiveTab(contentType);
    setMainContentType(contentType);
  };

  const handleFilter = async (e) => {
    const type = e.target.value === "" ? null : e.target.value;
    setFilterType(type);
  };

  useEffect(() => {
    const handler = debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 500); // Debounce delay (500ms)

    handler(searchTerm);

    return () => handler.cancel(); // Clean up debounce handler
  }, [searchTerm]);

  const handleSearchBarChange = (e) => {
    setSearchTerm(e.target.value); // Update search term on every keystroke
  };

  const handleRemoveInput = ()=>{
    setSearchTerm("");
  }

  return (
    <div className="studiospace">
      <div className="studiospace-container">
        <div className="studio-header">
          <div className="header-in-left">
            <h1>My Studio</h1>
          </div>
          <div className="header-in-right">
            <div className="search-bar-wrapper">
              <div className="search-icon-wrapper">
                <SearchTwoTone />
              </div>
              <div className="search-input-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder='Search by tags e.g. "9th birthday"'
                  value={searchTerm}
                  onChange={handleSearchBarChange}
                />
            
               
               {/* <button onClick={() => setDebouncedSearchTerm(searchTerm)}>Search</button> */}
              </div>
              {searchTerm && 
              <div className="delete-icon-wrapper">
                 <Clear fontSize="small" onClick={handleRemoveInput}/>
              </div>
}
            </div>
          </div>
          <div className="header-title-wrapper">
            <UserDetailsDropdown />
          </div>
        </div>
        <div className="studiospace-left">
          <div className="studio-menu-wrapper">
            <div
              className={`studio-menu-albums ${
                activeTab === mainContentTypes[0] ? "active" : ""
              }`}
            >
              <button
                className="menu-albums"
                onClick={() => {
                  handleTabClick(mainContentTypes[0]);
                }}
              >
                <div className="menu-albums-wrapper">
                  <div className="menu-albums-left">
                    <PhotoCamera sx={{ color: "rgb(137, 137, 137)" }} />
                    <span>Albums</span>
                  </div>
                  <div className="menu-albums-right">
                    <ChevronRightTwoTone />
                  </div>
                </div>
              </button>
            </div>
            <div
              className={`studio-menu-achieve ${
                activeTab === mainContentTypes[1] ? "active" : ""
              }`}
            >
              <button
                className="menu-achieve"
                onClick={() => {
                  handleTabClick(mainContentTypes[1]);
                }}
              >
                <div className="menu-achieve-wrapper">
                  <div className="menu-achieve-left">
                    <EmojiEvents sx={{ color: "rgb(137, 137, 137)" }} />
                    <span>Achievements</span>
                  </div>
                  <div className="menu-achieve-right">
                    <ChevronRightTwoTone />
                  </div>
                </div>
              </button>
            </div>
            <div className="studio-menu-special">
              <button className="menu-special">
                <div className="menu-special-wrapper">
                  <div className="menu-special-left">
                    <Loyalty sx={{ color: "rgb(137, 137, 137)" }} />
                    <span>Special</span>
                  </div>
                  <div className="menu-special-right">
                    <ChevronRightTwoTone />
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="studio-analytics-wrapper">
            <h3>Moments Collected</h3>
            <div className="analytics analytics-album-count">
              Album count: {allAlbums?.length}
            </div>
            {/* <div className="analytics analytics-photos-count">
              Photos count:{" "}
              {allAlbums?.reduce(
                (acc, album) => acc + (album.album.photos.length || 0),
                0
              )}
            </div> */}
            <div className="analytics analytics-files-count">Files count</div>
          </div>
        </div>
        <div className="studiospace-right">
          <div className="top">
          <div className="greetings-wrapper">
              <h1>Hello, {user.username}!</h1>
            </div>
            <div className="content-header-wrapper">
              <div className="create-album-link-wrapper">
                <div className="createAlbum-icon">
                  <Add
                    sx={{
                      color: "white",
                      fontSize: "large",
                      marginRight: "1px",
                      verticalAlign: "middle",
                    }}
                  />
                </div>
                {mainContentType === "albums" && (
                  <Link to="/albums" className="createAlbum-link">
                    Create new album
                  </Link>
                )}
                {mainContentType === "achievements" && (
                  <Link to="" className="createAlbum-link">
                    Add new
                  </Link>
                )}
              </div>
              {mainContentType !== "achievements" &&
              <div className="filter">
                <select value={filterType} onChange={handleFilter}>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
}
            </div>
          </div>
          <div className="content-in-right">
          
          
            {mainContentType === "albums" ? (
              <div className="studio-content-wrapper">
                <div className="main-content">
                  <AlbumList onFetch={handleAlbumsFetched} filterType={filterType} searchTerms={debouncedSearchTerm} />
                </div>
              </div>
            ): <div className="achieve" style={{fontSize: "28px", marginLeft: "15px"}}><p>Coming soon!</p></div>
            }
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studiospace;
