import './DeleteBookModal.css'
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteBook, getBooks } from '../../redux/books';
import { useNavigate } from "react-router-dom";

function DeleteBookModal({ book, isFromBookPage }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleDelete = async () => {
      if (isFromBookPage) {
        // Redirect to homepage if deletion is from BookPage
        await dispatch(deleteBook(book.id));
        closeModal(); 
        navigate('/');
      } else {
        await dispatch(deleteBook(book.id)); // Deletes the book
        closeModal(); // Close the modal after deletion
        dispatch(getBooks());
      }
    };
  
    const handleCancel = async () => {
      closeModal();
    }

  return (
    <div className='modal-container'>
      <h1 className="delete-product-header">Confirm Delete</h1>
      
      <div className='h4-container'>
        <h4>Are you sure you want to remove this book from Bookish?</h4>
      </div>

      
      <div className="action-buttons">
        <button onClick={handleDelete} className='yes'>Yes (Delete Book)</button>
        <button onClick={handleCancel} className='no'>No (Keep Book)</button>
      </div>
    </div>
  )
}

export default DeleteBookModal
