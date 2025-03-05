import './YourBookclubs.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookclubs } from '../../redux/bookclubs';
import { Link } from 'react-router-dom'; 

function YourBookclubs() {
 
    const dispatch = useDispatch();
    
      useEffect(() => {
        dispatch(getBookclubs()); // Fetch all bookclubs the user is a member of
      }, [dispatch]);
    
      const bookclubs = useSelector(state => state.bookclubs.bookclubs);
      const userId = useSelector(state => state.session.user.id);
    
      // Filter bookclubs: those where the user is the owner (moderator) and those where the user is just a member
      const moderatedBookclubs = Object.values(bookclubs).filter(bookclub => bookclub.ownerId === userId);
      const memberBookclubs = Object.values(bookclubs).filter(bookclub => bookclub.ownerId !== userId);
    
      // console.log("bookclub.book.coverPicture: ", bookclub.book.coverPicture)
    
      return (
        <div>
            <h1>Bookclub Page</h1>
    
            {/* Bookclubs the user moderates */}
          <div className="bookclub-container">
            <h2>Bookclubs you moderate</h2>
            {moderatedBookclubs.length > 0 ? (
              <div className="bookclub-list">
                {moderatedBookclubs.map((bookclub) => (
                  <Link to={`/bookclubs/${bookclub.id}`} key={bookclub.id} className="bookclub-tile">
                  {/* Render book cover image */}
                  {bookclub.book && bookclub.book.coverPicture && (
                    <img
                      src={bookclub.book.coverPicture}
                      alt={bookclub.book.title}
                      className="bookcover-image"
                    />
                  )}
                  <h3>{bookclub.name}</h3>
                  <p>{bookclub.description}</p>
                </Link>
                ))}
              </div>
            ) : (
              <p>No moderated bookclubs.</p>
            )}
          </div>
    
          {/* Bookclubs the user is a member of */}
          <div className="bookclub-container">
            <h2>Other Bookclubs your are in</h2>
            {memberBookclubs.length > 0 ? (
              <div className="bookclub-list">
                {memberBookclubs.map((bookclub) => (
                  <div key={bookclub.id} className="bookclub-tile">
                    <Link to={`/bookclubs/${bookclub.id}`} key={bookclub.id} className="bookclub-tile">
                    {/* Render book cover image */}
                    {bookclub.book && bookclub.book.coverPicture && (
                      <img
                        src={bookclub.book.coverPicture}
                        alt={bookclub.book.title}
                        className="bookcover-image"
                      />
                    )}
                    <h3>{bookclub.name}</h3>
                    <p>{bookclub.description}</p>
                    </Link>
        
                  </div>
                ))}
              </div>
            ) : (
              <p>No bookclubs found.</p>
            )}
          </div>
    
        </div>
      
  )
}

export default YourBookclubs
