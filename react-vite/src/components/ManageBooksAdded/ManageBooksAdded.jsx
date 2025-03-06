import './ManageBooksAdded.css'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getBooks } from '../../redux/books'

function ManageBooksAdded() {
    const dispatch = useDispatch();
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
                        <div key={book.id} className="book-tile">
                            <img
                                src={book.coverPicture || "default-cover.jpg"} // Add a fallback image if there's no cover
                                alt={book.title}
                                className="book-cover"
                            />
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.yearPublished}</p>
                            <button>Delete</button>
                            <button>Edit</button>
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
