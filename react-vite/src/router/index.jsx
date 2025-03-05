import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import HomePage from '../components/HomePage/HomePage';
import BookPage from '../components/BookPage/BookPage';
// import BookclubPage from '../components/BookclubPage';

import Discover from '../components/Discover';
import Community from '../components/Community';
import YourBookclubs from '../components/YourBookclubs';
import YourLibrary from '../components/YourLibrary';
import ReviewModal from '../components/ReviewModal';
import BookclubDetails from '../components/BookclubDetails';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/books",
        element: < Discover />
      },
      {
        path: "/books/:bookId",
        element: <BookPage />
      },
      {
        path: "/bookshelves/current",
        element: < YourLibrary />
      },
      // {
      //   path: ,
      //   element: manage books you created
      // },
      // {
      //   path: ,
      //   element: create/update a new book page 
      // },
      // {
      //   path: ,
      //   element: bookshelf page 
      // },
      // {
      //   path: ,
      //   element: see/order books in bookshelf
      // },
      // {
      //   path: ,
      //   element: bookclub manage page 
      // },
      {
        path: "/reviews/:bookId",
        element: < ReviewModal />
      },
      {
        path: "/bookclubs/current",
        element: < YourBookclubs />
      },
      // {
      //   path: "/bookclubs",
      //   element: < YourBookclubs />
      // },
      {
        path: "/bookclubs/:bookclubId",
        element: < BookclubDetails />
      },
      {
        path: "/community",
        element: < Community />
      },
      // {
      //   path: ,
      //   element: user profile page
      // },
    ],
  },
]);