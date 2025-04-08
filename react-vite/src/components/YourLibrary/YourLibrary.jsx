import './YourLibrary.css'
import { useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getBookshelves, getBookshelfDetails } from "../../redux/bookshelves";
import { thunkAuthenticate } from "../../redux/session";
import OpenModalButton from "../OpenModalButton";
import CreateBookshelf from '../CreateBookshelf';
import DeleteBookshelfModal from '../DeleteBookshelfModal';
// import "../../../dist/images/cover_coming_soon.jpeg"

function YourLibrary() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessionUser = useSelector((state) => state.session.user);
  const bookshelves = useSelector((state) => Object.values(state.bookshelves.allBookshelves));
  // const currentBookshelf = useSelector((state) => state.bookshelves.currentBookshelf);

  // If bookshelves exist, filter them to get only the user's bookshelves
  // Memoize userBookshelves so that it only recalculates when bookshelves or sessionUser change
  const userBookshelves = useMemo(() => {
    return bookshelves.filter((shelf) => shelf.userId === sessionUser?.id);
  }, [bookshelves, sessionUser]);



  useEffect(() => {
    // Fetch initial data for authenticated user
    dispatch(thunkAuthenticate());
    dispatch(getBookshelves());
    
    if (userBookshelves.length > 0) {
      userBookshelves.forEach((shelf) => {
        if (!shelf.Books || shelf.Books.length === 0) {
          dispatch(getBookshelfDetails(shelf.id));
        }
      });
    }
  }, [dispatch]);



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
    <div className='your-library-page'>
      <h1>Your Library </h1>

      {!sessionUser && (
        <p className='not-logged-in'>Log in to use Bookish library shelves feature</p>
      )}

{sessionUser && (
        <>
          <div className="create-new-bookshelf">
            <OpenModalButton
              buttonText="Create a new bookshelf"
              modalComponent={<CreateBookshelf onClose={() => {}} />}
              className="create-bookshelf-button"
            />
          </div>

          <div className="bookshelves-container">
            {sortedBookshelves.length > 0 ? (
              sortedBookshelves.map((shelf) => (
                <div key={shelf.id} className="bookshelf-container">
                  <div className='shelf-name-and-edit'>
                    <h2>{shelf.name}</h2> 
                    <button onClick={() => navigate(`/bookshelves/${shelf.id}`)} className="reorder-button">Edit shelf</button>
                    <div className='shelf-delete-button'>
                      {/* Conditionally render the delete button */}
                        {shelf.id !== 1 && shelf.id !== 2 && shelf.id !== 3 && (
                          // <button 
                          //   onClick={() => handleDelete(shelf.id)} // open a modal to delete the bookshelf
                          //   className="shelf-delete-button"
                          // >
                          //   Delete shelf
                          // </button>
                          <OpenModalButton
                          buttonText="Delete"
                          modalComponent={<DeleteBookshelfModal bookshelfId={shelf.id}/>}
                          className="delete-modal"
                          />
                        )}
                      </div>
                  </div>
                  {/* <h2>{shelf.name}</h2>  */}
                  {/* <Link to={`/bookshelves/${shelf.id}`} className="reorder-button">
                    Edit or reorder books in shelf
                  </Link> */}
                  {/* <button onClick={() => navigate(`/bookshelves/${shelf.id}`)} className="reorder-button">Edit shelf</button> */}
                  <p>{shelf.description}</p>

                  <div className="books-container">
                    {shelf.Books && shelf.Books.length > 0 ? (
                      shelf.Books.map((book) => (
                        <div key={book.id} className="library-book-tile">
                          <Link to={`/books/${book.id}`}>
                            <img 
                              src={book.coverPicture || '../../images/Cover_coming_soon.jpeg'} 
                              alt={book.title} 
                              className="book-cover" 
                            />
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
        </>
      )}
    </div>
  );
}

export default YourLibrary
