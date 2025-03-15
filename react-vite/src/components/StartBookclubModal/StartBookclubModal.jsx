import './StartBookclubModal.css';
import { getBookclubs } from '../../redux/bookclubs';
import { useModal } from '../../context/Modal';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBookclub } from '../../redux/bookclubs';

function StartBookclubModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [bookSearch, setBookSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const handleBookSearch = async (e) => {
        const query = e.target.value;
        setBookSearch(query);
    
        if (query.length > 2) {
          // Fetch books from your backend API that match the search query
          const response = await fetch(`/api/books?search=${query}`);
          if (response.ok) {
            const data = await response.json();
            console.log("books from search: ", data)
            setSearchResults(data.books);  // Update search results with the response
          }
        } else {
          setSearchResults([]); // Clear results if the search query is too short
        }
    };

    const handleBookSelect = (book) => {
        setSelectedBook(book);
        setBookSearch(book.title);  // Display the selected book name in the search field
        setSearchResults([]);  // Clear the search results
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const bookId = selectedBook ? selectedBook.id : null;
    
        // Dispatch the createBookclub action with form data
        const newBookclub = { name, description, bookId };
        try {
            const newClub = await dispatch(createBookclub(newBookclub));  // Pass newBookclub to action
            console.log("Created bookclub: ", newClub);
            closeModal();  // Close the modal after submitting the form
            dispatch(getBookclubs());
        } catch (error) {
            console.error("Error creating bookclub: ", error);
        }
    };
    

    return (
        <div className="start-bookclub-modal">
          <h2>Start a Bookclub!</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Bookclub Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Search for a Book:</label>
              <input
                type="text"
                value={bookSearch}
                onChange={handleBookSearch}
                placeholder="Search for a book"
              />
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map((book) => (
                    <li key={book.id} onClick={() => handleBookSelect(book)}>
                      {book.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit">Create Bookclub</button>
          </form>
          <div>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
    );
}

export default StartBookclubModal
