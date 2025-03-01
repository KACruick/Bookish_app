import "./HomePage.css";
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getBookclubs } from '../../redux/bookclubs'
import { getBookshelves } from "../../redux/bookshelves";
import { thunkAuthenticate } from "../../redux/session";


function HomePage() {

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const sessionUser = useSelector((state) => state.session.user);
    const bookshelves = useSelector((state) => Object.values(state.bookshelves.allBookshelves));
    const bookClubs = useSelector((state) => Object.values(state.bookclubs.bookclubs));

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      dispatch(thunkAuthenticate());
      dispatch(getBookclubs());
      dispatch(getBookshelves());
      setLoading(false);
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    

    console.log("sessionUser: ", sessionUser)
    console.log("user id: ", sessionUser.id)
    console.log("bookshelves: ", bookshelves)
    const userBookshelves = bookshelves.length > 0 ? bookshelves.filter((shelf) => shelf.userId === sessionUser.id) : [];

    console.log("userBookshelves: ", userBookshelves)
    // Find the "Currently Reading" bookshelf (typically the user's 2nd shelf)
    const currentlyReadingShelf = Object.values(bookshelves).find(
      (shelf) => shelf.name === "Currently reading"
    );
    console.log("currentlyReadingShelf: ", currentlyReadingShelf)

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

    // Handle mark as read button click
  const handleMarkAsRead = (bookId) => {
    // Dispatch action to remove book from "Currently Reading" shelf
    // Here you can trigger any action to update the book's status or remove it
    // e.g., dispatch(removeBookFromShelf(currentlyReadingShelf.id, bookId));
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

      {/* Bookclubs Section */}
      <div className="bookclubs">
        <h2>Book Clubs</h2>
        <div className="bookclub-list">
          {bookClubs.length > 0 ? (
            bookClubs.map((bookClub) => (
              <div className="bookclub-tile" key={bookClub.id}>
                <img src={bookClub.coverImage} alt={bookClub.name} className="bookclub-cover" />
                <h3>{bookClub.name}</h3>
              </div>
            ))
          ) : (
            <p>No book clubs available.</p>
          )}
        </div>
      </div>

      {/* Currently Reading Section */}
      <div className="update-status">
        <h2>Update Your Reading Status</h2>
        <div className="currently-reading-list">
          {currentlyReadingShelf ? (
            currentlyReadingShelf.books.map((book) => (
              <div className="currently-reading-tile" key={book.id}>
                <img src={book.coverImage} alt={book.title} className="book-cover" />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <button className="mark-as-read" onClick={() => handleMarkAsRead(book.id)}>
                  Mark as Read
                </button>
              </div>
            ))
          ) : (
            <p>You are not currently reading any books.</p>
          )}
        </div>
      </div>

    </div>
  )
}

export default HomePage
