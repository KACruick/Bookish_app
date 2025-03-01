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
  const response = await csrfFetch('/api/bookshelves');
  if (response.ok) {
    const data = await response.json();
    const normalizedBookshelves = data.bookshelves.reduce((acc, shelf) => {
      acc[shelf.id] = shelf;
      return acc;
    }, {});
    dispatch(getBookshelvesAction(normalizedBookshelves));
  }
};

export const getBookshelfDetails = (bookshelfId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookshelves/${bookshelfId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getBookshelfDetailsAction(data));
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

export const changeBookOrder = (bookshelfId, bookOrder) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookshelves/${bookshelfId}/update-order`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ books: bookOrder }),
  });

  if (response.ok) {
    dispatch(changeBookOrderAction(bookOrder));
  } else {
    const error = await response.json();
    throw error;
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
  
      case CHANGE_BOOK_ORDER:
        return { ...state, currentBookshelf: { ...state.currentBookshelf, bookOrder: action.payload } };
  
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
  