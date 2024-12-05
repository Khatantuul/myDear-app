import {Brand} from '.';
import './navbar.css';
import { Link} from "react-router-dom";

const NavBar = () => {
  return (
    <div class="navbar-wrapper">
      <div class="navbar">
        <Brand/>
        <div class="link">
          <div className="signup-link-wrapper">
            <Link to='/signup' class="signup-link">Sign up</Link>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default NavBar