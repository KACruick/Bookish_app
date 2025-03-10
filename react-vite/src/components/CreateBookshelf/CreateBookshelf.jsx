import './CreateBookshelf.css'
import { useModal } from '../../context/Modal';
import { createBookshelf, getBookshelfDetails } from '../../redux/bookshelves';

function CreateBookshelf() {

    const { closeModal } = useModal();
    // const dispatch = useDispatch();

    const handleCreate = async () => {
        console.log(reviewId)
    try {
    //   await dispatch(createBookshelf());
      closeModal();
      // Refetch bookshelf
    //   dispatch(getBookshelfDetails); 
    } catch (error) {
      console.error("Failed to delete review:", error.message);
    }
    }

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
