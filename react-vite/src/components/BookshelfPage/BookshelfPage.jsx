import "./BookshelfPage.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookshelfDetails, changeBookOrder, removeBookFromShelf } from "../../redux/bookshelves"; 
import { DndContext } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
// import OpenModalButton from "../OpenModalButton";
// import DeleteBookshelfModal from '../DeleteBookshelfModal';
// import EditBookshelfNameModal from "../EditBookshelfNameModal/EditBookshelfNameModal";


function BookshelfPage() {
    const { bookshelfId } = useParams(); // Get the bookshelfId from the URL
    // console.log('bookshelfId:', bookshelfId); // Log the bookshelfId
    const dispatch = useDispatch();
  
    const bookshelf = useSelector((state) => state.bookshelves.allBookshelves[bookshelfId]);
    const [books, setBooks] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [transform, setTransform] = useState({ x: 0, y: 0 });
    console.log(transform)
    
    useEffect(() => {
      dispatch(getBookshelfDetails(bookshelfId));
    }, [dispatch, bookshelfId]);
  
    useEffect(() => {
      if (bookshelf && bookshelf.Books) {
        const sortedBooks = bookshelf.Books.sort((a, b) => a.orderInShelf - b.orderInShelf);
        setBooks(sortedBooks);
        console.log('Books:', bookshelf.Books); 
      }
    }, [bookshelf]);

    // Handle book selection
    const handleSelectBook = (bookId) => {
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.includes(bookId)
      ? prevSelectedBooks.filter((id) => id !== bookId)  // Deselect if already selected
      : [...prevSelectedBooks, bookId]  // Select if not selected
        );
    };

    // Handle delete selected books
    const handleDeleteSelectedBooks = async () => {
      try {
          for (const bookId of selectedBooks) {
              await dispatch(removeBookFromShelf(bookshelfId, bookId));
          }
          // Trigger a fresh fetch of bookshelf details after deletion
          await dispatch(getBookshelfDetails(bookshelfId));
          setSelectedBooks([]); // Clear selected books after deletion
      } catch (err) {
          console.error("Error in deleting selected books:", err);
      }
  };
  

    // Handle drag end
    const handleDragEnd = (event) => {
        const { active, over } = event;

        // If the item is dropped outside or in the same position, do nothing
        if (!over || active.id === over.id) {
        return;
        }

        // Reorder the books array
        const oldIndex = books.findIndex((book) => book.id === active.id);
        const newIndex = books.findIndex((book) => book.id === over.id);

        const reorderedBooks = arrayMove(books, oldIndex, newIndex);

        // Create the ordered book IDs list
        const orderedBookIds = reorderedBooks.map((book) => book.id);
        console.log('Dispatching changeBookOrder action with orderedBookIds:', orderedBookIds);

        // Update the book order in the store
        dispatch(changeBookOrder(bookshelfId, orderedBookIds));
        // and trigger a fresh fetch of bookshelf details for the book order number displayed
        dispatch(getBookshelfDetails(bookshelfId));
        // Update local state to reflect the new order
        setBooks(reorderedBooks);
    };

    const handleDragMove = (event) => {
        const { delta } = event;
        
        const newX = Math.max(0, Math.min(window.innerWidth - 100, delta.x));  // Constrain the X position
        const newY = Math.max(0, Math.min(window.innerHeight - 100, delta.y)); // Constrain the Y position
        
        // Set the constrained values
        setTransform({
          x: newX,
          y: newY,
        });
    };


  return (
    <div>
      <div className="shelf-name-and-delete">
        <h1>{bookshelf.name}</h1>

        {/* <div className="change-shelf-name">
          {bookshelfId !== 1 && bookshelfId !== 2 && bookshelfId !== 3 && (
            <OpenModalButton
            buttonText="Change Name"
            modalComponent={<EditBookshelfNameModal bookshelfId={bookshelfId}/>}
            className="delete-modal"
            />
          )}
        </div> */}

        <div className='shelf-delete-button'>
          <button 
            className="delete-books-button"
            onClick={handleDeleteSelectedBooks}
            >
            Remove Books
          </button>
        </div>

      </div>

      {/* <p>Change shelf order here</p> */}

      <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove} coordinates={sortableKeyboardCoordinates}>
        <SortableContext items={books.map((book) => book.id)} strategy={verticalListSortingStrategy}>
          <div className="bookshelf-books-container">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book.id} className="shelf-book-tile">
                  <SortableItem id={book.id} book={book} />
                    <input 
                      type="checkbox" 
                      checked={selectedBooks.includes(book.id)} 
                      onChange={() => handleSelectBook(book.id)} 
                      className="book-checkbox"
                      />
                </div>
              ))
            ) : (
              <p>No books in this shelf.</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Sortable Item Component
function SortableItem({ id, book }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
        transition: transition || 'transform 200ms ease', // Ensure smooth transition
      }}
      {...attributes}
      {...listeners}
      className="shelf-book-tile"
    >
      <img
        src={book.coverPicture || "/path/to/placeholder-image.jpg"}
        alt={book.title}
        className="shelf-book-cover"
      />
      <div className="shelf-book-details">
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        {/* <p>Rating: {book.avgRating}</p> */}
        {/* <p>Order: {book.orderInShelf}</p> */}
      </div>
    </div>
  );
}

export default BookshelfPage
