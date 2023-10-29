import {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';
import { useUserContext } from './../context/usercontext';


const UserDetailsDropdown = () => {

    const { user, updateUser, logoutUser } = useUserContext();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const ref = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
           if(ref.current && !ref.current.contains(e.target)){
             setDropdownVisible(false);
           }
        }
     
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
         document.removeEventListener('mousedown', handleOutsideClick);
       };
         
       },[])


    const openMenu = () => {
        setDropdownVisible(!isDropdownVisible);
      };
    
      const logout = async() => {
        console.log("getting clicked")
        try{
          const response = await axios.delete('http://localhost:9000/api/sessions',{
            withCredentials: true
          })
          .then((res)=>{
            console.log('getting clicked')
            console.log('so logging out', res.data)
            logoutUser();
            localStorage.removeItem('user');
            navigate('/login');
          })
          .catch((err)=>{
            console.log('logout error',err)
          })
    
        }catch (err){
          console.log('logoutttt error',err)
        }
      }


  return (
    <div className="user-details-wrapper">
    <button onClick={openMenu}>
      <div className="user-details">
        <span>KB</span>
      </div>
    </button>
{/* {isDropdownVisible && ( */}
  <div className={`user-settings-wrapper ${isDropdownVisible ? 'opened' : ''}`} ref={ref}>
    <div className="user-settings">
      <div className="user-settings-account-info-wrapper">
        {/* <img src='/assets/user.jpeg' alt='user'/> */}
        <div className="user-details">
          <span>KB</span>
        </div>
        <div className="user-settings-account-info">
          <span>Khatantuul Batbold</span>
          <span>khatnabb@gmail.com</span>
        </div>

      </div>
        <div className="user-settings-profile">
          <Link to="/albums" className="myprofile-link">
              My Profile
            </Link>
        </div>
        <div className="user-settings-logout">
            <button className="logout-link" onClick={logout}>Log out</button>
        </div>
    </div>      
  </div>


  </div>
  )
}

export default UserDetailsDropdown