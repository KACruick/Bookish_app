import "./BookPage.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBook } from "../../redux/books";
import { getReviews } from "../../redux/reviews";
import { getBookshelves, addBookToShelf } from "../../redux/bookshelves"
import ReviewModal from "../ReviewModal";
import OpenModalButton from "../OpenModalButton";
import UpdateReviewModal from "../UpdateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import { IoMdStar } from "react-icons/io";
// import '../../../dist/images/profile-icons/'


function BookPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const bookshelves = useSelector((state) => state.bookshelves.allBookshelves);
  const currentUserId = useSelector((state) => state.session.user.id);

  const [isRead, setIsRead] = useState(false);  // Track if the user has marked the book as read
  const [rating, setRating] = useState(0);  // Track the user's rating

  // Fetch book details from Redux store
  const book = useSelector((state) => state.books.bookDetails); 
  const reviews = useSelector((state) => Object.values(state.reviews)) || [];
  // Handle the case where the reviews array has the unexpected structure
  const reviewList = Array.isArray(reviews) && reviews[0] ? Object.values(reviews[0]) : [];
  const userReview = reviewList.find((review) => review.userId === currentUserId);
  console.log("userReview: ", userReview)
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
    dispatch(getReviews(bookId));
    dispatch(getBookshelves());
  }, [dispatch, bookId]);

  const handleReadButton = async () => {
    const currentlyReadingBookshelf = Object.values(bookshelves).find(
      (shelf) => shelf.name === "Currently reading"
    );
    
    console.log()
    if (currentlyReadingBookshelf) {
      try {
        // Add the book to the "Currently Reading" bookshelf
        await dispatch(addBookToShelf(currentlyReadingBookshelf.id, book.id));
        setIsRead(true);  // Update button text to "Mark as Unread"
      } catch (error) {
        console.error("Error adding book to bookshelf:", error);
      }
    } else {
      console.error("Currently Reading bookshelf not found.");
    }
  };


  // Function to handle star rating (setRating)
  // const handleRating = (newRating) => {
  //   setRating(newRating);
  //   // Dispatch action to update the user's rating for this book
  // };

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


  const currentlyReadingBookshelf = Object.values(bookshelves).find(
    (shelf) => shelf.name === "Currently Reading"
  );
  
  // const currentlyReadingBookshelfId = currentlyReadingBookshelf ? currentlyReadingBookshelf.id : null;
  
  

  // const handleUpdateReview = (reviewId) => {
  //   // Logic to show an update form or navigate to a page where the user can update their review
  //   console.log("Update review with id:", reviewId);
  // };

  // console.log("reviewList: ", reviewList)
  // console.log("reviewList[0]: ", reviewList[0])
  // console.log("reviewList[0].user.profilePicture: ", reviewList[0].user.profilePicture)
  // console.log("profile pic src: ", `../../../dist/images/profile-icons/${reviewList[0].user.profilePicture}`)

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

        <div className="want-rating-div">
            {/* "Want to Read" or "Read" Button */}
          <button className="want-to-read" onClick={handleReadButton}>
            {isRead ? "Mark as Unread" : "Want to Read"}
          </button>

          {/* User rating stars */}
          {/* <div className="user-rating">
            {rating === 0 ? renderStars(0) : renderStars(rating)}
          </div> */}
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
          {!userReview && (
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
                          />
                        }
                        className='update-modal'
                      /> 
                      
                      {/* Delete Button */}
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} />}
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

