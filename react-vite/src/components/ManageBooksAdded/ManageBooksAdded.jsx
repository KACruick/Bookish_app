import './ManageBooksAdded.css'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { getBooks } from '../../redux/books'
import OpenModalButton from '../OpenModalButton';
import DeleteBookModal from '../DeleteBookModal';

function ManageBooksAdded() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.session.user);
    const allBooks = useSelector((state) => state.books.books)
    console.log("allBooks", allBooks)

    useEffect(() => {
        if (!Object.keys(allBooks).length) {
            dispatch(getBooks()); 
        }
    }, [dispatch, allBooks]);

    // Filter books added by the current user
    const userBooks = Object.values(allBooks).filter(book => book.userId === user.id);

    return (
        <div className="manage-books-added">
            <h1>Manage Books you added to Bookish</h1>

            {userBooks.length > 0 ? (
                <div className="books-tile-container">
                    {userBooks.map((book) => (
                        <div key={book.id} className="manage-book-tile">
                            <img
                                src={book.coverPicture || "default-cover.jpg"} // Add a fallback image if there's no cover
                                alt={book.title}
                                className="book-cover"
                            />
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.yearPublished}</p>
                            {/* <button>Delete</button>
                            <button>Edit</button> */}

                            <div className="book-actions">
                            {/* Update button that redirects to the edit page */}
                            <button
                                className="edit-book-link"
                                onClick={() => navigate(`/books/${book.id}/edit`)}
                            >
                                Edit
                            </button>

                            {/* Delete button that opens a modal */}
                            <OpenModalButton
                                className="delete-book-modal-button"
                                buttonText="Delete"
                                modalComponent={<DeleteBookModal book={book} />}
                            />
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <p>You have not added any books yet.</p>
            )}
        </div>
    )
}

export default ManageBooksAdded
