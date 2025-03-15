import { csrfFetch } from './csrf';
import { getBook } from './books';

// Action Types
const GET_REVIEWS = 'reviews/GET_REVIEWS';
const GET_USER_REVIEWS = 'reviews/GET_USER_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// Action Creators
const getReviewsAction = (reviews) => ({
  type: GET_REVIEWS,
  payload: reviews,
});

const getUserReviewsAction = (reviews) => ({
  type: GET_USER_REVIEWS,
  payload: reviews,
});

const createReviewAction = (review) => ({
  type: CREATE_REVIEW,
  payload: review,
});

const updateReviewAction = (review) => ({
  type: UPDATE_REVIEW,
  payload: review,
});

const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

// Thunks
export const getReviews = (bookId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${bookId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getReviewsAction(data.Reviews));
  }
};

export const getUserReviews = () => async (dispatch) => {
  const response = await csrfFetch('/api/reviews/current');
  if (response.ok) {
    const data = await response.json();
    dispatch(getUserReviewsAction(data.Reviews));
  }
};

export const createReview = (bookId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(createReviewAction(newReview));
    return newReview;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const updateReview = (reviewId, updatedData) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (response.ok) {
    const updatedReview = await response.json();
    dispatch(updateReviewAction(updatedReview));
    return updatedReview;
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const deleteReview = (reviewId, bookId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteReviewAction(reviewId));
    // Refetch the updated book data, including the new avgRating
    dispatch(getBook(bookId)); 
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};


// Initial State
const initialState = {
    reviews: {},
    userReviews: {},
    // loading: false,
};
  

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS: {
      const reviewsByBook = action.payload.reduce((acc, review) => {
        acc[review.id] = review;
        return acc;
      }, {});
      return {
        ...state,
        reviews: reviewsByBook,
      };
    }

    case GET_USER_REVIEWS: {
      const userReviews = action.payload.reduce((acc, review) => {
        acc[review.id] = review;
        return acc;
      }, {});
      return {
        ...state,
        userReviews: userReviews,
      };
    }

    case CREATE_REVIEW: {
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.id]: action.payload,
        },
      };
    }

    case UPDATE_REVIEW: {
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.id]: action.payload,
        },
      };
    }

    case DELETE_REVIEW: {
      const newReviews = { ...state.reviews };
      delete newReviews[action.payload];
      return {
        ...state,
        reviews: newReviews,
      };
    }

    default:
      return state;
  }
};
  
  export default reviewsReducer;
  