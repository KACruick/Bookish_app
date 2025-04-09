import './BookclubDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getBookclub, getChapterComments } from '../../redux/bookclubs';  
import ChapterComments from '../ChapterComments/ChapterComments';
import { useModal } from '../../context/Modal';
import AddMemberModal from '../AddMemberModal';
import RemoveMemberModal from '../RemoveMemberModal';
import DeleteBookclubModal from '../DeleteBookclubModal';
import ChangeBookModal from '../ChangeBookModal';

function BookclubDetails() {
    const { bookclubId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const bookclub = useSelector(state => state.bookclubs.currentBookclub);
    const chapterComments = useSelector(state => state.bookclubs.currentBookclub.chapterComments);
    const sessionUser = useSelector(state => state.session.user);


    const { setModalContent } = useModal();

    useEffect(() => {
        setLoading(true);
        // Fetch bookclub details
        dispatch(getBookclub(bookclubId)).finally(() => setLoading(false));
    }, [dispatch, bookclubId]);

    const existingComments = useSelector(state => state.bookclubs.currentBookclub.chapterComments);

useEffect(() => {
  if (bookclub?.book?.chapters) {
    for (let chapterId = 1; chapterId <= bookclub.book.chapters; chapterId++) {
      if (!existingComments?.[chapterId]) {
        dispatch(getChapterComments(bookclubId, chapterId));
      }
    }
  }
}, [bookclubId, bookclub?.book?.chapters, existingComments, dispatch]);

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

    // Check if the logged-in user is a moderator
    const isModerator = sessionUser?.id === bookclub.ownerId;

    // Find the moderator (owner) first name
    const owner = bookclub.members.find(member => member.id === bookclub.ownerId);
    const ownerFirstName = owner ? owner.firstName : '';

    // Function to open the modal for adding/removing members
    const openAddMemberModal = () => {
        setModalContent(<AddMemberModal bookclubId={bookclubId}/>);
    };

    const openRemoveMemberModal = () => {
        setModalContent(<RemoveMemberModal bookclubId={bookclubId}/>);
    };

    
    // Function to open the modal for chapter comments
    const openChapterComments = (chapterId) => {
        setModalContent(<ChapterComments chapterId={chapterId} bookclubId={bookclubId} />);
    };
    // console.log(bookclubId)
    const openDeleteBookclubModal = (bookclubId) => {
        setModalContent(< DeleteBookclubModal bookclubId={bookclubId}/>)
    }

    const openChangeBookModal = (bookclubId) => {
        setModalContent(<ChangeBookModal bookclubId={bookclubId}/>)
    }

    return (
        <div className="bookclub-details-page">
            {/* <h1>Bookclub</h1> */}
            {/* <h1>{bookclub.name}</h1> */}

            <div className='club-and-book'>

                <div className='book-details-cover'>
                    <img src={bookclub.book.coverPicture} alt={bookclub.book.title} />
                    {isModerator && (
                        <button onClick={() => openChangeBookModal(bookclubId)}>Change book</button>
                    )}
                </div>

                <div className='club-and-book-info'>
                    <h2>{bookclub.name}</h2>
                    <p>{bookclub.description}</p>

                    <h4>Current Book: {bookclub.book.title}</h4>
                    <h4>By: {bookclub.book.author}</h4>

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

                    {/* Moderator-specific div */}
                    <div className="moderator-info">
                        {isModerator ? (
                            <div>
                                
                                <p>You moderate this bookclub</p>
                                <div>
                                    <button onClick={openAddMemberModal}>Add Another Member</button>
                                    <button onClick={openRemoveMemberModal}>Remove a Member</button>
                                </div>
                                <div className='delete-bookclub-div'>
                                    <button onClick={() => openDeleteBookclubModal(bookclubId)}>Delete Bookclub</button>
                                </div>
                            </div>
                            
                        ) : (
                            <p>{ownerFirstName} moderates this club</p>
                        )}
                    </div>
                </div>


            </div>

                {/* Moderator-specific div */}
                {/* <div className="moderator-info">
                        {isModerator ? (
                            <div>
                                <p>You moderate this bookclub</p>
                                <button onClick={openAddMemberModal}>Add Another Member</button>
                                <button onClick={openRemoveMemberModal}>Remove a Member</button>
                            </div>
                        ) : (
                            <p>{ownerFirstName} moderates this club</p>
                        )}
                </div> */}
            

            

            <div className="chapter-section">
                <h2>Chapters</h2>
                <ul className='chapter-list'>
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
