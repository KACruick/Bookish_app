import { csrfFetch } from './csrf';

// Action Types
const GET_COMMUNITY_ACTIVITY = 'community/GET_COMMUNITY_ACTIVITY';
const LIKE_FRIEND_POST = 'community/LIKE_FRIEND_POST';
const COMMENT_ON_FRIEND_POST = 'community/COMMENT_ON_FRIEND_POST';
const UPDATE_COMMENT = 'community/UPDATE_COMMENT';
const DELETE_COMMENT = 'community/DELETE_COMMENT';

// Action Creators
const getCommunityActivityAction = (posts) => ({
  type: GET_COMMUNITY_ACTIVITY,
  payload: posts,
});

const likeFriendPostAction = (postId) => ({
  type: LIKE_FRIEND_POST,
  payload: postId,
});

const commentOnFriendPostAction = (comment) => ({
  type: COMMENT_ON_FRIEND_POST,
  payload: comment,
});

const updateCommentAction = (comment) => ({
  type: UPDATE_COMMENT,
  payload: comment,
});

const deleteCommentAction = (commentId) => ({
  type: DELETE_COMMENT,
  payload: commentId,
});

// Thunks
export const getCommunityActivity = (page = 1, size = 20) => async (dispatch) => {
  const response = await csrfFetch(`/api/community?page=${page}&size=${size}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getCommunityActivityAction(data['Community Posts']));
  }
};

export const likeFriendPost = (postId) => async (dispatch) => {
  const response = await csrfFetch(`/api/community/${postId}/like`, {
    method: 'POST',
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(likeFriendPostAction(postId));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const commentOnFriendPost = (postId, commentText) => async (dispatch) => {
  const response = await csrfFetch(`/api/community/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ comment: commentText }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(commentOnFriendPostAction(data));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const updateComment = (postId, commentId, commentText) => async (dispatch) => {
  const response = await csrfFetch(`/api/community/${postId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ comment: commentText }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateCommentAction(data));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  const response = await csrfFetch(`/api/community/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteCommentAction(commentId));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

// Initial State
const initialState = {
    communityPosts: [],
    loading: false,
};
  
// Reducer
const communityReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_COMMUNITY_ACTIVITY:
        return {
          ...state,
          communityPosts: action.payload,
        };
  
      case LIKE_FRIEND_POST:
        return {
          ...state,
          communityPosts: state.communityPosts.map((post) =>
            post.id === action.payload
              ? { ...post, liked: true } // Add or update the post with the "liked" status
              : post
          ),
        };
  
      case COMMENT_ON_FRIEND_POST:
        return {
          ...state,
          communityPosts: state.communityPosts.map((post) =>
            post.id === action.payload.postId
              ? { ...post, comments: [...post.comments, action.payload] }
              : post
          ),
        };
  
      case UPDATE_COMMENT:
        return {
          ...state,
          communityPosts: state.communityPosts.map((post) =>
            post.id === action.payload.postId
              ? {
                  ...post,
                  comments: post.comments.map((comment) =>
                    comment.id === action.payload.id ? action.payload : comment
                  ),
                }
              : post
          ),
        };
  
      case DELETE_COMMENT:
        return {
          ...state,
          communityPosts: state.communityPosts.map((post) =>
            post.id === action.payload
              ? {
                  ...post,
                  comments: post.comments.filter((comment) => comment.id !== action.payload),
                }
              : post
          ),
        };
  
      default:
        return state;
    }
  };
  
  export default communityReducer;
  