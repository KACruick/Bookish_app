const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    // console.log("Signup Response Status:", response.status); // Debug log

    if(response.ok) {
      const data = await response.json();
      // console.log("data: ", data)
      dispatch(setUser(data));
    } else {
      const errorMessages = await response.json();
      // Debug log
      // console.log("Signup Error Response:", {
      //   status: response.status,
      //   errorMessages
      // });
      return errorMessages;
    }
  } catch (error) {
    // Debug log
    // console.error("Signup Error Details:", {
    //   name: error.name,
    //   message: error.message,
    //   stack: error.stack
    // });
    
    // If it's a response error, try to parse it
    if (error.json) {
      try {
        const errorData = await error.json();
        console.log("Error Response Data:", errorData); // Debug log
        return errorData;
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
    }

    // return { 
    //   errors: {
    //     email: "Email already exists"  // Default error for duplicate email
    //   }
    // };
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;
