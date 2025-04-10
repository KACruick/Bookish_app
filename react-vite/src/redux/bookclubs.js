import { csrfFetch } from './csrf';

// Action Types
const GET_BOOKCLUBS = 'bookclubs/GET_BOOKCLUBS';
const GET_BOOKCLUB = 'bookclubs/GET_BOOKCLUB';
const CREATE_BOOKCLUB = 'bookclubs/CREATE_BOOKCLUB';
const UPDATE_BOOKCLUB = 'bookclubs/UPDATE_BOOKCLUB';
const CHANGE_BOOK = 'bookclubs/CHANGE_BOOK';
const DELETE_BOOKCLUB = 'bookclubs/DELETE_BOOKCLUB';
const ADD_MEMBER_TO_BOOKCLUB = 'bookclubs/ADD_MEMBER_TO_BOOKCLUB';
const REMOVE_MEMBER_FROM_BOOKCLUB = 'bookclubs/REMOVE_MEMBER_FROM_BOOKCLUB';
const GET_COMMENTS = 'bookclubs/GET_COMMENTS';
const ADD_COMMENT = 'bookclubs/ADD_COMMENT';
const EDIT_COMMENT = 'bookclubs/EDIT_COMMENT';
const DELETE_COMMENT = 'bookclubs/DELETE_COMMENT';
const CLEAR_COMMENTS = 'bookclubs/CLEAR_COMMENTS';

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

const changeBookAction = (bookclub) => ({
  type: CHANGE_BOOK,
  payload: bookclub
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

const getCommentsAction = (comments) => ({
  type: GET_COMMENTS,
  payload: comments,
});

const addCommentAction = (comment) => ({
  type: ADD_COMMENT,
  payload: comment,
});

const editCommentAction = (chapterId, commentId, updatedComment) => ({
  type: EDIT_COMMENT,
  payload: { chapterId, commentId, updatedComment },
});

const deleteCommentAction = (chapterId, commentId) => ({
  type: DELETE_COMMENT,
  payload: { chapterId, commentId },
});

const clearCommentsAction = (bookclubId) => ({
  type: CLEAR_COMMENTS,
  payload: bookclubId,
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
  console.log("inside createbookclub action")
  const response = await csrfFetch('/api/bookclubs/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookclubData),
  });
  console.log("response: ", response)
  if (response.ok) {
    console.log("response is OK")
    const newBookclub = await response.json();
    dispatch(createBookclubAction(newBookclub));
    console.log("after dispatch (createBookclubAction(newBookclub)")
    // Fetch the updated list of book clubs
    dispatch(getBookclubs());
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

export const changeBook = (bookclubId, bookId) => async (dispatch) => {
  // console.log("gone into change book thunk")
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/change-book`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId })
  });
  // console.log("response: ", response.json())
  if (response.ok) {
    const updatedBookclub = await response.json();
    // console.log("Sending PATCH request to: ", `/api/bookclubs/${bookclubId}/change-book`);
    dispatch(changeBookAction(updatedBookclub));
    dispatch(getBookclub(bookclubId)); // Re-fetch full data including new book and chapters
    return updatedBookclub;
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

export const addMemberToBookclub = (bookclubId, friendId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ friendId }),
  });
  console.log("response: ", response)
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

export const getChapterComments = (bookclubId, chapterId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/${chapterId}/comments`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getCommentsAction({ chapterId, comments: data.comments }));  // Pass both chapterId and comments
  } else {
    const errorData = await response.json();
    throw errorData;  // Handle errors
  }
};

export const addChapterComment = (bookclubId, chapterId, commentText) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/${chapterId}/comments`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: commentText }),
  });

  if (response.ok) {
      const data = await response.json();
      dispatch(addCommentAction({ chapterId, comment: data.comment })); // Dispatch with chapterId and comment
      return response; // Return the response for further handling
  } else {
      const errorData = await response.json();
      throw errorData;
  }
};

export const editComment = (bookclubId, chapterId, commentId, newCommentText) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/${chapterId}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment: newCommentText }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(editCommentAction(chapterId, commentId, data.comment));
    return data.comment;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const deleteComment = (bookclubId, chapterId, commentId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/${chapterId}/comments/${commentId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteCommentAction(chapterId, commentId));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const clearComments = (bookclubId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookclubs/${bookclubId}/clear-comments`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(clearCommentsAction(bookclubId));
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
        console.log('GET_BOOKCLUBS action payload:', action.payload);
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
        console.log('CREATE_BOOKCLUB payload:', action.payload);
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

      case CHANGE_BOOK:
      return {
        ...state,
        currentBookclub: {
          ...state.currentBookclub,
          bookId: action.payload.bookId 
        }
      };
  
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

      case GET_COMMENTS: {
        return {
          ...state,
          currentBookclub: {
            ...state.currentBookclub,
            chapterComments: {
              ...state.currentBookclub.chapterComments,
              [action.payload.chapterId]: action.payload.comments,
            },
          },
        };
      }

      case ADD_COMMENT: {
        const { chapterId, comment } = action.payload;
      
        return {
          ...state,
          currentBookclub: {
            ...state.currentBookclub,
            chapterComments: {
              ...state.currentBookclub.chapterComments,
              [chapterId]: [
                ...(state.currentBookclub.chapterComments?.[chapterId] || []),
                comment,
              ],
            },
          },
        };
      }

      case CLEAR_COMMENTS: {
        return {
          ...state,
          currentBookclub: {
            ...state.currentBookclub,
            chapterComments: {},
          },
        };
      }
  
      case EDIT_COMMENT: {
        const { chapterId, commentId, updatedComment } = action.payload;
        const updatedComments = state.currentBookclub.chapterComments[chapterId].map((comment) =>
          comment.id === commentId ? updatedComment : comment
        );
  
        return {
          ...state,
          currentBookclub: {
            ...state.currentBookclub,
            chapterComments: {
              ...state.currentBookclub.chapterComments,
              [chapterId]: updatedComments,
            },
          },
        };
      }
  
      case DELETE_COMMENT: {
        const { chapterId, commentId } = action.payload;
        const updatedComments = state.currentBookclub.chapterComments[chapterId].filter(
          (comment) => comment.id !== commentId
        );
  
        return {
          ...state,
          currentBookclub: {
            ...state.currentBookclub,
            chapterComments: {
              ...state.currentBookclub.chapterComments,
              [chapterId]: updatedComments,
            },
          },
        };
      }
  
      default:
        return state;
    }
  };
  
  export default bookclubsReducer;
  