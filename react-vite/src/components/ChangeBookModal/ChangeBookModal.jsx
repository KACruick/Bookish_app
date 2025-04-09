import "./ChangeBookModal.css"
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { changeBook, getBookclub } from '../../redux/bookclubs'; 

function ChangeBookModal({ bookclubId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [bookSearch, setBookSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    console.log("bookclubId: ", bookclubId)

    const handleBookSearch = async (e) => {
        const query = e.target.value;
        setBookSearch(query);
    
        if (query.length > 2) {
          const response = await fetch(`/api/books?search=${query}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.books);
          }
        } else {
          setSearchResults([]);
        }
    };

    const handleBookSelect = (book) => {
        setSelectedBook(book);
        setBookSearch(book.title);
        setSearchResults([]);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBook) return;
    
        try {
          await dispatch(changeBook(bookclubId, selectedBook.id));
          await dispatch(getBookclub(bookclubId)); // Refetch the updated bookclub
          closeModal();
        } catch (error) {
          console.error("Failed to change book:", error);
        }
    };

  return (
    <div className="modal-container">

      <div className="change-book-headers">
        <h1>Finished with your book?</h1>
        <h2>Select a new one!</h2>
      </div>

      <div className="change-book-warning">
      <p className="warning-text">Warning: all chapter comments will be lost after selecting a new book.</p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          
          {/* <label>Search for a new book:</label> */}

          <div className="search-container">
            <div className="label-andsearch">
              <label>Search for a new book:</label>
              <input
                type="text"
                value={bookSearch}
                onChange={handleBookSearch}
                placeholder="Search for a book"
              />
            </div>

            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((book) => (
                  <li key={book.id} onClick={() => handleBookSelect(book)}>
                    {book.title} by {book.author}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="change-book-buttons">
            <button type="submit" disabled={!selectedBook}>Change Book</button>
            <button onClick={closeModal}>Cancel</button>
          </div>

        </form>
      </div>
      
    </div>
  );
}

export default ChangeBookModal
