import './BookclubDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getBookclub, getChapterComments } from '../../redux/bookclubs';  // Ensure `getChapterComments` is properly imported
import ChapterComments from '../ChapterComments/ChapterComments';
import { useModal } from '../../context/Modal';

function BookclubDetails() {
    const { bookclubId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const bookclub = useSelector(state => state.bookclubs.currentBookclub);
    const chapterComments = useSelector(state => state.bookclubs.currentBookclub.chapterComments);


    const { setModalContent } = useModal();

    useEffect(() => {
        setLoading(true);
        // Fetch bookclub details
        dispatch(getBookclub(bookclubId)).finally(() => setLoading(false));
    }, [dispatch, bookclubId]);

    // useEffect(() => {
    //     // Only dispatch getChapterComments once the bookclub is loaded and valid
    //     if (bookclub?.book?.chapters && typeof bookclub.book.chapters === 'number') {
    //         // Fetch comments for each chapter only once
    //         for (let chapterId = 1; chapterId <= bookclub.book.chapters; chapterId++) {
    //             dispatch(getChapterComments(bookclubId, chapterId));
    //         }
    //     }
    // }, [bookclub, bookclubId, dispatch]);  // Fetch chapter comments when bookclub data is available

    // Early return if bookclub data is not yet available
    if (!bookclub || loading) {
        return <p>Loading...</p>;
    }

    
    // Function to open the modal for chapter comments
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
                    {/* Loop through chapters and check if they have comments */}
                    {Array.from({ length: bookclub.book.chapters }, (_, index) => {
                        const chapterId = index + 1;
                        const comments = chapterComments?.[chapterId] || [];  // Get comments for this chapter
                        const commentCount = comments.length;

                        return (
                            <li 
                                key={chapterId} 
                                className='chapter-links'
                                onClick={() => openChapterComments(chapterId)} // Open modal on chapter click
                                style={{ cursor: 'pointer' }}
                            >
                                {`Chapter ${chapterId}`} {commentCount > 0 && `- ${commentCount} comments`}
                            </li>
                        );
                    })}
                </ul>
            </div>

        </div>
    );
}

export default BookclubDetails;
