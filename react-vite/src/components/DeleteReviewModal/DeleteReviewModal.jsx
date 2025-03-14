import "./DeleteReviewModal.css"
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { getReviews, deleteReview } from "../../redux/reviews";
import { getBook } from "../../redux/books";

function DeleteReviewModal({ reviewId, bookId }) {

    const { closeModal } = useModal();
  const dispatch = useDispatch();

    const handleDelete = async () => {
        console.log(reviewId)
        try {
        await dispatch(deleteReview(reviewId));
        closeModal();
        // Refetch reviews and spot details
        dispatch(getReviews(bookId)); // Refetch reviews
        dispatch(getBook(bookId));   // Refetch book details
        } catch (error) {
        console.error("Failed to delete review:", error.message);
        }
    };

    const handleCancel = async (e) => {
      e.preventDefault();
      closeModal();
    };

  return (
    <div>
        {/* <h1>Delete Review</h1> */}
        <div className='modal-container'>
        <h1>Confirm Delete</h1>
      
        <div className='h4-container'>
            <h4>Are you sure you want to delete this review?</h4>
        </div>

      
        <div className="action-buttons">
            <button onClick={handleDelete} className='yes'>Yes (Delete Review)</button>
            <button onClick={handleCancel} className='no'>No (Keep Review)</button>
        </div>
        </div>

    </div>
  )
}

export default DeleteReviewModal
