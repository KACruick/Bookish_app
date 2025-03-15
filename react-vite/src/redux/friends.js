import { csrfFetch } from './csrf';

// Action Types
const GET_FRIENDS = 'friends/GET_FRIENDS';
const GET_PENDING_FRIEND_REQUESTS = 'friends/GET_PENDING_FRIEND_REQUESTS';
const SEND_FRIEND_REQUEST = 'friends/SEND_FRIEND_REQUEST';
const ACCEPT_FRIEND_REQUEST = 'friends/ACCEPT_FRIEND_REQUEST';
const REMOVE_FRIEND = 'friends/REMOVE_FRIEND';

// Action Creators
const getFriendsAction = (friends) => ({
  type: GET_FRIENDS,
  payload: friends,
});

const getPendingFriendRequestsAction = (requests) => ({
  type: GET_PENDING_FRIEND_REQUESTS,
  payload: requests,
});

const sendFriendRequestAction = (friend) => ({
  type: SEND_FRIEND_REQUEST,
  payload: friend,
});

const acceptFriendRequestAction = (friendId) => ({
  type: ACCEPT_FRIEND_REQUEST,
  payload: friendId,
});

const removeFriendAction = (friendId) => ({
  type: REMOVE_FRIEND,
  payload: friendId,
});

// Thunks
export const getFriends = () => async (dispatch) => {
  const response = await csrfFetch('/api/friends/');
  if (response.ok) {
    const data = await response.json();
    dispatch(getFriendsAction(data.friends));
  }
};

export const getPendingFriendRequests = () => async (dispatch) => {
  const response = await csrfFetch('/api/friends/requests');
  if (response.ok) {
    const data = await response.json();
    dispatch(getPendingFriendRequestsAction(data.requests));
  }
};

export const sendFriendRequest = (userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/friends/${userId}`, {
    method: 'POST',
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(sendFriendRequestAction(data));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const acceptFriendRequest = (userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/friends/${userId}/accept`, {
    method: 'PATCH',
  });

  if (response.ok) {
    await response.json();
    dispatch(acceptFriendRequestAction(userId));
  } else {
    const errorData = await response.json();
    throw errorData;
  }
};

export const removeFriend = (userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/friends/${userId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    await response.json();
    dispatch(removeFriendAction(userId));
  } else {
    const errorData = await response.json();
    throw errorData;
    }
};

// Initial State
const initialState = {
    friends: [],
    pendingFriendRequests: [],
    loading: false,
};
  
  // Reducer
const friendsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_FRIENDS:
        return {
          ...state,
          friends: action.payload,
        };
  
      case GET_PENDING_FRIEND_REQUESTS:
        return {
          ...state,
          pendingFriendRequests: action.payload,
        };
  
      case SEND_FRIEND_REQUEST:
        return {
          ...state,
          pendingFriendRequests: [...state.pendingFriendRequests, action.payload],
        };
  
      case ACCEPT_FRIEND_REQUEST: {
        const updatedFriends = [...state.friends, { id: action.payload }];
        const updatedRequests = state.pendingFriendRequests.filter(
          (request) => request.id !== action.payload 
        );
        return {
          ...state,
          friends: updatedFriends,
          pendingFriendRequests: updatedRequests,
        };
      }
  
      case REMOVE_FRIEND: {
        const updatedFriends = state.friends.filter(
          (friend) => friend.id !== action.payload
        );
        return {
          ...state,
          friends: updatedFriends,
        };
      }
  
      default:
        return state;
    }
    };
  
  export default friendsReducer;
  