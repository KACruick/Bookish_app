import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To access the search query from the URL
import './Discover.css'

function Discover() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total pages
  const location = useLocation(); // To get the current URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  const pageSize = 20; // Number of books per page

  // Fetch books when the component mounts or the search query changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const searchQueryEncoded = encodeURIComponent(searchQuery);
        const response = await fetch(`/api/books?search=${searchQueryEncoded}&page=${currentPage}&size=${pageSize}`);
        const data = await response.json();
        setBooks(data.books);
        setCurrentPage(data.page); // Update current page
        setTotalPages(data.totalPages); // Update total pages
      } catch (error) {
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks(); // Only call this once regardless of the searchQuery value
  }, [searchQuery, currentPage]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

    // Handle page change (next/previous)
    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };

    return (
      <div className="discover-page">
        {books.length === 0 ? (
          <p>No books found for &quot;{searchQuery}&quot;</p>
        ) : (
          <>
            <div className="discover-books-grid">
              {books.map((book) => (
                <div key={book.id} className="discover-book-tile">
                  <img
                    src={book.coverPicture || '/default-book-cover.png'}
                    alt={book.title}
                    className="discover-book-cover"
                  />
                  <div className="discover-book-info">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>{book.avgRating} / 5</p>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
}

export default Discover
