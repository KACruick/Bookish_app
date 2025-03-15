import "./HomePage.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getBookclubs } from '../../redux/bookclubs'
import { getBookshelves, getBookshelfDetails } from "../../redux/bookshelves";
// import { thunkAuthenticate } from "../../redux/session";
import { createSelector } from 'reselect';


function HomePage() {

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const sessionUser = useSelector((state) => state.session.user);
    const bookshelves = useSelector((state) => Object.values(state.bookshelves.allBookshelves));
    console.log("bookshelves: ", bookshelves)
    const currentBookshelf = useSelector((state) => state.bookshelves.currentBookshelf);
    const bookclubs = useSelector((state) => Object.values(state.bookclubs.bookclubs));

    const [loading, setLoading] = useState(true);

    // Memoized selector for user-specific bookshelves to prevent unnecessary re-renders
    const userBookshelves = useSelector(
      createSelector(
        (state) => Object.values(state.bookshelves.allBookshelves), // Convert object to array here
        (allBookshelves) => allBookshelves.filter((shelf) => shelf.userId === sessionUser?.id)
        )
    );
    console.log("userBookshelves: ", userBookshelves)

    const currentlyReadingShelf = useSelector(
      createSelector(
        (state) => Object.values(state.bookshelves.allBookshelves),
        (allBookshelves) =>
          allBookshelves.find(
            (shelf) => shelf.name === "Currently reading" && shelf.userId === sessionUser?.id
          )
      )
    );

    useEffect(() => {
      if (sessionUser) {
        dispatch(getBookclubs());
        dispatch(getBookshelves());
      }
    }, [dispatch, sessionUser]);

    useEffect(() => {
      if (sessionUser && currentBookshelf?.id) {
        dispatch(getBookshelfDetails(currentBookshelf.id));
      }
      setLoading(false);
    }, [dispatch, sessionUser, currentBookshelf]);



    if (loading) return <div>Loading...</div>;


    

    // console.log("sessionUser: ", sessionUser)
    // console.log("user id: ", sessionUser.id)
    // console.log("bookshelves: ", bookshelves)
    
    // console.log("bookclubs: ", bookclubs)
    // console.log("bookclubs[0]: ", bookclubs[0])
    
    // console.log("currentBookshelf: ", currentBookshelf.Books)
    // console.log("currentBookshelf.Book[0]: ", currentBookshelf.Books[0])
    // console.log("currentBookshelf.Book[0]: ", currentBookshelf.Books[0].coverPicture)

    // const getImageOrPlaceholder = (imageUrl) => {
    //   return imageUrl ? imageUrl : '/path/to/placeholder-image.jpg';  // Use a local placeholder image path or URL
    // };


    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Navigate to the discover page with the search query
        navigate(`/books?search=${searchQuery}`);
      } else {
        navigate('/books'); // Redirect to the discover page without a search query
      }
    };

    // Handle mark as read button click
  // const handleMarkAsRead = (bookId) => {
  //   // Dispatch action to remove book from "Currently Reading" shelf and add it to "read" shelf
  // };

  return (
    <div className="home-page">

      {/* <h1>Home page</h1> */}

      {/* <div className="searh-and-create">
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

        <div className="button-to-create-book">
          <p>Can&apos;t find the book you&apos;re looking for?</p>
          <Link to={`/books/add`}>Add a book</Link>
        </div>
      </div> */}
      
      <div className="clubs-and-search">
        {/* Bookclubs Section */}
        <div className="bookclubs-div">
          <h2>Your Current Bookclubs</h2>
          <div className="bookclub-list">
            {sessionUser ? (
              bookclubs.length > 0 ? (
                bookclubs.map((bookclub) => (
                  <div className="home-bookclub-tile" key={bookclub.id}>
                    <Link to={`/bookclubs/${bookclub.id}`}>
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
              )
            ) : (
              <div className="not-logged-in-div">
              <p className="not-logged-in">Log in to start a bookclub!</p>
              </div>
            )}
          </div>
        </div>

        <div className="search-book">
          <div className="search-and-create">
            <h2>Search for a Book</h2>
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

            <div className="button-to-create-book">
              <p>Can&apos;t find the book you&apos;re looking for?</p>
              <Link to={`/books/add`} className="add-book-link">Add a book</Link>
            </div>
          </div>
        </div>
      </div>

      

      {/* Currently Reading Section */}
      <div className="update-status-div">
        <h2>Update Your Reading Status</h2>
        <div className="currently-reading-list">
          {sessionUser ? (
            currentlyReadingShelf?.Books && currentlyReadingShelf.Books.length > 0 ? (
              currentlyReadingShelf.Books.map((book) => (
                <div className="currently-reading-tile" key={book.id}>
                  <Link to={`/books/${book.id}`}>
                    <img
                      src={book.coverPicture}
                      alt={book.title}
                      className="currently-reading-book-cover"
                    />
                  </Link>
                  <button className="mark-as-read">Mark as Read</button>
                </div>
              ))
            ) : (
              <p>You are not currently reading any books.</p>
            )
          ) : (
            <div className="not-logged-in-div">
            <p className="not-logged-in">Log in to start adding books to your shelves!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage
