import './ChapterComments.css'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChapterComments, addChapterComment } from '../../redux/bookclubs'; 
import { useModal } from '../../context/Modal';
// import { useModal } from '../../context/Modal';

function ChapterComments({ chapterId, bookclubId }) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const sessionUser = useSelector((state) => state.session.user);
    const comments = useSelector((state) => state.bookclubs.currentBookclub.chapterComments?.[chapterId] || []);
    console.log("comments", comments)
    // const { closeModal } = useModal();

    const [newComment, setNewComment] = useState('');
    
    useEffect(() => {
        dispatch(getChapterComments(bookclubId, chapterId)); 
    }, [dispatch, bookclubId, chapterId]);

    const handleInputChange = (e) => {
        setNewComment(e.target.value);
    };

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        // Dispatch the action to create a new comment
        const response = await dispatch(addChapterComment(bookclubId, chapterId, newComment));

        if (response.ok) {
            setNewComment('');  // Clear the input field after submission
            
        } else {
            // Handle any errors here (show message or logging)
            console.error('Failed to add comment');
        }
    };
    
    if (!comments) {
        return <p>Loading comments...</p>;
    }



    return (
        <div className="chapter-comments">
          <h3>Chapter {chapterId}</h3>

          <ul>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <li key={comment.id}>
                  {/* User Info on the Left */}
                  <div className="comment-user">
                    <p>
                      {comment.user.firstName} {comment.user.lastName}
                    </p>
                    <p className="comment-meta">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className='comment-and-edit-delete'>
                  {/* Comment Text in the Center */}
                  <div className="comment-text">
                    <p>{comment.comment}</p>
                  </div>

                  {/* Edit/Delete buttons placed underneath the comment text */}
                  {sessionUser?.id === comment.user.id && (
                    <div className="comment-edit-delete">
                      <span onClick={() => handleEdit(comment)}>Edit</span>
                      <span onClick={() => handleDelete(comment.id)}>Delete</span>
                    </div>
                  )}
                  </div>
                </li>
              ))
              ) : (
                <p>No comments yet.</p>
              )}
            </ul>

            {/* Comment input form */}
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={handleInputChange}
                    placeholder="Add a comment..."
                    required
                />
                <div className='club-comment-buttons'>
                <button type="submit">Submit Comment</button>
                <button onClick={closeModal}>Close</button>
                </div>
            </form>
        </div>
    );
}

export default ChapterComments
