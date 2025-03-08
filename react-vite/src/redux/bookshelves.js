import { csrfFetch } from './csrf';

// Action Types
const GET_BOOKSHELVES = 'bookshelves/GET_BOOKSHELVES';
const GET_BOOKSHELF_DETAILS = 'bookshelves/GET_BOOKSHELF_DETAILS';
const CREATE_BOOKSHELF = 'bookshelves/CREATE_BOOKSHELF';
const UPDATE_BOOKSHELF = 'bookshelves/UPDATE_BOOKSHELF';
const DELETE_BOOKSHELF = 'bookshelves/DELETE_BOOKSHELF';
const REMOVE_BOOK_FROM_SHELF = 'bookshelves/REMOVE_BOOK_FROM_SHELF';
const CHANGE_BOOK_ORDER = 'bookshelves/CHANGE_BOOK_ORDER';
const ADD_BOOK_TO_SHELF = 'bookshelves/ADD_BOOK_TO_SHELF';

// Action Creators
const getBookshelvesAction = (bookshelves) => ({
  type: GET_BOOKSHELVES,
  payload: bookshelves,
});

const getBookshelfDetailsAction = (bookshelf) => ({
  type: GET_BOOKSHELF_DETAILS,
  payload: bookshelf,
});

const createBookshelfAction = (bookshelf) => ({
  type: CREATE_BOOKSHELF,
  payload: bookshelf,
});

const updateBookshelfAction = (updatedBookshelf) => ({
  type: UPDATE_BOOKSHELF,
  payload: updatedBookshelf,
});

const deleteBookshelfAction = (bookshelfId) => ({
  type: DELETE_BOOKSHELF,
  payload: bookshelfId,
});

const removeBookFromShelfAction = (bookId) => ({
  type: REMOVE_BOOK_FROM_SHELF,
  payload: bookId,
});

const changeBookOrderAction = (bookOrder) => ({
  type: CHANGE_BOOK_ORDER,
  payload: bookOrder,
});

const addBookToShelfAction = (bookshelfId, bookId) => ({
  type: ADD_BOOK_TO_SHELF,
  payload: { bookshelfId, bookId },
});

// Thunks
export const getBookshelves = () => async (dispatch) => {
  // console.log("went into thunk action")
  const response = await csrfFetch('/api/bookshelves/current');
  if (response.ok) {
    const data = await response.json();
    // console.log("Fetched bookshelves:", data.bookshelves);

    // Normalize the bookshelves data (store them by ID)
    const normalizedBookshelves = data.bookshelves.reduce((acc, shelf) => {
      // Normalize bookshelf data
      acc[shelf.id] = {
        ...shelf,  // Copy the bookshelf details
        Books: shelf.Books || []  // Include books associated with the bookshelf
      };
      return acc;
    }, {});

    // Dispatch the action to the reducer with the normalized data
    dispatch(getBookshelvesAction(normalizedBookshelves));
  } else {
    console.error("Failed to fetch bookshelves:", response);
  }
};

export const getBookshelfDetails = (bookshelfId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/bookshelves/${bookshelfId}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched bookshelf details:', data);  // Log the data to check the API response
      dispatch(getBookshelfDetailsAction(data));
    } else {
      const errorData = await response.json();
      console.error('Error fetching bookshelf details:', errorData);  // Log the error if the response is not ok
    }
  } catch (error) {
    console.error('Error fetching bookshelf details:', error);  // Log any unexpected errors
  }
};

export const createBookshelf = (bookshelfData) => async (dispatch) => {
  const response = await csrfFetch('/api/bookshelves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookshelfData),
  });

  if (response.ok) {
    const newBookshelf = await response.json();
    dispatch(createBookshelfAction(newBookshelf));
    return newBookshelf;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const updateBookshelf = (bookshelfId, updatedData) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookshelves/${bookshelfId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (response.ok) {
    const updatedBookshelf = await response.json();
    dispatch(updateBookshelfAction(updatedBookshelf));
    return updatedBookshelf;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const removeBookFromShelf = (bookshelfId, bookId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookshelves/${bookshelfId}/books/${bookId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeBookFromShelfAction(bookId));
  } else {
    const error = await response.json();
    throw error;
  }
};

export const changeBookOrder = (bookshelfId, orderedBookIds) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/bookshelves/${bookshelfId}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderedBookIds }),
    });

    if (response.ok) {
      const updatedBooks = await response.json();
      dispatch({
        type: CHANGE_BOOK_ORDER,
        payload: {
          orderedBookIds: orderedBookIds, // Pass the ordered book IDs here
          bookshelfId,
        },
      });
    } else {
      const error = await response.json();
      console.error('Error updating book order:', error); // Log the error from the API
      throw new Error(error.message || 'Failed to update book order');
    }
  } catch (error) {
    console.error('Failed to change book order:', error); // Log any other errors
  }
};

export const addBookToShelf = (bookshelfId, bookId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookshelves/${bookshelfId}/books/${bookId}`, {
    method: 'POST',
  });

  if (response.ok) {
    dispatch(addBookToShelfAction(bookshelfId, bookId));
  } else {
    const error = await response.json();
    throw error;
  }
};

// Autogenerate the default bookshelves for a new user
export const createDefaultBookshelves = () => async (dispatch) => {
  const defaultBookshelves = ['Read', 'Reading', 'Want to Read'];
  for (const name of defaultBookshelves) {
    await dispatch(createBookshelf({ name }));
  }
};


// Initial State
const initialState = {
    allBookshelves: {},
    currentBookshelf: {},
  };
  
  // Reducer
  const bookshelvesReducer = (state = initialState, action) => {
    switch (action.type) {
      
      case GET_BOOKSHELVES:
        return { ...state, allBookshelves: action.payload };
  
      case GET_BOOKSHELF_DETAILS:
        return { ...state, currentBookshelf: action.payload };
  
      case CREATE_BOOKSHELF:
        return {
          ...state,
          allBookshelves: { ...state.allBookshelves, [action.payload.id]: action.payload },
        };
  
      case UPDATE_BOOKSHELF:
        return {
          ...state,
          allBookshelves: { ...state.allBookshelves, [action.payload.id]: action.payload },
        };
  
      case DELETE_BOOKSHELF:
        const newState = { ...state };
        delete newState.allBookshelves[action.payload];
        return newState;
  
      case REMOVE_BOOK_FROM_SHELF:
        const updatedBookshelf = { ...state.currentBookshelf };
        updatedBookshelf.books = updatedBookshelf.books.filter(
          (book) => book.id !== action.payload
        );
        return { ...state, currentBookshelf: updatedBookshelf };
  
      case CHANGE_BOOK_ORDER: {
        const { orderedBookIds, bookshelfId } = action.payload;
  
        console.log('Received orderedBookIds:', orderedBookIds); // Add this line
        console.log('Current bookshelf:', state.allBookshelves[bookshelfId]); // Add this line
      
        const updatedBookshelves = { ...state.allBookshelves };
        const bookshelf = updatedBookshelves[bookshelfId];

        if (bookshelf) {
          bookshelf.Books = bookshelf.Books.map((book) => {
            const newOrder = bookOrder.indexOf(book.id) + 1;  // Calculate new order
            return { ...book, orderInShelf: newOrder };
          });
          console.log('Updated bookshelf in reducer:', bookshelf); 
          return { ...state, allBookshelves: updatedBookshelves };
        }
        return state;
      }
  
      case ADD_BOOK_TO_SHELF:
        return {
          ...state,
          currentBookshelf: {
            ...state.currentBookshelf,
            books: [...state.currentBookshelf.books, action.payload],
          },
        };
  
      default:
        return state;
    }
  };
  
  export default bookshelvesReducer;
  