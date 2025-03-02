import "./HomePage.css";
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getBookclubs } from '../../redux/bookclubs'
import { getBookshelves, getBookshelfDetails } from "../../redux/bookshelves";
import { thunkAuthenticate } from "../../redux/session";


function HomePage() {

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const sessionUser = useSelector((state) => state.session.user);
    const bookshelves = useSelector((state) => Object.values(state.bookshelves.allBookshelves));
    const currentBookshelf = useSelector((state) => state.bookshelves.currentBookshelf);
    const bookclubs = useSelector((state) => Object.values(state.bookclubs.bookclubs));

    const [loading, setLoading] = useState(true);

    console.log("currentBookshelf: ", currentBookshelf)

    const userBookshelves = bookshelves.length > 0 ? bookshelves.filter((shelf) => shelf.userId === sessionUser.id) : [];
    console.log("userBookshelves: ", userBookshelves)
    // Find the "Currently Reading" bookshelf (typically the user's 2nd shelf)
    const currentlyReadingShelf = bookshelves.find(
      (shelf) => shelf.name === "Currently reading" && shelf.userId === sessionUser.id
    );
    const currentlyReadingShelfId = currentlyReadingShelf ? currentlyReadingShelf.id : null;
    console.log("currentlyReadingShelf: ", currentlyReadingShelf);

    useEffect(() => {
      dispatch(thunkAuthenticate());
      dispatch(getBookclubs());
      dispatch(getBookshelves());
      // dispatch(getBookshelfDetails(currentlyReadingShelfId))
      // setLoading(false);
    }, [dispatch]);

    useEffect(() => {
      if (currentlyReadingShelfId) {
          dispatch(getBookshelfDetails(currentlyReadingShelfId));
      }
      setLoading(false);
  }, [dispatch, currentlyReadingShelfId]);

    // // Check if all necessary data is loaded
    // useEffect(() => {
    //   // Wait for sessionUser, bookshelves, bookclubs, and currentBookshelf to be available
    //   if (sessionUser && bookshelves.length > 0 && bookclubs.length > 0) {
    //     setLoading(false); // Set loading to false when data is available
    //   }
    // }, [sessionUser, bookshelves, bookclubs]);

    if (loading) return <div>Loading...</div>;
    

    console.log("sessionUser: ", sessionUser)
    console.log("user id: ", sessionUser.id)
    console.log("bookshelves: ", bookshelves)
    
    // console.log("bookclubs: ", bookclubs)
    // console.log("bookclubs[0]: ", bookclubs[0])
    
    // console.log("currentBookshelf: ", currentBookshelf.Books)
    // console.log("currentBookshelf.Book[0]: ", currentBookshelf.Books[0])
    // console.log("currentBookshelf.Book[0]: ", currentBookshelf.Books[0].coverPicture)

    const getImageOrPlaceholder = (imageUrl) => {
      return imageUrl ? imageUrl : '/path/to/placeholder-image.jpg';  // Use a local placeholder image path or URL
    };

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
      <div className="bookclubs-div">
        <h2>Book Clubs</h2>
        <div className="bookclub-list">
          {bookclubs.length > 0 ? (
            bookclubs.map((bookclub) => (
              <div className="bookclub-tile" key={bookclub.id}>
                <Link to={`/bookclubs/${bookclub.id}`}>
                  {/* Check if the book exists and if the cover image is available */}
                  {bookclub.book && bookclub.book.coverPicture ? (
                    <img
                      src={bookclub.book.coverPicture}
                      alt={bookclub.name}
                      className="bookclub-cover"
                    />
                  ) : (
                    <div className="no-cover-placeholder">No Cover</div>
                  )}
                  <h3>{bookclub.name}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No book clubs available.</p>
          )}
        </div>
      </div>

      {/* Currently Reading Section */}
      <div className="update-status-div">
        <h2>Update Your Reading Status</h2>
        <div className="currently-reading-list">
          {currentBookshelf?.Books && currentBookshelf.Books.length > 0 ? (
            currentBookshelf.Books.map((book) => (
              <div className="currently-reading-tile" key={book.id}>
                <Link to={`/books/${book.id}`}>
                  <img
                    src={book.coverPicture}
                    alt={book.title}
                    className="book-cover"
                  />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </Link>
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
