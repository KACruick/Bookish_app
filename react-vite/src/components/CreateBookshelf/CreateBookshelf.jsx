import './CreateBookshelf.css'
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
import { createBookshelf, getBookshelfDetails } from '../../redux/bookshelves';

function CreateBookshelf() {

    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const [bookshelfName, setBookshelfName] = useState("");

    const handleCreate = async () => {
        if (!bookshelfName) {
            alert("Bookshelf name is required");
            return;
          }
        
          const newBookshelf = {
            name: bookshelfName,  // Ensure this is the correct key that the backend expects
          };
        
        try {
            // Dispatch action to create a new bookshelf, passing the bookshelfName
            await dispatch(createBookshelf(newBookshelf));
            closeModal();
            // Refetch bookshelf details
            dispatch(getBookshelfDetails(newBookshelf.id));
        } catch (error) {
            console.error("Failed to create bookshelf:", error.message);
        }
    };

    const handleCancel = async () => {
        closeModal();
    }

    return (
        <div>
            <h1>Create a new bookshelf</h1>

            <label>
                Bookshelf Name:
                <input
                type="text"
                value={bookshelfName}
                onChange={(e) => setBookshelfName(e.target.value)}
                />
            </label>

            <div className="action-buttons">
                <button onClick={handleCreate} className='create-bookshelf'>Create</button>
                <button onClick={handleCancel} className='cancel-bookshlef'>Cancel</button>
            </div>
        
        </div>
    )
}

export default CreateBookshelf
