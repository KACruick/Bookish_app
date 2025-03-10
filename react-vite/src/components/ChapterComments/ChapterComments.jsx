import './ChapterComments.css'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChapterComments, addChapterComment } from '../../redux/bookclubs'; 
import { useModal } from '../../context/Modal';

function ChapterComments({ chapterId, bookclubId }) {
    const dispatch = useDispatch();
    const comments = useSelector((state) => state.bookclubs.currentBookclub.chapterComments?.[chapterId] || []);
    console.log("comments", comments)
    const { closeModal } = useModal();

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
          <h3>Chapter Comments</h3>

          <ul>
            {/* Render comments safely if they exist */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <li key={comment.id}>
                  <p>{comment.comment}</p>
                  <p>by {comment.user.firstName} {comment.user.lastName}</p>
                  <p>{new Date(comment.createdAt).toLocaleString()}</p>
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
                <button type="submit">Submit Comment</button>
            </form>
        </div>
    );
}

export default ChapterComments
