import './AddBookForm.css'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, updateBook, getBook } from '../../redux/books';

function AddBookForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bookId } = useParams();
    const user = useSelector((state) => state.session.user);
    const existingBook = useSelector((state) => state.books.getBook)
    const allBooks = useSelector((state) => state.books.allBooks)

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [genreId, setGenreId] = useState('');
    const [isbn, setIsbn] = useState('');
    const [pages, setPages] = useState('');
    const [chapters, setChapters] = useState('');
    const [coverPicture, setCoverPicture] = useState('');
    const [yearPublished, setYearPublished] = useState('');

    const isUpdate = !!bookId;

    useEffect(() => {
        setErrors({});

        if (!user) {
            return navigate("/", {
                state: { error: "Please login to add a book" },
                replace: true
            });
        }

        if (isUpdate && bookId) {
            dispatch(getBook(bookId).finally(() => {
                setLoading(false)
            }))
        } else {
            setLoading(false)
        }
    }, [dispatch, bookId, isUpdate, user, navigate])

    useEffect(() => {
        if (isUpdate && existingBook) {
            setTitle(existingBook.title || '');
            setAuthor(existingBook.author || '');
            setDescription(existingBook.description || '');
            setGenreId(existingBook.genreId || 0);
            setIsbn(existingBook.isbn || '');
            setPages(existingBook.pages || '');
            setChapters(existingBook.chapters || '');
            setCoverPicture(existingBook.coverPicture || '');
            setYearPublished(existingBook.yearPublished || '');
        }
    }, [existingBook, isUpdate]);

    const validateFields = () => {
        const errors = {};
        const urlRegex = /(png|jpg|jpeg)/i; 

        if (!title) errors.title = "Title is required";
        if (!author) errors.author = "Author is required";
        if (!description || description.length < 30) errors.description = "Description must be at least 30 characters";
        if (!genreId || genreId === 0) errors.genreId = "Please select a genre";
        // ISBN validation (12 or 13 digits)
        if (!isbn || !(isbn.toString().length === 12 || isbn.toString().length === 13)) {
            errors.isbn = "Please provide a valid ISBN (12 or 13 digits)";
        } else {
            // Check if the ISBN already exists in the database (excluding the current book if updating)
            const isIsbnTaken = allBooks.some((book) => book.isbn === isbn && (!isUpdate || book.id !== bookId));
            if (isIsbnTaken) {
                errors.isbn = "This ISBN is already taken by another book.";
            }
        }
        if (!pages || isNaN(pages) || pages <= 0) errors.pages = "Pages must be a positive number";
        if (!chapters || isNaN(chapters) || chapters <= 0) errors.chapters = "Chapters must be a positive number";
        if (!coverPicture) {
            errors.coverPicture = "Cover picture URL is required";
        } else if (!urlRegex.test(coverPicture)) {
            errors.coverPicture = "coverPicture URL must contain .png, .jpg, or .jpeg";
            }
        if (!yearPublished || isNaN(yearPublished) || yearPublished <= 0) errors.yearPublished = "Please provide a valid year";

        return errors;
    };

    const handleGenreChange = (e) => {
        const selectedGenre = Number(e.target.value);
        if (selectedGenre === 11) {
            setGenreId(null);  // "Other" means no genre selected
        } else {
            setGenreId(selectedGenre);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const bookData = {
            title,
            author,
            description,
            genreId,
            isbn,
            pages,
            chapters,
            coverPicture,
            yearPublished,
        };

        try {
            if (isUpdate) {
                const updatedBook = await dispatch(updateBook(bookId, bookData));
                console.log("updatedBook: ", updatedBook)
                navigate(`/books/${bookId}`);
            } else {
                const addedBook = await dispatch(createBook(bookData));
                navigate(`/books/${addedBook.id}`); // Redirect to the newly added book's page
            }
        } catch (error) {
            console.error("Error adding/updating book:", error);
        }
    };

    const renderError = (field) => {
        return errors[field] ? <div className="error-message">{errors[field]}</div> : null;
    };

    if (loading) {
        return <p>Loading form...</p>;
    }

  return (
    <div className='add-a-book-page'>
      {/* <h1>Add a Book to Bookish</h1> */}
        <div className="header">
                <h1>{isUpdate ? "Update the details for this book" : "Add a Book to Bookish"}</h1>
        </div>

        <div className='add-book-form'>

            <form onSubmit={handleSubmit}>
            <div>
                        <label>Title:</label> {renderError("title")}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Author:</label> {renderError("author")}
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Description:</label> {renderError("description")}
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Genre:</label> {renderError("genreId")}
                        <select value={genreId} onChange={handleGenreChange}>
                            <option value={0}>Select Genre</option>
                            {/* Add genre options dynamically or hardcoded */}
                            <option value={1}>Fantasy</option>
                            <option value={2}>Science Fiction</option>
                            <option value={3}>Romance</option>
                            <option value={4}>Young Adult</option>
                            <option value={5}>Children&apos;s</option>
                            <option value={6}>Mystery</option>
                            <option value={7}>Horror</option>
                            <option value={8}>Historical Fiction</option>
                            <option value={9}>Biography</option>
                            <option value={10}>Self Help</option>
                            <option value={11}>Other</option>
                        </select>
                    </div>

                    {/* <div>
                        <label>Genre:</label> {renderError("genreId")}
                        <select value={genreId} onChange={(e) => setGenreId(Number(e.target.value))}>
                            <option value={0}>Select Genre</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div>
                        <label>ISBN:</label> {renderError("isbn")}
                        <input
                            type="text"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Pages:</label> {renderError("pages")}
                        <input
                            type="number"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Chapters:</label> {renderError("chapters")}
                        <input
                            type="number"
                            value={chapters}
                            onChange={(e) => setChapters(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Year Published:</label> {renderError("yearPublished")}
                        <input
                            type="number"
                            value={yearPublished}
                            onChange={(e) => setYearPublished(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Cover Picture:</label> {renderError("coverPicture")}
                        <input
                            type="text"
                            value={coverPicture}
                            onChange={(e) => setCoverPicture(e.target.value)}
                        />
                    </div>

                    <button type="submit">{isUpdate ? "Update Book" : "Add Book to Bookish"}</button>
                </form>

        </div>

    </div>
  )
}

export default AddBookForm
