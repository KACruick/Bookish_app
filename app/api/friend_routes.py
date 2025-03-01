from flask import Blueprint, request, jsonify
from app.models import db, User, Friend
from flask_login import current_user, login_required

friend_routes = Blueprint('friends', __name__)



# Send a Friend Request
@friend_routes.route('/<int:userId>', methods=['POST'])
@login_required
def send_friend_request(userId):
    """
    Send a friend request to another user.
    """
    # Ensure the user isn't trying to send a request to themselves
    if userId == current_user.id:
        return jsonify({
            "message": "Bad Request",
            "errors": {"userId": "You cannot send a friend request to yourself"}
        }), 400

    # Find the user to send a request to
    user_to_request = User.query.get(userId)

    if not user_to_request:
        return jsonify({"message": "User not found"}), 404
    
    #userId sender
    #friendId reciever

    # Check if a friend request already exists (either sent or received)
    existing_request = Friend.query.filter(
        ((Friend.userId == current_user.id) & (Friend.friendId == userId)) |
        ((Friend.userId == userId) & (Friend.friendId == current_user.id))
    ).first()

    if existing_request:
        return jsonify({"message": "A friend request already exists"}), 400

    # Create a new friend request
    new_request = Friend(userId=current_user.id, friendId=userId)
    db.session.add(new_request)
    db.session.commit()

    return jsonify({"message": "Friend request sent"}), 201




# Accept a Friend Request
@friend_routes.route('/<int:userId>/accept', methods=['PATCH'])
@login_required
def accept_friend_request(userId):
    """
    Accept a pending friend request.
    """
    # Find the friend request
    friend_request = Friend.query.filter_by(userId=userId, friendId=current_user.id, status='pending').first()

    if not friend_request:
        return jsonify({"message": "Friend request not found"}), 404

    # Accept the friend request and create a friendship
    friend_request.status = 'accepted'
    db.session.commit()

    return jsonify({"message": "Friend request accepted"}), 200




# Unfriend a Friend
@friend_routes.route('/<int:userId>', methods=['DELETE'])
@login_required
def remove_friend(userId):
    """
    Remove a friend from the user's friend list.
    """
    # Find the friendship to remove (either direction)
    friendship = Friend.query.filter(
        ((Friend.userId == current_user.id) & (Friend.friendId == userId) & (Friend.status == 'accepted')) |
        ((Friend.userId == userId) & (Friend.friendId == current_user.id) & (Friend.status == 'accepted'))
    ).first()

    if not friendship:
        return jsonify({"message": "Friend not found"}), 404

    # Delete the friendship
    db.session.delete(friendship)
    db.session.commit()

    return jsonify({"message": "Friend successfully removed"}), 200
