import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from 'react-redux';
import "./Navigation.css";
import "../../../dist/logo/bookish_logo.png"

function Navigation() {
  const sessionUser = useSelector((state) => state.session.session);

  return (
    <div className="nav">
      
    <ul className="nav-list">
      
      <div className="logo-title">
        <NavLink to="/" className="logo">
          <img 
            src="../../../dist/logo/bookish_logo.png" 
            alt="Bookish Logo" 
            className='logo'
          />
          {/* <h1 className="bookish-title">Bookish</h1> */}
        </NavLink>
      </div>

      <li><NavLink to="/books">Discover</NavLink></li>
      <li><NavLink to="/bookclubs/current">Your Bookclubs</NavLink></li>
      <li><NavLink to="/bookshelves/current">Your Library</NavLink></li>
      <li><NavLink to="/community">Community Activity</NavLink></li>


      {sessionUser && (
          <>
            {/* <li className="nav-item">
              <NavLink to="/favorites" className="favorites-link">
                <FaHeart className="heart-icon" />
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products/new" className="create-product-link">
                <FaPlus className="plus-icon" />
                <span>Create Product</span>
              </NavLink>
            </li> */}
          </>
        )}

      <div className="nav-right">
          <li className="nav-item">
            <ProfileButton />
          </li>
        </div>
    </ul>
    </div>
  );
}

export default Navigation;
