import './AddBookForm.css'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, updateBook, getBook, getBooks } from '../../redux/books';
import '../../../images/Cover_coming_soon.jpeg'

function AddBookForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bookId } = useParams();
    const user = useSelector((state) => state.session.user);
    const existingBook = useSelector((state) => state.books.bookDetails)
    const allBooks = useSelector((state) => state.books.books)

    console.log("allBooks: ", allBooks)
    console.log('bookId:', bookId);

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
        dispatch(getBooks());

        if (!user) {
            return navigate("/", {
                state: { error: "Please login to add a book" },
                replace: true
            });
        }

        if (isUpdate && bookId) {
            setLoading(true);  
            dispatch(getBook(bookId)).finally(() => {
                setLoading(false); 
            });
        } else {
            setLoading(false);
        }
    }, [dispatch, bookId, isUpdate, user, navigate])

    useEffect(() => {
        if (isUpdate && existingBook) {
            setTitle(existingBook.title || '');
            setAuthor(existingBook.author || '');
            setDescription(existingBook.description || '');
            setGenreId(existingBook.genreId || '');
            setIsbn(existingBook.isbn || '');
            setPages(existingBook.pages || '');
            setChapters(existingBook.chapters || '');
            setCoverPicture(existingBook.coverPicture || '');
            setYearPublished(existingBook.published || '');
        }
    }, [existingBook, isUpdate]);

    const validateFields = () => {
        const errors = {};
        const urlRegex = /(png|jpg|jpeg)/i; 

        if (!title) errors.title = "Title is required";
        if (!author) errors.author = "Author is required";
        if (!description || description.length < 30) errors.description = "Description must be at least 30 characters";
        if (!genreId) errors.genreId = "Please select a genre";

        // ISBN validation (12 or 13 digits)
        if (!isbn || !(isbn.toString().length === 12 || isbn.toString().length === 13)) {
            errors.isbn = "Please provide a valid ISBN (12 or 13 digits)";
        } else {
            // Check if the ISBN has changed (only validate if it's different from the original ISBN)
            const isIsbnChanged = isbn !== existingBook.isbn;
            if (isIsbnChanged) {
                // Check if the ISBN already exists in the database (excluding the current book if updating)
                const allBookValues = Object.values(allBooks); // Get the array of book objects from the object
                const isIsbnTaken = allBookValues.some((book) => book.isbn === isbn && book.id !== bookId);
                if (isIsbnTaken) {
                    errors.isbn = "The ISBN indicates that this book is already in our system";
                }
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
        const selectedGenre = e.target.value;  // keep as string, not converting to number
        setGenreId(selectedGenre);  // Set genreId as a string
    };

    // Handle file selection
    // const handleCoverPictureChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const fileUrl = URL.createObjectURL(file); // You can upload the file later, this creates a temporary URL
    //         setCoverPicture(fileUrl); // Update state with the new image URL
    //     }
    // };

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
        return errors[field] ? <div className="form-error-message">{errors[field]}</div> : null;
    };

    if (loading) {
        return <p>Loading form...</p>;
    }

  return (
    <div className='add-a-book-page'>
      {/* <h1>Add a Book to Bookish</h1> */}
        <div className="form-header">
                <h1>{isUpdate ? "Update the details for this book" : "Add a book to our database"}</h1>
        </div>

        <div className='add-book-form'>

            <form onSubmit={handleSubmit}>
                    <div className='label-and-input'>
                        <label>Title:</label> {renderError("title")}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className='label-and-input'>
                        <label>Author:</label> {renderError("author")}
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>

                    <div className='label-and-input'>
                        <label>Description:</label> {renderError("description")}
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className='label-and-input'>
                        <label>Genre:</label> {renderError("genreId")}
                        <select value={genreId} onChange={handleGenreChange}>
                        <option value="">Select Genre</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Romance">Romance</option>
                        <option value="Young Adult">Young Adult</option>
                        <option value="Children's">Children&apos;s</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Horror">Horror</option>
                        <option value="Historical Fiction">Historical Fiction</option>
                        <option value="Biography">Biography</option>
                        <option value="Self Help">Self Help</option>
                        <option value="Other">Other</option>
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

                    <div className='label-and-input'>
                        <label>ISBN:</label> {renderError("isbn")}
                        <input
                            type="text"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                        />
                    </div>

                    <div className='label-and-input'>
                        <label>Pages:</label> {renderError("pages")}
                        <input
                            type="number"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                        />
                    </div>

                    <div className='label-and-input'>
                        <label>Chapters:</label> {renderError("chapters")}
                        <input
                            type="number"
                            value={chapters}
                            onChange={(e) => setChapters(e.target.value)}
                        />
                    </div>

                    <div className='label-and-input'>
                        <label>Year Published:</label> {renderError("yearPublished")}
                        <input
                            type="number"
                            value={yearPublished}
                            onChange={(e) => setYearPublished(e.target.value)}
                        />
                    </div>

                    <div className='label-and-input'>
                        <label>Cover Picture Url:</label> {renderError("coverPicture")}
                        <input
                            type="text"
                            value={coverPicture}
                            onChange={(e) => setCoverPicture(e.target.value)}
                        />
                    </div>

                    <div className='add-book-button-div'>
                        <button className='add-book-button' type="submit">{isUpdate ? "Update Book" : "Add Book to Bookish"}</button>
                    </div>
                </form>

                <div className='form-book-cover-div'>
                    <h2 className='cover-preview-text'>Cover Preview</h2>
                    <img
                        src={coverPicture || existingBook.coverPicture || "../../../images/Cover_coming_soon.jpeg"}
                        alt={title}
                        className="form-book-cover"
                    />
                </div>

        </div>

    </div>
  )
}

export default AddBookForm
