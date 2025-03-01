import "./HomePage.css";
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';



function HomePage() {

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    
    const handleSearch = (e) => {
        e.preventDefault();
        // console.log("Searching for:", searchQuery);
        // Navigate to the home page with the search query in the URL
        if (searchQuery.trim()) {
          navigate(`/?search=${searchQuery}`);
        } else {
          navigate('/'); // Clear the search query if the search bar is empty
        }
    };

  return (
    <div className="home-page">

      <h1>Home page</h1>

      <div className="search-bar">
        <form onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
      </div>

      <div className="bookclubs"></div>
      
      <div className="update-status"></div>

    </div>
  )
}

export default HomePage
