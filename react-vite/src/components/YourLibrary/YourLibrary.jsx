import './YourLibrary.css'
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getBookshelves, getBookshelfDetails } from "../../redux/bookshelves";
import { thunkAuthenticate } from "../../redux/session";

function YourLibrary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);
  const bookshelves = useSelector((state) => Object.values(state.bookshelves.allBookshelves));
  const currentBookshelf = useSelector((state) => state.bookshelves.currentBookshelf);


  useEffect(() => {
    dispatch(thunkAuthenticate());
    dispatch(getBookshelves());
    if (userBookshelves.length > 0) {
      userBookshelves.forEach((shelf) => {
        if (!shelf.Books || shelf.Books.length === 0) {
            dispatch(getBookshelfDetails(shelf.id));
        }
      })
    }
  }, [dispatch]);

  // If bookshelves exist, filter them to get only the user's bookshelves
  const userBookshelves = bookshelves.length > 0 ? bookshelves.filter((shelf) => shelf.userId === sessionUser.id) : [];

  console.log("bookshelves: ", bookshelves)
  // const userBookshelves = bookshelves.length > 0 ? bookshelves.filter((shelf) => shelf.userId === sessionUser.id) : [];
  console.log("userBookshelves: ", userBookshelves)

  return (
    <div>
      <h1>your library! show shelfs, add shelf button, etc. </h1>

      <div className="create-new-bookshelf">
        <button>Create a new bookshelf</button>
      </div>

      {/* Render each bookshelf */}
      <div className="bookshelves-container">
        {userBookshelves.length > 0 ? (
          userBookshelves.map((shelf) => (
            <div key={shelf.id} className="bookshelf-container">
              <h2>{shelf.name}</h2>
              <p>{shelf.description}</p>

              {/* Render books inside the bookshelf */}
              <div className="books-container">
                {shelf.Books && shelf.Books.length > 0 ? (
                  shelf.Books.map((book) => (
                    <div key={book.id} className="book-tile">
                      <Link to={`/books/${book.id}`}>
                        <img 
                          src={book.coverPicture || '/path/to/placeholder-image.jpg'} 
                          alt={book.title} 
                          className="book-cover" 
                        />
                        {/* <h3>{book.title}</h3>
                        <p>{book.author}</p> */}
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No books in this shelf.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No bookshelves found for this user.</p>
        )}
      </div>


    </div>
  )
}

export default YourLibrary
