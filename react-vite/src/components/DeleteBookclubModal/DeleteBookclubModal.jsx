import "./DeleteBookclubModal.css"
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteBookclub } from '../../redux/bookclubs';
import { useNavigate } from "react-router-dom";

function DeleteBookclubModal({ bookclubId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleDelete = async () => {
      console.log("Deleting bookclub: ", bookclubId);
      await dispatch(deleteBookclub(bookclubId));
      closeModal();
      navigate('/bookclubs/current'); // or wherever your user's bookclubs list is
    };
  
    const handleCancel = () => {
      closeModal();
    };

  return (
    <div className='modal-container'>

      <div className='delete-bookclub-headers'>
        <h1 className="delete-product-header">Confirm Delete</h1>
        <h4>Are you sure you want to delete this bookclub?</h4>
      </div>

      <div className="delete-bookclub-buttons">
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteBookclubModal
