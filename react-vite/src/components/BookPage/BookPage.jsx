import "./BookPage.css"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBook } from "../../redux/books";
import { getReviews } from "../../redux/reviews";
import { getBookshelves, addBookToShelf } from "../../redux/bookshelves"
import ReviewModal from "../ReviewModal";
import OpenModalButton from "../OpenModalButton";
import UpdateReviewModal from "../UpdateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import { IoMdStar } from "react-icons/io";
import DeleteBookModal from '../DeleteBookModal';
import AddBookToShelfModal from "../AddBookToShelfModal";
// import '../../../dist/images/profile-icons/'


function BookPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookshelves = useSelector((state) => state.bookshelves.allBookshelves);
  const currentUserId = useSelector((state) => state.session.user?.id);

  // const [isRead, setIsRead] = useState(false);  // Track if the user has marked the book as read
  // const [rating, setRating] = useState(0);  // Track the user's rating
  // console.log("rating", rating);
  // Fetch book details from Redux store
  const book = useSelector((state) => state.books.bookDetails); 
  const reviews = useSelector((state) => Object.values(state.reviews)) || [];

  const reviewList = Array.isArray(reviews) && reviews[0] ? Object.values(reviews[0]) : [];
  const userReview = currentUserId
  ? reviewList.find((review) => review.userId === currentUserId)
  : null;

  // console.log("userReview: ", userReview)
  // console.log("book: ", book)
  // console.log("reviewList: ", reviewList)
  
  // Get reviews and ratings
  const avgRating = book?.avgRating || 0;
  const chapters = book?.chapters || 0;
  const pages = book?.pages || 0;
  const genre = book?.genreId;
  
  // console.log(reviewList[0].user?.profilePicture)

  // Dispatch the action to get the book details if it's not already fetched
  useEffect(() => {
    dispatch(getBook(bookId));
    dispatch(getReviews(bookId));
    dispatch(getBookshelves());
  }, [dispatch, bookId]);


  const renderStars = (ratingValue) => {
    const filledStars = Math.floor(ratingValue);
    const emptyStars = 5 - filledStars;
  
    return (
      <div className="star-rating">
        {/* Render filled stars */}
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className="filled-star">★</span>
        ))}
        {/* Render empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="empty-star">★</span>
        ))}
      </div>
    );
  };

    // Find user's "Currently Reading" and "Read" shelves
  const currentlyReadingShelf = Object.values(bookshelves).find(
    (shelf) => shelf.name === "Currently reading"
  );
  const readShelf = Object.values(bookshelves).find(
    (shelf) => shelf.name === "Read"
  );

  console.log("currently reading: ", currentlyReadingShelf)
  console.log("read: ", readShelf)

  // Check if the current book is in either shelf
  const isCurrentlyReading = currentlyReadingShelf?.Books?.some((b) => b.id === book.id);
  const isRead = readShelf?.Books?.some((b) => b.id === book.id);

  console.log("isCurrentlyReading? ", isCurrentlyReading)
  console.log("isRead? ", isRead)

  // Decide status message
  let readingStatusMessage = "You have not read this book yet.";
  if (isRead) {
    readingStatusMessage = "You have read this book.";
  } else if (isCurrentlyReading) {
    readingStatusMessage = "You are currently reading this book.";
  }


  // Make sure book is defined before rendering
  if (!book) {
    return <div>Loading...</div>;
  }
  if (!reviews) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className="book-page">
      {/* <h1>Book page</h1> */}

      <div className="book-left-div">
        <div className="book-cover">
          {/* Book cover image */}
          <img
            src={book?.coverPicture || "/images/cover_coming_soon.jpeg"} // Use placeholder if coverPicture is missing
            alt={book?.title || "Book cover"}
            onError={(e) => e.target.src = "/images/cover_coming_soon.jpeg"} // Fallback to placeholder if image fails to load
          />
        </div>

        <div className="want-rating-div">
            {/* "Want to Read" or "Read" Button */}
          {/* <button className="want-to-read" onClick={handleReadButton}>
            Add to a Bookshelf
          </button> */}
          <div className="add-to-shelf-button">
          <OpenModalButton
            buttonText="Add to a Bookshelf"
            modalComponent={<AddBookToShelfModal book={book}/>}
            />
          </div>

          {/* Conditional "Edit" button */}
          {currentUserId && currentUserId === book.userId && (
            <button 
            className="book-page-edit-book-button" 
            onClick={() => navigate(`/books/${book.id}/edit`)}>
              Edit Book
            </button>
            
          )}

          {/* Conditional "Delete" button */}
          <div className="book-page-delete-book-modal-button">
            {currentUserId && currentUserId === book.userId && (
              <OpenModalButton
              className="book-page-delete-book-modal-button"
              buttonText="Delete"
              modalComponent={<DeleteBookModal book={book} isFromBookPage={true} />}
              />
            )}
          </div>

          {/* User rating stars */}
          {/* <div className="user-rating">
            {rating === 0 ? renderStars(0) : renderStars(rating)}
          </div> */}
        </div>

        {/* <div>
            <OpenModalButton
            buttonText="Add to a Bookshelf"
            modalComponent={<AddBookToShelfModal book={book}/>}
            />
        </div> */}

        <div className="has-read-or">
          <p>{readingStatusMessage}</p>
        </div>

      </div>

      <div className="book-right-div">
        <div className="book-info">

          <div className="book-title">
            <h2>{book?.title}</h2>
          </div>

          <div className="book-author">
            <p>{book?.author}</p>
          </div>

          <div className="avgRating-section">
            {/* Display avg rating */}
            <div>{renderStars(avgRating)}</div>
            <div className="avg-rating-value">{avgRating.toFixed(2)} Average Rating</div>
          </div>

          <div className="book-summary">
            <p>{book?.description}</p>
          </div>

          <div className="genre">
            <p><strong>Genre:</strong> {genre}</p>
          </div>

          <div className="pages">
            <p><strong>Pages:</strong> {pages}</p>
          </div>

          <div className="chapters">
            <p><strong>Chapters:</strong> {chapters}</p>
          </div>

          <div className="published">
            <p><strong>Published:</strong> {book?.published}</p>
          </div>

          <div className="isbn">
            <p><strong>ISBN:</strong> {book?.isbn}</p>
          </div>

        </div>

        



        {/* Ratings and Reviews Section */}
        <div className="reviews-section">
          <h2>Ratings & Reviews</h2>
          <div className="avg-rating-div">
            <div>{renderStars(avgRating)}</div>
            <div>{avgRating.toFixed(2)}</div>
            <div>{reviewList.length} Reviews</div>
          </div>

          {/* Conditionally render the "Leave a Review" button */}
          {!userReview && currentUserId && (
            <div className="leave-review-div">
              <OpenModalButton
                buttonText="Leave a Review"
                modalComponent={<ReviewModal bookId={bookId} />}
                className="leave-review-button"
              />
            </div>
          )}

          {/* Map through reviews */}
          {reviewList.length > 0 ? (
            reviewList
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((review) => (
              <div key={review.id} className="review-tiles">
                <div className="review-info">

                  <div className="user-info">
                    {review.user?.profilePicture ? (
                      <img
                        src={`/images/profile-icons/${review.user.profilePicture}`}
                        alt={`${review.user.firstName}'s profile`}
                        className="user-profile-picture"
                      />
                      // <img src="/images/profile-icons/chicken.png" className="user-profile-picture"/>
                      // <img src='../../../public/images/profile-icons/chicken-icon.png' className="user-profile-picture"/>
                    ) : (
                      <div className="no-profile-picture">No Profile Picture</div>
                    )}
                    <p>{review.user?.firstName}</p>
                  </div>

                  <div className="user-book-rating-div">
                    <div className="individual-rating">{review.rating.toFixed(1)}</div> {/* Rating */}
                    <div><IoMdStar /> </div>
                  </div>

                  {/* Render the formatted date */}
                  <p className="review-date">
                    {/* Format the date as "Month Year" */}
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                

                <div className="review-content">
                    <p>{review.review}</p> {/* Review text */}
          

                  {/* Check if the logged-in user is the same as the user who left the review */}
                  {review.userId === currentUserId && (
                    <div className="update-delete-div">
                      {/* Update Button */}
                      <OpenModalButton
                        buttonText="Update"
                        modalComponent={
                          <UpdateReviewModal 
                            reviewId={review.id} 
                            initialReview={review.review} 
                            initialRating={review.rating} 
                            pageType={book}
                            bookId={bookId}
                          />
                        }
                        className='update-modal'
                      /> 
                      
                      {/* Delete Button */}
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} bookId={bookId}/>}
                        className="delete-modal"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p>No reviews yet.</p>
        )}



        </div>
      </div>


    </div>
  );
}

export default BookPage;

