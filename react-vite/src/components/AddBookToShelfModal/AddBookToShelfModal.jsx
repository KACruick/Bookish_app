import './AddBookToShelfModal.css'
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addBookToShelf } from "../../redux/bookshelves";
import { useModal } from '../../context/Modal'; 

function AddBookToShelfModal({ book }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const sessionUser = useSelector((state) => state.session.user);
    const bookshelves = useSelector((state) => Object.values(state.bookshelves.allBookshelves));
    
    // If bookshelves exist, filter them to get only the user's bookshelves
    // Memoize userBookshelves so that it only recalculates when bookshelves or sessionUser change
    const userBookshelves = useMemo(() => {
        return bookshelves.filter((shelf) => shelf.userId === sessionUser?.id);
    }, [bookshelves, sessionUser]);

    const [selectedShelfId, setSelectedShelfId] = useState("");

    const handleAddToShelf = async (e) => {
      e.preventDefault();
      if (!selectedShelfId) return;
  
      try {
        await dispatch(addBookToShelf(selectedShelfId, book.id));
        closeModal();
      } catch (err) {
        console.error("Failed to add book to shelf:", err);
      }
    };

  return (
    <div className="add-book-to-shelf-modal">
      <h2>Add "{book.title}" to a Bookshelf</h2>

      <form onSubmit={handleAddToShelf}>
        <label htmlFor="bookshelf">Select a Bookshelf:</label>
        <select
          id="bookshelf"
          value={selectedShelfId}
          onChange={(e) => setSelectedShelfId(e.target.value)}
        >
          <option value="" disabled>Select one</option>
          {userBookshelves.map((shelf) => (
            <option key={shelf.id} value={shelf.id}>
              {shelf.name}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button type="submit" disabled={!selectedShelfId}>Add Book</button>
        </div>
      </form>
    </div>
  )
}

export default AddBookToShelfModal
