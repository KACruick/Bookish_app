import './YourBookclubs.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookclubs } from '../../redux/bookclubs';
import { Link } from 'react-router-dom'; 
import { useModal } from '../../context/Modal';
import StartBookclubModal from '../StartBookclubModal';


function YourBookclubs() {
 
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    
      useEffect(() => {
        dispatch(getBookclubs()); // Fetch all bookclubs the user is a member of
      }, [dispatch]);
    
      const bookclubs = useSelector(state => state.bookclubs.bookclubs);
      const userId = useSelector(state => state.session.user?.id);
    
      // Filter bookclubs: those where the user is the owner (moderator) and those where the user is just a member
      const moderatedBookclubs = Object.values(bookclubs).filter(bookclub => bookclub.ownerId === userId);
      const memberBookclubs = Object.values(bookclubs).filter(bookclub => bookclub.ownerId !== userId);
      console.log("moderatedBookclubs: ", moderatedBookclubs)
      // console.log("bookclub.book.coverPicture: ", bookclub.book.coverPicture)

      const openStartBookclubModal = () => {
        setModalContent(<StartBookclubModal/>)
      }
    
      return (
        <div>
          {/* If no user is logged in, show a message to encourage login */}
          {!userId ? (
            <div className="no-login-message">
              <p className='not-logged-in'>Log in to start using Bookish bookclubs feature!</p>
            </div>
          ) : (
            <>
              {/* Bookclub creation option */}
              <div className='start-club-div'>
                <button className='start-club-button' onClick={openStartBookclubModal}>Start a new bookclub</button>
              </div>
    
              <div className="bookclub-container">
                {/* Bookclubs the user moderates */}
                <div className='moderate'>
                  <h2>Bookclubs you moderate</h2>
                  {moderatedBookclubs.length > 0 ? (
                    <div className="your-bookclub-list">
                      {moderatedBookclubs.map((bookclub) => (
                        <div className='your-bookclub-tile' key={bookclub.id}>
                          <Link to={`/bookclubs/${bookclub.id}`} key={bookclub.id}>
                            {/* Render book cover image */}
                            {bookclub.book && bookclub.book.coverPicture && (
                              <img
                                src={bookclub.book.coverPicture}
                                alt={bookclub.book.title}
                                className="club-bookcover-image"
                              />
                            )}
                            <h3>{bookclub.name}</h3>
                            <p>{bookclub.description}</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No moderated bookclubs.</p>
                  )}
                </div>
    
                {/* Bookclubs the user is a member of */}
                <div className='member'>
                  <h2>Your other bookclubs</h2>
                  {memberBookclubs.length > 0 ? (
                    <div className="your-bookclub-list">
                      {memberBookclubs.map((bookclub) => (
                        <div className='your-bookclub-tile' key={bookclub.id}>
                          <Link to={`/bookclubs/${bookclub.id}`} key={bookclub.id}>
                            {/* Render book cover image */}
                            {bookclub.book && bookclub.book.coverPicture && (
                              <img
                                src={bookclub.book.coverPicture}
                                alt={bookclub.book.title}
                                className="club-bookcover-image"
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
            </>
          )}
        </div>
      );
}

export default YourBookclubs
