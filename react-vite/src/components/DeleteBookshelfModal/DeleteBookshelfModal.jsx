import React from 'react'
import "./DeleteBookshelfModal.css"
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteBookshelf } from '../../redux/bookshelves'
import { useNavigate } from "react-router-dom";

function DeleteBookshelfModal({ bookshelfId }) {
      const { closeModal } = useModal();
      const dispatch = useDispatch();
      const navigate = useNavigate();
    
      const handleDelete = async () => {
        // Redirect to homepage if deletion is from BookPage
        await dispatch(deleteBookshelf(bookshelfId)); //delete bookshelf
        closeModal(); 
        navigate('/bookshelves/current'); 
      };
    
      const handleCancel = async () => {
        closeModal();
      }
  return (
    <div className='modal-container'>
      <h1 className="delete-product-header">Confirm Delete</h1>
      
      <div className='h4-container'>
        <h4>Are you sure you want to delete this bookshelf?</h4>
      </div>

      
      <div className="action-buttons">
        <button onClick={handleDelete} className='yes'>Yes (Delete shelf)</button>
        <button onClick={handleCancel} className='no'>No (Keep shelf)</button>
      </div>
    </div>
  )
}

export default DeleteBookshelfModal
