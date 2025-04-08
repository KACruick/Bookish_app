import "./DeleteBookclubModal"
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
      <h1 className="delete-product-header">Confirm Delete</h1>

      <div className='h4-container'>
        <h4>Are you sure you want to delete this bookclub?</h4>
      </div>

      <div className="action-buttons">
        <button onClick={handleDelete} className='yes'>Yes (Delete bookclub)</button>
        <button onClick={handleCancel} className='no'>No (Keep bookclub)</button>
      </div>
    </div>
  );
}

export default DeleteBookclubModal
