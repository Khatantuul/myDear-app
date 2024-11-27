import {Brand} from '.';
import './navbar.css';


const NavBar = () => {
  return (
    <div class="navbar-wrapper">
      <div class="navbar">
        <Brand/>
        <div class="link">
          <div className="signup-link-wrapper">
            <a href='http://localhost:3000/signup' class="signup-link">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar