import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from 'react-redux';
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.session);

  return (
    <div className="nav">
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li><NavLink to="/">Discover</NavLink></li>
      <li><NavLink to="/">Bookclubs</NavLink></li>
      <li><NavLink to="/">Your Library</NavLink></li>
      <li><NavLink to="/">Community Activity</NavLink></li>


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
