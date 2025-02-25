from flask import Blueprint, request, jsonify
from app.models import db, Bookclub, User, BookclubMember
from flask_login import current_user, login_required

bookclub_routes = Blueprint('bookclubs', __name__)

# Create a Bookclub
@bookclub_routes.route('/api/bookclubs', methods=['POST'])
@login_required
def create_bookclub():
    """
    Create a new book club.
    """
    data = request.get_json()

    # Validate data
    if not data.get('name') or not data.get('description'):
        return jsonify({
            "message": "Bad Request",
            "errors": {"name": "Bookclub name is required", "description": "Description is required"}
        }), 400

    # Create the bookclub
    new_bookclub = Bookclub(
        name=data['name'],
        description=data['description'],
        userId=current_user.id  # Associate the bookclub with the current user (the creator)
    )

    db.session.add(new_bookclub)
    db.session.commit()

    return jsonify({
        "id": new_bookclub.id,
        "name": new_bookclub.name,
        "description": new_bookclub.description,
        "userId": new_bookclub.userId,
        "createdAt": new_bookclub.createdAt.isoformat(),
        "updatedAt": new_bookclub.updatedAt.isoformat()
    }), 201

# View a Bookclub
@bookclub_routes.route('/api/bookclubs/<int:id>', methods=['GET'])
@login_required
def view_bookclub(id):
    """
    Get details of a specific bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    return jsonify({
        "id": bookclub.id,
        "name": bookclub.name,
        "description": bookclub.description,
        "userId": bookclub.userId,
        "createdAt": bookclub.createdAt.isoformat(),
        "updatedAt": bookclub.updatedAt.isoformat()
    }), 200

# Edit a Bookclub
@bookclub_routes.route('/api/bookclubs/<int:id>', methods=['PUT'])
@login_required
def edit_bookclub(id):
    """
    Update a bookclub's name or description.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    # Only the creator (owner) of the book club can edit it
    if bookclub.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()

    # Update the bookclub
    if 'name' in data:
        bookclub.name = data['name']
    if 'description' in data:
        bookclub.description = data['description']

    db.session.commit()

    return jsonify({
        "id": bookclub.id,
        "name": bookclub.name,
        "description": bookclub.description,
        "userId": bookclub.userId,
        "createdAt": bookclub.createdAt.isoformat(),
        "updatedAt": bookclub.updatedAt.isoformat()
    }), 200

# Delete a Bookclub
@bookclub_routes.route('/api/bookclubs/<int:id>', methods=['DELETE'])
@login_required
def delete_bookclub(id):
    """
    Delete a specific bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    # Only the creator (owner) of the book club can delete it
    if bookclub.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    db.session.delete(bookclub)
    db.session.commit()

    return jsonify({"message": "Book club successfully deleted"}), 200

# Add a Member to a Bookclub
@bookclub_routes.route('/api/bookclubs/<int:id>/members', methods=['POST'])
@login_required
def add_member_to_bookclub(id):
    """
    Add a user to a bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    # Only the creator (owner) of the book club can add members
    if bookclub.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()
    user_id = data.get('userId')

    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the user is already a member
    existing_member = BookclubMember.query.filter_by(bookclubId=id, userId=user_id).first()
    if existing_member:
        return jsonify({"message": "User is already a member of this book club"}), 400

    # Add the user as a member
    new_member = BookclubMember(bookclubId=id, userId=user_id)
    db.session.add(new_member)
    db.session.commit()

    return jsonify({"message": "User successfully added to the book club"}), 201

# Remove a Member from a Bookclub
@bookclub_routes.route('/api/bookclubs/<int:id>/members/<int:userId>', methods=['DELETE'])
@login_required
def remove_member_from_bookclub(id, userId):
    """
    Remove a user from a bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    # Only the creator (owner) of the book club can remove members
    if bookclub.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    # Ensure the user is a member of the bookclub
    member = BookclubMember.query.filter_by(bookclubId=id, userId=userId).first()

    if not member:
        return jsonify({"message": "User is not a member of this book club"}), 404

    db.session.delete(member)
    db.session.commit()

    return jsonify({"message": "User successfully removed from the book club"}), 200
