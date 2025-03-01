from flask import Blueprint, request, jsonify
from app.models import db, User, Friend, CommunityPost, CommunityComment
from flask_login import current_user, login_required
from sqlalchemy.orm import joinedload


community_routes = Blueprint('community', __name__)


# View Friend's Activity (posts and new books)
@community_routes.route('/', methods=['GET'])
@login_required
def view_friends_activity():
    """
    View the recent activity of a user's friends, such as books added to bookshelves, or reviews/ratings.
    """
    # Get the list of friends
    friends = Friend.query.filter(
        ((Friend.userId == current_user.id) | (Friend.friendId == current_user.id)) &
        (Friend.status == 'accepted')
    ).all()
    print("friends: ", friends)

    # Extract the friends' ids
    friend_ids = [friend.friendId if friend.userId == current_user.id else friend.userId for friend in friends]

    # Include the current user's own posts in the query (viewing own posts too)
    friend_ids.append(current_user.id)

    # Query for posts from friends and the current user
    posts_query = CommunityPost.query.filter(CommunityPost.userId.in_(friend_ids))\
        .options(
            joinedload(CommunityPost.user),   # Join with the User to get the username and profile picture
            joinedload(CommunityPost.book)    # Join with the Book to get the title and author
        )
    
    # Paginate results
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 20, type=int)
    posts = posts_query.paginate(page=page, per_page=size, error_out=False).items

    # Fetch comments (and likes) for each post
    comments = CommunityComment.query.filter(CommunityComment.activityId.in_([post.id for post in posts]))\
        .all()

    # Prepare the activities response
    communityPosts = [
        {
            'id': post.id,
            'userId': post.userId,
            'username': post.user.username, 
            'profilePicture': post.user.profilePicture,
            'user': {
                'firstName': post.user.firstName,
                'lastName': post.user.lastName,
            },
            'bookId': post.bookId,
            'book': {
                'title': post.book.title,
                'author': post.book.author,
                'cover': post.book.coverPicture,
            },
            'rating': post.rating,
            'reviewText': post.reviewText,
            'bookshelfId': post.bookshelfId,
            'createdAt': post.createdAt,
            'comments': [
                {
                    'id': comment.id,
                    'userId': comment.userId,
                    'username': comment.user.username,
                    'profilePicture': comment.user.profilePicture, 
                    'firstName': comment.user.firstName,  
                    'lastName': comment.user.lastName, 
                    'comment': comment.comment,
                    'like': comment.like,  #
                    'createdAt': comment.createdAt,
                }
                for comment in comments if comment.activityId == post.id
            ]
        }
        for post in posts
    ]

    return jsonify({
        'Community Posts': communityPosts,
        'page': page,
        'size': size,
    }), 200




# Like a Friend's Post
@community_routes.route('/<int:postId>/like', methods=['POST'])
@login_required
def like_friend_post(postId):
    """
    Like a friend's post.
    """
    post = CommunityPost.query.get(postId)

    if not post:
        return jsonify({"message": "Post not found"}), 404

    # Check if the user has already liked the post
    existing_like = CommunityComment.query.filter_by(
        activityId=postId, 
        userId=current_user.id, 
        like=True
    ).first()

    if existing_like:
        return jsonify({"message": "Already liked the post"}), 400

    # Add a new like as a new community comment
    like = CommunityComment(
        activityId=postId, 
        userId=current_user.id, 
        like=True
    )
    db.session.add(like)
    db.session.commit()

    return jsonify({"message": "Liked successfully"}), 201





# Comment on a Friend's Post
@community_routes.route('/<int:postId>/comment', methods=['POST'])
@login_required
def comment_on_friend_post(postId):
    """
    Comment on a friend's post.
    """
    post = CommunityPost.query.get(postId)

    if not post:
        return jsonify({"message": "Post not found"}), 404

    # Validate the comment
    comment = request.json.get('comment', '').strip()
    if not comment:
        return jsonify({
            "message": "Bad Request",
            "errors": {"comment": "Comment cannot be empty"}
        }), 400
    if len(comment) > 500:
        return jsonify({
            "message": "Bad Request",
            "errors": {"comment": "Comment cannot exceed 500 characters"}
        }), 400

    # Create a new comment
    new_comment = CommunityComment(activityId=postId, userId=current_user.id, comment=comment)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        'id': new_comment.id,
        'postId': new_comment.activityId,
        'comment': new_comment.comment,
        'userId': new_comment.userId,
        'username': current_user.username,
        'profilePicture': post.user.profilePicture,
        'user': {
            'firstName': post.user.firstName,
            'lastName': post.user.lastName,
        },
        'createdAt': new_comment.createdAt
    }), 201


# Update a Comment on a Friend's Post
@community_routes.route('/<int:postId>/comments/<int:commentId>', methods=['PUT'])
@login_required
def update_comment_on_friend_post(postId, commentId):
    """
    Update a user's comment on a friend's post.
    """
    # Get the post and comment
    post = CommunityPost.query.get(postId)
    comment = CommunityComment.query.get(commentId)

    if not post:
        return jsonify({"message": "Post not found"}), 404
    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    # Check if the comment belongs to the current user
    if comment.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    # Validate the updated comment
    new_comment_text = request.json.get('comment', '').strip()
    if not new_comment_text:
        return jsonify({
            "message": "Bad Request",
            "errors": {"comment": "Comment cannot be empty"}
        }), 400
    if len(new_comment_text) > 500:
        return jsonify({
            "message": "Bad Request",
            "errors": {"comment": "Comment cannot exceed 500 characters"}
        }), 400

    # Update the comment
    comment.comment = new_comment_text
    db.session.commit()

    return jsonify({
        'id': comment.id,
        'postId': comment.activityId,
        'comment': comment.comment,
        'userId': comment.userId,
        'username': current_user.username,
        'profilePicture': comment.user.profilePicture,
        'user': {
            'firstName': comment.user.firstName,
            'lastName': comment.user.lastName,
        },
        'createdAt': comment.createdAt,
        'updatedAt': comment.updatedAt
    }), 200


# Delete a Comment on a Friend's Post
@community_routes.route('/<int:postId>/comments/<int:commentId>', methods=['DELETE'])
@login_required
def delete_comment_on_friend_post(postId, commentId):
    """
    Delete a user's comment on a friend's post.
    """
    # Get the post and comment
    post = CommunityPost.query.get(postId)
    comment = CommunityComment.query.get(commentId)

    if not post:
        return jsonify({"message": "Post not found"}), 404
    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    # Check if the comment belongs to the current user
    if comment.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    # Delete the comment
    db.session.delete(comment)
    db.session.commit()

    return jsonify({
        "message": "Comment successfully deleted"
    }), 200
