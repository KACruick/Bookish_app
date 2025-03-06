import { csrfFetch } from './csrf';

// Actions
const GET_BOOKS = 'books/GET_BOOKS';
const GET_BOOK = 'books/GET_BOOK';
const CREATE_BOOK = 'books/CREATE_BOOK';
const UPDATE_BOOK = 'books/UPDATE_BOOK';
const DELETE_BOOK = 'books/DELETE_BOOK';

// Action Creators
const getBooksAction = (books) => ({
  type: GET_BOOKS,
  payload: books,
});

const getBookAction = (book) => ({
  type: GET_BOOK,
  payload: book,
});

const createBookAction = (book) => ({
  type: CREATE_BOOK,
  payload: book,
});

const updateBookAction = (book) => ({
  type: UPDATE_BOOK,
  payload: book,
});

const deleteBookAction = (bookId) => ({
  type: DELETE_BOOK,
  payload: bookId,
});

// Thunks
export const getBooks = () => async (dispatch) => {
  const response = await csrfFetch('/api/books');
  if (response.ok) {
    const data = await response.json();
    console.log("Fetched books:", data.books);
    // Normalize the books by their ID
    const normalizedBooks = data.books.reduce((acc, book) => {
      acc[book.id] = book;
      return acc;
    }, {});
    dispatch(getBooksAction(normalizedBooks));
  }
};

export const getBook = (bookId) => async (dispatch) => {
  const response = await csrfFetch(`/api/books/${bookId}`);
  if (response.ok) {
      const data = await response.json();
      dispatch(getBookAction(data));
      return data;  // Return the data so that you can chain the promise
  }
};

export const createBook = (bookData) => async (dispatch) => {
  const response = await csrfFetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });

  if (response.ok) {
    const newBook = await response.json();
    dispatch(createBookAction(newBook));
    return newBook;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const updateBook = (bookId, updatedData) => async (dispatch) => {
  const response = await csrfFetch(`/api/books/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (response.ok) {
    const updatedBook = await response.json();
    dispatch(updateBookAction(updatedBook));
    return updatedBook;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const deleteBook = (bookId) => async (dispatch) => {
  const response = await csrfFetch(`/api/books/${bookId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteBookAction(bookId));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

// Initial State
const initialState = {
  books: {},
  bookDetails: {},
};

// Reducer
const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOKS:
      return { ...state, books: { ...action.payload } };

    case GET_BOOK: {
      const newBooks = { ...state.books, [action.payload.id]: action.payload };
      return {
        ...state,
        bookDetails: action.payload,
        books: newBooks,
      };
    }

    case CREATE_BOOK: {
      const newBooks = { ...state.books, [action.payload.id]: action.payload };
      return {
        ...state,
        books: newBooks,
        bookDetails: action.payload,
      };
    }

    case UPDATE_BOOK: {
      return {
        ...state,
        books: {
          ...state.books,
          [action.payload.id]: action.payload,
        },
        bookDetails: action.payload,
      };
    }

    case DELETE_BOOK: {
      const newBooks = { ...state.books };
      delete newBooks[action.payload];
      return {
        ...state,
        books: newBooks,
        bookDetails: state.bookDetails.id === action.payload ? {} : state.bookDetails,
      };
    }

    default:
      return state;
  }
};

export default booksReducer;
