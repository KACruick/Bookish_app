import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To access the search query from the URL
import axios from 'axios';
import './Discover.css'

function Discover() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // To get the current URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  // Fetch books when the component mounts or the search query changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/books', {
          params: { search: searchQuery, page: 1, size: 20 }, // Pass search query to the backend
        });
        setBooks(response.data.books);
      } catch (error) {
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchBooks();
    } else {
      // If there's no search query, you can fetch all books
      fetchBooks();
    }
  }, [searchQuery]); // This will run when searchQuery changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Discover Books</h1>
      {books.length === 0 ? (
        <p>No books found for "{searchQuery}"</p>
      ) : (
        <div className="books-list">
          {books.map((book) => (
            <div key={book.id} className="book-tile">
              <img src={book.coverPicture || '/default-book-cover.png'} alt={book.title} />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.genreId}</p>
                <p>{book.avgRating} / 5</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Discover
