import { csrfFetch } from './csrf';

// Action Types
const GET_BOOKCLUBS = 'bookclubs/GET_BOOKCLUBS';
const GET_BOOKCLUB = 'bookclubs/GET_BOOKCLUB';
const CREATE_BOOKCLUB = 'bookclubs/CREATE_BOOKCLUB';
const UPDATE_BOOKCLUB = 'bookclubs/UPDATE_BOOKCLUB';
const DELETE_BOOKCLUB = 'bookclubs/DELETE_BOOKCLUB';
const ADD_MEMBER_TO_BOOKCLUB = 'bookclubs/ADD_MEMBER_TO_BOOKCLUB';
const REMOVE_MEMBER_FROM_BOOKCLUB = 'bookclubs/REMOVE_MEMBER_FROM_BOOKCLUB';

// Action Creators
const getBookclubsAction = (bookclubs) => ({
  type: GET_BOOKCLUBS,
  payload: bookclubs,
});

const getBookclubAction = (bookclub) => ({
  type: GET_BOOKCLUB,
  payload: bookclub,
});

const createBookclubAction = (bookclub) => ({
  type: CREATE_BOOKCLUB,
  payload: bookclub,
});

const updateBookclubAction = (bookclub) => ({
  type: UPDATE_BOOKCLUB,
  payload: bookclub,
});

const deleteBookclubAction = (bookclubId) => ({
  type: DELETE_BOOKCLUB,
  payload: bookclubId,
});

const addMemberToBookclubAction = (member) => ({
  type: ADD_MEMBER_TO_BOOKCLUB,
  payload: member,
});

const removeMemberFromBookclubAction = (userId) => ({
  type: REMOVE_MEMBER_FROM_BOOKCLUB,
  payload: userId,
});

// Thunks
export const getBookclubs = () => async (dispatch) => {
  const response = await csrfFetch('/api/bookclubs/member');
  if (response.ok) {
    const data = await response.json();
    // Normalize the bookclubs by their ID
    const normalizedBookclubs = data.bookclubs.reduce((acc, bookclub) => {
      acc[bookclub.id] = bookclub;
      return acc;
    }, {});
    dispatch(getBookclubsAction(normalizedBookclubs));
  }
};

export const getBookclub = (bookclubId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getBookclubAction(data));
  }
};

export const createBookclub = (bookclubData) => async (dispatch) => {
  const response = await csrfFetch('/api/bookclubs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookclubData),
  });

  if (response.ok) {
    const newBookclub = await response.json();
    dispatch(createBookclubAction(newBookclub));
    return newBookclub;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const updateBookclub = (bookclubId, updatedData) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (response.ok) {
    const updatedBookclub = await response.json();
    dispatch(updateBookclubAction(updatedBookclub));
    return updatedBookclub;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const deleteBookclub = (bookclubId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteBookclubAction(bookclubId));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const addMemberToBookclub = (bookclubId, userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (response.ok) {
    const newMember = await response.json();
    dispatch(addMemberToBookclubAction(newMember));
    return newMember;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const removeMemberFromBookclub = (bookclubId, userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/members/${userId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeMemberFromBookclubAction(userId));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

// Initial State
const initialState = {
    bookclubs: {},
    currentBookclub: {},
    loading: false,
  };

  
// Reducer
const bookclubsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_BOOKCLUBS:
        return { ...state, bookclubs: { ...action.payload } };
  
      case GET_BOOKCLUB: {
        const newBookclubs = { ...state.bookclubs, [action.payload.id]: action.payload };
        return {
          ...state,
          currentBookclub: action.payload,
          bookclubs: newBookclubs,
        };
      }
  
      case CREATE_BOOKCLUB: {
        const newBookclubs = { ...state.bookclubs, [action.payload.id]: action.payload };
        return {
          ...state,
          bookclubs: newBookclubs,
          currentBookclub: action.payload,
        };
      }
  
      case UPDATE_BOOKCLUB: {
        const updatedBookclubs = {
          ...state.bookclubs,
          [action.payload.id]: action.payload,
        };
        return {
          ...state,
          bookclubs: updatedBookclubs,
          currentBookclub: action.payload,
        };
      }
  
      case DELETE_BOOKCLUB: {
        const updatedBookclubs = { ...state.bookclubs };
        delete updatedBookclubs[action.payload];
        return {
          ...state,
          bookclubs: updatedBookclubs,
          currentBookclub: state.currentBookclub.id === action.payload ? {} : state.currentBookclub,
        };
      }
  
      case ADD_MEMBER_TO_BOOKCLUB: {
        return {
          ...state,
          currentBookclub: {
            ...state.currentBookclub,
            members: [...state.currentBookclub.members, action.payload],
          },
        };
      }
  
      case REMOVE_MEMBER_FROM_BOOKCLUB: {
        return {
          ...state,
          currentBookclub: {
            ...state.currentBookclub,
            members: state.currentBookclub.members.filter(
              (member) => member.id !== action.payload
            ),
          },
        };
      }
  
      default:
        return state;
    }
  };
  
  export default bookclubsReducer;
  