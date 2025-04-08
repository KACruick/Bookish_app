import './EditBookshelfNameModal.css'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBookshelf } from '../../redux/bookshelves';
import { useModal } from '../../context/Modal'; 

function EditBookshelfNameModal({ bookshelfId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const bookshelf = useSelector(state => state.bookshelves.allBookshelves[bookshelfId]);
    const [newName, setNewName] = useState(bookshelf?.name || '');
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
    
        try {
          await dispatch(updateBookshelf(bookshelfId, { name: newName }));
          closeModal();
        } catch (err) {
          setErrors([err.message || 'Failed to update bookshelf']);
        }
      };
    
      const handleCancel = () => {
        closeModal();
      };

  return (
    <div className='modal-container'>
      <h1 className="modal-header">Change Bookshelf Name</h1>
      
      <form onSubmit={handleSubmit} className="modal-form">
        <label htmlFor="bookshelf-name">New Bookshelf Name:</label>
        <input
          id="bookshelf-name"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        
        {errors.length > 0 && (
          <ul className="errors">
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        )}

        <div className="action-buttons">
          <button type="submit" className='yes'>Submit</button>
          <button type="button" onClick={handleCancel} className='cancel'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default EditBookshelfNameModal
