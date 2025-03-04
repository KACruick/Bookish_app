import "./BookPage.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBook } from "../../redux/books";
import { getReviews } from "../../redux/reviews";

function BookPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch();

  const [isRead, setIsRead] = useState(false);  // Track if the user has marked the book as read
  const [rating, setRating] = useState(0);  // Track the user's rating

  // Fetch book details from Redux store
  const book = useSelector((state) => state.books.bookDetails); 
  const reviews = useSelector((state) => Object.values(state.reviews)) || [];
  // Handle the case where the reviews array has the unexpected structure
  const reviewList = Array.isArray(reviews) && reviews[0] ? Object.values(reviews[0]) : [];
  console.log("book: ", book)
  console.log("reviewList: ", reviewList)
  
  // Get reviews and ratings
  const avgRating = book?.avgRating || 0;
  const chapters = book?.chapters || 0;
  const pages = book?.pages || 0;
  const genre = book?.genreId;
  
  // console.log(reviewList[0].user?.profilePicture)

  // Dispatch the action to get the book details if it's not already fetched
  useEffect(() => {
    dispatch(getBook(bookId));
    dispatch(getReviews(bookId))
  }, [dispatch, bookId]);

  // Handle "Want to Read" or "Mark as Read" button
  const handleReadButton = () => {
    setIsRead(!isRead);
    // Add logic to update the user's status, e.g., dispatch a thunk to mark it as read
  };

  // Function to handle star rating (setRating)
  const handleRating = (newRating) => {
    setRating(newRating);
    // Dispatch action to update the user's rating for this book
  };

  // Render the stars based on the rating (gold stars for rating)
  const renderStars = (ratingValue) => {
    const filledStars = Math.floor(ratingValue);
    const emptyStars = 5 - filledStars;
    return (
      <div className="star-rating">
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className="filled-star">★</span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="empty-star">★</span>
        ))}
      </div>
    );
  };

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
          {book?.coverPicture ? (
            <img src={book.coverPicture} alt={book.title} />
          ) : (
            <div>No cover available</div>
          )}
        </div>

        {/* "Want to Read" or "Read" Button */}
        <button onClick={handleReadButton}>
          {isRead ? "Mark as Unread" : "Want to Read"}
        </button>

        {/* User rating stars */}
        <div className="user-rating">
          {renderStars(rating)} {/* Display stars based on rating */}
        </div>
      </div>

      <div className="book-right-div">
        <div className="book-title">
          <h3>{book?.title}</h3>
        </div>

        <div className="book-author">
          <p>{book?.author}</p>
        </div>

        <div className="avgRating-section">
          {/* Display avg rating */}
          <div>{renderStars(avgRating)}</div>
          <div className="avg-rating-value">{avgRating.toFixed(2)}</div>
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

        {/* Ratings and Reviews Section */}
        <div className="reviews-section">
          <h2>Ratings & Reviews</h2>
          <div className="avg-rating-div">
            <div>{renderStars(avgRating)}</div>
            <div>{avgRating.toFixed(2)}</div>
            <div>{reviewList.length} Reviews</div>
          </div>

          {/* Button to Leave a Review */}
          <button className="leave-review-btn">Leave a Review</button>

          {/* Map through reviews */}
          {reviewList.length > 0 ? (
            reviewList.map((review) => (
              <div key={review.id} className="review-tiles">
                <div className="user-info">
                  
                  {/* {review.user?.profilePicture ? (
                    <img
                      src={review.user.profilePicture}
                      alt={`${review.user.firstName}'s profile`}
                      className="user-profile-picture"
                    />
                  ) : (
                    <div className="no-profile-picture">No Profile Picture</div>
                  )} */}
                  <p>{review.user?.firstName}</p>
                </div>

                <div className="review-content">
                  <p>{review.review}</p> {/* Review text */}
                  <div className="rating">{review.rating}</div> {/* Rating */}
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

