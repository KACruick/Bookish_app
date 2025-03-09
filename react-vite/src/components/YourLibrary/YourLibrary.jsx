import './YourLibrary.css'
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getBookshelves, getBookshelfDetails } from "../../redux/bookshelves";
import { thunkAuthenticate } from "../../redux/session";
import OpenModalButton from "../OpenModalButton";
import CreateBookshelf from '../CreateBookshelf';
// import "../../../dist/images/cover_coming_soon.jpeg"

function YourLibrary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);
  const bookshelves = useSelector((state) => Object.values(state.bookshelves.allBookshelves));
  // const currentBookshelf = useSelector((state) => state.bookshelves.currentBookshelf);


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

  // Sort the books inside each bookshelf by their orderInShelf
  const sortedBookshelves = userBookshelves.map(shelf => {
    // If the shelf has books, sort them by their orderInShelf
    if (shelf.Books) {
      const sortedBooks = shelf.Books.sort((a, b) => a.orderInShelf - b.orderInShelf);
      return { ...shelf, Books: sortedBooks };
    }
    return shelf;
  });

  return (
    <div>
      <h1>Your Library </h1>

      <div className="create-new-bookshelf">
      <OpenModalButton
        buttonText="Create a new bookshelf"
        modalComponent={<CreateBookshelf onClose={() => {}} />}
        className="create-bookshelf-button"
      />
      </div>

      {/* Render each bookshelf */}
      <div className="bookshelves-container">
        {sortedBookshelves.length > 0 ? (
          sortedBookshelves.map((shelf) => (
            <div key={shelf.id} className="bookshelf-container">
              <h2>{shelf.name}</h2>
              {/* Button to navigate to the bookshelf reorder page */}
              <Link to={`/bookshelves/${shelf.id}`} className="reorder-button">
                Edit or reorder books in shelf
              </Link>
              <p>{shelf.description}</p>

              {/* Render books inside the bookshelf */}
              <div className="books-container">
                {shelf.Books && shelf.Books.length > 0 ? (
                  shelf.Books.map((book) => (
                    <div key={book.id} className="book-tile">
                      <Link to={`/books/${book.id}`}>
                        <img 
                          src={book.coverPicture || '../../images/Cover_coming_soon.jpeg'} 
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
