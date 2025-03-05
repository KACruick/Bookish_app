import './ChapterComments.css'
import { useState, useEffect } from 'react';
import { useModal } from '../../context/Modal';

function ChapterComments({ chapterId, bookclubId }) {
    const { closeModal } = useModal();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Fetch comments for the given chapter and bookclub
    useEffect(() => {
        const fetchComments = async () => {
        const response = await fetch(`/api/bookclubs/${bookclubId}/${chapterId}/comments`);
        const data = await response.json();
        setComments(data.comments);
        };

        fetchComments();
    }, [bookclubId, chapterId]);

    // Handle comment submission
    const handleCommentSubmit = async () => {
        const response = await fetch(`/api/bookclubs/${bookclubId}/${chapterId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
        });
        
        if (response.ok) {
        setNewComment('');
        const data = await response.json();
        setComments((prevComments) => [...prevComments, data.comment]);
        }
    };

    return (
        <div className="chapter-comments-modal">
            
            <h2>Comments for Chapter {chapterId}</h2>
            <ul>
                {comments.map((comment) => (
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>- {comment.user.firstName} {comment.user.lastName}</p>
                </li>
                ))}
            </ul>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment here..."
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
            <button onClick={closeModal}>Close</button>

        </div>
    )
}

export default ChapterComments
