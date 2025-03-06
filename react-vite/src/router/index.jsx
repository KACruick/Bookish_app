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
import ChapterComments from '../components/ChapterComments';
import AddBookForm from '../components/AddBookForm';
import ManageBooksAdded from '../components/ManageBooksAdded';

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
      {
        path: '/books/current',
        element: < ManageBooksAdded />
      },
      {
        path: '/books/add',
        element: <AddBookForm />
      },
      {
        path: 'books/:bookId/edit',
        element: < AddBookForm />
      },
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
        path: "bookclubs/:bookclubId/:chapterId/comments",
        element: <ChapterComments />
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