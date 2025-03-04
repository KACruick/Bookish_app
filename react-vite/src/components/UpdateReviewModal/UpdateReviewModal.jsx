import "./UpdateReviewModal.css"
import './UpdateReviewModal.css'
import { IoMdStar } from "react-icons/io";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getBook } from '../../redux/books';
import { createReview, getReviews, getUserReviews, updateReview } from '../../redux/reviews';

const dispatch = useDispatch();
const [rating, setRating] = useState(initialRating || 0);
const [hoverRating, setHoverRating] = useState(0);
const [review, setReview] = useState(initialReview || '');

const { closeModal } = useModal();

const book = useSelector(state => state.books.getBook[bookId]);

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
          // Dispatch update review action
          await dispatch(updateReview(reviewId, { review, rating }));

          // Conditionally dispatch based on the pageType
          if (pageType === "manage") {
            await dispatch(fetchReviewsByUser());  // Fetch reviews by user for the ManageReviews page
          } else if (pageType === "book") {
            await dispatch(fetchReviews(spotId)); // Fetch reviews by spotId for the SpotPage
            await dispatch(getBook(book.id)); 
          }

          console.log("Review updated successfully");
          closeModal(); 

        } catch (error) {
          console.error("Failed to update review:", error.message);
        }
    };

function UpdateReviewModal({ initialReview, initialRating, reviewId, bookId, pageType }) {
  return (
    <div>
      
    </div>
  )
}

export default UpdateReviewModal
