import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import HomePage from '../components/HomePage/HomePage';
import BookPage from '../components/BookPage/BookPage';
import BookclubPage from '../components/BookclubPage';

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
      // {
      //   path: ,
      //   element: discover books page 
      // },
      {
        path: "/books/:bookId",
        element: <BookPage />
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
        path: "/bookclubs/:bookclubId",
        element: < BookclubPage />
      },
      // {
      //   path: ,
      //   element: community activity page 
      // },
      // {
      //   path: ,
      //   element: user profile page
      // },
    ],
  },
]);