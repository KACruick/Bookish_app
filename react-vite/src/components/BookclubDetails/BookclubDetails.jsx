import './BookclubDetails.css'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getBookclub } from '../../redux/bookclubs'; 


function BookclubDetails() {
    const { bookclubId } = useParams();
    const dispatch = useDispatch();

    const bookclub = useSelector(state => state.bookclubs.currentBookclub);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getBookclub(bookclubId)); 

        if (bookclub) {
            setLoading(false);
        }
    }, [dispatch, bookclubId, bookclub]);

    if (loading) {
        return <p>Loading...</p>;
      }

    if (!bookclub) {
        return <p>Loading...</p>;
    }

    // console.log("bookclub.book: ", bookclub.book)

    return (
        <div className="bookclub-details">
            <h1>Bookclub details</h1>

            <h2>{bookclub.name}</h2>
            <p>{bookclub.description}</p>
            <h3>Book Details</h3>
            <div>
                <img src={bookclub.book.coverPicture} alt={bookclub.book.title} />
                <h4>{bookclub.book.title}</h4>
                <p>{bookclub.book.author}</p>
            </div>
            
            <h3>Members</h3>
            <ul>
                {bookclub.members.map((member) => (
                <li key={member.id}>
                    {member.firstName} {member.lastName}
                </li>
                ))}
            </ul>
        </div>
  );
}

export default BookclubDetails
