import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import booksReducer from "./books";
import reviewsReducer from "./reviews";
import bookshelvesReducer from "./bookshelves";
import bookclubsReducer from "./bookclubs";
import friendsReducer from "./friends";
import communityReducer from "./community";

const rootReducer = combineReducers({
  session: sessionReducer,
  books: booksReducer,
  reviews: reviewsReducer,
  bookshelves: bookshelvesReducer,
  bookclubs: bookclubsReducer,
  friends: friendsReducer,
  community: communityReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
