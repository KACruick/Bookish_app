import "./BookshelfPage.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookshelfDetails, changeBookOrder } from "../../redux/bookshelves"; 
import { DndContext } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";


function BookshelfPage() {
    const { bookshelfId } = useParams(); // Get the bookshelfId from the URL
    // console.log('bookshelfId:', bookshelfId); // Log the bookshelfId
    const dispatch = useDispatch();
  
    const bookshelf = useSelector((state) => state.bookshelves.allBookshelves[bookshelfId]);
    const [books, setBooks] = useState([]);
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
      <h1>Bookshelf Page - Reorder Here</h1>
      <p>Click to reorder or change the shelf name here</p>

      <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove} coordinates={sortableKeyboardCoordinates}>
        <SortableContext items={books.map((book) => book.id)} strategy={verticalListSortingStrategy}>
          <div className="bookshelf-books-container">
            {books.length > 0 ? (
              books.map((book) => (
                <SortableItem key={book.id} id={book.id} book={book} />
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
        <p>Rating: {book.avgRating}</p>
        {/* <p>Order: {book.orderInShelf}</p> */}
      </div>
    </div>
  );
}

export default BookshelfPage
