# from flask import Blueprint, request, jsonify
# from app.models import db, User, Friend
# from flask_login import current_user, login_required

# community_routes = Blueprint('community', __name__)


# # View Friend's Activity (posts and new books)
# @community_routes.route('/', methods=['GET'])
# @login_required
# def view_friends_activity():
#     """
#     View the recent activity of a user's friends, such as posts or new books added.
#     """
#     # Get the list of friends (assuming a friendship relationship exists)
#     friends = current_user.friends  # Assuming there's a `friends` relationship defined

#     # Query for posts from friends
#     posts = CommunityPost.query.filter(CommunityPost.userId.in_([friend.id for friend in friends]))\
#         .options(joinedload(CommunityPost.user))  # Join with the User to get the username and profile picture
    
#     # Paginate results
#     page = request.args.get('page', 1, type=int)
#     limit = request.args.get('limit', 10, type=int)
#     total_posts = posts.count()
#     posts = posts.paginate(page, limit, False).items

#     # Prepare the activities response
#     activities = [
#         {
#             'id': post.id,
#             'userId': post.user.id,
#             'username': post.user.username,
#             'profilePicture': post.user.profile_picture_url,  # Assuming there's a profile_picture_url field
#             'post': post.reviewText or post.activityType.value,  # Show review or activity type
#             'createdAt': post.createdAt.isoformat()
#         }
#         for post in posts
#     ]

#     return jsonify({
#         'activities': activities,
#         'pagination': {
#             'page': page,
#             'limit': limit,
#             'totalPosts': total_posts
#         }
#     }), 200

# # Like a Friend's Post
# @community_routes.route('/<int:postId>/like', methods=['POST'])
# @login_required
# def like_friend_post(postId):
#     """
#     Like a friend's post.
#     """
#     post = CommunityPost.query.get(postId)

#     if not post:
#         return jsonify({"message": "Post not found"}), 404

#     # Check if the user has already liked the post (we'll assume you have a Like model, or you can track likes through reactions)
#     existing_like = CommunityComment.query.filter_by(activityId=postId, userId=current_user.id, reactionType="LIKE").first()
#     if existing_like:
#         return jsonify({"message": "Already liked the post"}), 400

#     # Add a new like as a reaction (you can store likes as reactions in the CommunityComment model)
#     like = CommunityComment(activityId=postId, userId=current_user.id, reactionType="LIKE")
#     db.session.add(like)
#     db.session.commit()

#     return jsonify({"message": "Liked successfully"}), 201

# # Comment on a Friend's Post
# @community_routes.route('/<int:postId>/comment', methods=['POST'])
# @login_required
# def comment_on_friend_post(postId):
#     """
#     Comment on a friend's post.
#     """
#     post = CommunityPost.query.get(postId)

#     if not post:
#         return jsonify({"message": "Post not found"}), 404

#     # Validate the comment
#     comment = request.json.get('comment', '').strip()
#     if not comment:
#         return jsonify({
#             "message": "Bad Request",
#             "errors": {"comment": "Comment cannot be empty"}
#         }), 400
#     if len(comment) > 500:
#         return jsonify({
#             "message": "Bad Request",
#             "errors": {"comment": "Comment cannot exceed 500 characters"}
#         }), 400

#     # Create a new comment
#     new_comment = CommunityComment(activityId=postId, userId=current_user.id, reactionType="COMMENT", comment=comment)
#     db.session.add(new_comment)
#     db.session.commit()

#     return jsonify({
#         'id': new_comment.id,
#         'postId': new_comment.activityId,
#         'comment': new_comment.comment,
#         'userId': new_comment.userId,
#         'username': current_user.username,
#         'createdAt': new_comment.createdAt.isoformat()
#     }), 201


# # Update a Comment on a Friend's Post
# @community_routes.route('/<int:postId>/comments/<int:commentId>', methods=['PUT'])
# @login_required
# def update_comment_on_friend_post(postId, commentId):
#     """
#     Update a user's comment on a friend's post.
#     """
#     # Get the post and comment
#     post = CommunityPost.query.get(postId)
#     comment = CommunityComment.query.get(commentId)

#     if not post:
#         return jsonify({"message": "Post not found"}), 404
#     if not comment:
#         return jsonify({"message": "Comment not found"}), 404

#     # Check if the comment belongs to the current user
#     if comment.userId != current_user.id:
#         return jsonify({"message": "Unauthorized"}), 401

#     # Validate the updated comment
#     new_comment_text = request.json.get('comment', '').strip()
#     if not new_comment_text:
#         return jsonify({
#             "message": "Bad Request",
#             "errors": {"comment": "Comment cannot be empty"}
#         }), 400
#     if len(new_comment_text) > 500:
#         return jsonify({
#             "message": "Bad Request",
#             "errors": {"comment": "Comment cannot exceed 500 characters"}
#         }), 400

#     # Update the comment
#     comment.comment = new_comment_text
#     db.session.commit()

#     return jsonify({
#         'id': comment.id,
#         'postId': comment.activityId,
#         'comment': comment.comment,
#         'userId': comment.userId,
#         'username': current_user.username,
#         'createdAt': comment.createdAt.isoformat(),
#         'updatedAt': comment.updatedAt.isoformat()
#     }), 200


# # Delete a Comment on a Friend's Post
# @community_routes.route('/<int:postId>/comments/<int:commentId>', methods=['DELETE'])
# @login_required
# def delete_comment_on_friend_post(postId, commentId):
#     """
#     Delete a user's comment on a friend's post.
#     """
#     # Get the post and comment
#     post = CommunityPost.query.get(postId)
#     comment = CommunityComment.query.get(commentId)

#     if not post:
#         return jsonify({"message": "Post not found"}), 404
#     if not comment:
#         return jsonify({"message": "Comment not found"}), 404

#     # Check if the comment belongs to the current user
#     if comment.userId != current_user.id:
#         return jsonify({"message": "Unauthorized"}), 401

#     # Delete the comment
#     db.session.delete(comment)
#     db.session.commit()

#     return jsonify({
#         "message": "Comment successfully deleted"
#     }), 200
