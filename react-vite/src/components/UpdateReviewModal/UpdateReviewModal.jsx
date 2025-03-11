import "./UpdateReviewModal.css"
import './UpdateReviewModal.css'
import { IoMdStar } from "react-icons/io";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getBook } from '../../redux/books';
import { getReviews, getUserReviews, updateReview } from '../../redux/reviews';



function UpdateReviewModal({ initialReview, initialRating, reviewId, bookId, pageType }) {

  const dispatch = useDispatch();

  const [rating, setRating] = useState(initialRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(initialReview || '');
  
  const { closeModal } = useModal();

  const currentUser = useSelector((state) => state.session.user);
  
  useSelector((state) => state.books.bookDetails); 
  
      // Autofill the review and rating
      useEffect(() => {
          setReview(initialReview);
          setRating(initialRating);
      }, [initialReview, initialRating]);
  
      // Helper function to render stars
      const fillStars = () => {
          return [0, 1, 2, 3, 4].map((index) => (
              <IoMdStar
              key={index}
              className={index < (hoverRating || rating) ? 'filled-star' : 'empty-star'}
              onClick={() => setRating(index + 1)} // Update rating on click
              onMouseEnter={() => setHoverRating(index + 1)} // Update hover state
              onMouseLeave={() => setHoverRating(0)} // Reset hover state
              aria-label={`Rate ${index + 1} star`}
              />
          ));
      }
  
  
      const handleSubmit = async (e) => {
          e.preventDefault();
          // console.log("Updating review...");
          try {
            const updatedReviewData = {
              review,
              rating,
              userId: currentUser.id,
              firstName: currentUser.firstName, 
              lastName: currentUser.lastName, 
              username: currentUser.username,
              profilePicture: currentUser.profilePicture
            };
            // Dispatch update review action
            await dispatch(updateReview(reviewId, updatedReviewData));
  
            // Conditionally dispatch based on the pageType
            if (pageType === "manage") {
              await dispatch(getUserReviews());  // Fetch reviews by user for the ManageReviews page
            } else if (pageType === "book") {
              await dispatch(getReviews(bookId));  // Fetch reviews by bookId for the BookPage
              await dispatch(getBook(bookId));  // Optionally, update the book details
            }
  
            console.log("Review updated successfully");
            closeModal(); 
  
          } catch (error) {
            console.error("Failed to update review:", error.message);
          }
      };

      const handleCancel = async (e) => {
        e.preventDefault();
        closeModal();
      }

  return (
    <div>
      <h1>Update your review</h1>

      <div className='textarea-div'>
        <textarea 
          value={review}
          className='text'
          placeholder="Leave your review here..."
          onChange={(e) => setReview(e.target.value)}
          >
        </textarea>
      </div>

      <div className='set-stars-div'>
          {fillStars()}
      </div>

      <div className="button-div">
        <button className='submit-review-button' type="submit" onClick={handleSubmit} disabled={!review || rating === 0}>
          Update
        </button>

        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default UpdateReviewModal
