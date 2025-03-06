import './DeleteBookModal.css'
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteBook } from '../../redux/books';

function DeleteBookModal({ book }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
  
    const handleDelete = async () => {
      await dispatch(deleteBook(book.id)); // Deletes the spot
      closeModal(); // Close the modal after deletion
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
