import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommunityActivity, likeFriendPost, commentOnFriendPost } from "../../redux/community";
import { LiaCommentsSolid } from "react-icons/lia";
import "./Community.css";

function Community() {
  const dispatch = useDispatch();
  const communityPosts = useSelector((state) => state.community.communityPosts);
  const sessionUser = useSelector((state) => state.session.user);

  // console.log("communityPosts", communityPosts)
  // console.log("communityPosts[0]", communityPosts[0])
  // console.log("communityPosts[0].user", communityPosts[0]?.user)

    // State to manage visibility of comments and comment form
    const [commentsVisible, setCommentsVisible] = useState({});
    const [commentFormVisible, setCommentFormVisible] = useState({});

  // Fetch posts when the component mounts
  useEffect(() => {
    if (sessionUser) {
      dispatch(getCommunityActivity()); // Fetch posts only if user is logged in
    }
  }, [dispatch, sessionUser]);

  // Handle like functionality
  const handleLike = (postId) => {
    dispatch(likeFriendPost(postId)); // Dispatch the like action
  };

  // Handle comment submission
  const handleCommentSubmit = (postId, commentText) => {
    dispatch(commentOnFriendPost(postId, commentText)); // Dispatch the comment action
  };

  // Toggle comment visibility
  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // Toggle comment form visibility
  const toggleCommentFormVisibility = (postId) => {
    setCommentFormVisible((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  if (!sessionUser) {
    return (
      <div>
        <h1>Community Activity</h1>
        <p className="not-logged-in">Log in to add friends and view friend's reading activity</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Community Activity</h1>

      <div className="posts-container">
        {communityPosts.length === 0 ? (
          <p>No community activity available.</p>
        ) : (
          communityPosts.map((post) => (
            <div key={post.id} className="post-tile">
              
              {/* Post header with user info */}
              <div className="post-header">

              {post.user ? (
                  <div className="user-info">
                    {post.user.profilePicture ? (
                      <img
                        src={`../../../public/images/profile-icons/${post.user.profilePicture}`}
                        alt={`${post.user.firstName}'s profile`}
                        className="post-profile-picture"
                      />
                    ) : (
                      <div className="no-profile-picture">No Profile Picture</div>
                    )}
                    <p>{post.user.firstName} {post.user.lastName}</p>
                  </div>
                ) : (
                  <div className="user-info">
                    <div className="no-profile-picture">No User Info</div>
                  </div>
                )}

                <div className="post-user-info">
                  <h3>{post.username}</h3>
                  <p>{post.user.firstName}</p>
                  <p>{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Book Info */}
              <div className="post-book">
                <img
                  src={post.book.cover || "/default-book-cover.png"}
                  alt={post.book.title}
                  className="post-book-cover"
                />
                <div className="post-book-info">
                  <h4>{post.book.title}</h4>
                  <p>{post.book.author}</p>
                  {post.reviewText && <p>{post.reviewText}</p>}
                  {post.rating && <p>Rating: {post.rating} / 5</p>}
                </div>
              </div>

              {/* Like Button */}
              <div className="like-button-div">
                <button className="like-button" onClick={() => handleLike(post.id)}>
                  {post.liked ? "Unlike" : "Like"}
                </button>
              </div>

              {/* Comments Toggle Button */}
              <div className="comments-toggle">
                <button onClick={() => toggleCommentsVisibility(post.id)}>
                  <LiaCommentsSolid />
                </button>
              </div>

              {/* Display Comments if visible */}
              {commentsVisible[post.id] && (
                <div className="comments">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <img
                        src={comment.profilePicture || "/default-profile.png"}
                        alt={`${comment.username}'s profile`}
                        className="comment-profile-picture"
                      />
                      <div className="comment-content">
                        <h5>{comment.username}</h5>
                        <p>{comment.comment}</p>
                        <p>{new Date(comment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Leave a comment button */}
              <div className="leave-comment-button-div">
                <button onClick={() => toggleCommentFormVisibility(post.id)}>
                  Leave a comment
                </button>
              </div>

              {/* Comment Form */}
              {commentFormVisible[post.id] && (
                <div className="comment-form">
                  <textarea
                    placeholder="Write a comment..."
                    id={`comment-${post.id}`}
                    rows="3"
                  ></textarea>
                  <button
                    onClick={() => {
                      const commentText = document.getElementById(`comment-${post.id}`).value;
                      if (commentText.trim()) {
                        handleCommentSubmit(post.id, commentText);
                      }
                    }}
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Community;
