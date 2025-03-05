import './BookclubDetails.css'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getBookclub } from '../../redux/bookclubs'; 
import ChapterComments from '../ChapterComments/ChapterComments';
import { useModal } from '../../context/Modal';



function BookclubDetails() {
    const { bookclubId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const bookclub = useSelector(state => state.bookclubs.currentBookclub);

    const { setModalContent } = useModal();

    useEffect(() => {
        setLoading(true);
        Promise.all([
        dispatch(getBookclub(bookclubId))
        ]).finally(() => setLoading(false));
    }, [dispatch, bookclubId]);


    if (!bookclub) {
        return <p>Loading...</p>;
    }
    if (loading) return <p>Loading...</p>;

    console.log("bookclub.book: ", bookclub.book)

    const openChapterComments = (chapterId) => {
        setModalContent(<ChapterComments chapterId={chapterId} bookclubId={bookclubId} />);
    };

    return (
        <div className="bookclub-details">
            <h1>Bookclub</h1>

            <h2>{bookclub.name}</h2>
            <p>{bookclub.description}</p>
            
            <div>
                <div className='book-details-cover'>
                    <img src={bookclub.book.coverPicture} alt={bookclub.book.title} />
                </div>
                
                <h4>{bookclub.book.title}</h4>
                <h4>{bookclub.book.author}</h4>
            </div>
            
            <div className='club-members'>
                <h3>Members</h3>
                <ul>
                    {bookclub.members.map((member) => (
                    <li key={member.id}>
                        {member.firstName} {member.lastName}
                    </li>
                    ))}
                </ul>
            </div>

            <div className="chapter-list">
                <h2>Chapters</h2>
                <ul>
                    {Array.from({ length: bookclub.book.chapters }, (_, index) => (
                        <li 
                            key={index} 
                            className='chapter-links'
                            onClick={() => openChapterComments(index + 1)} // Open modal on chapter click
                            style={{ cursor: 'pointer' }}
                        >
                            {`Chapter ${index + 1}`}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
  );
}

export default BookclubDetails
