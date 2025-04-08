from flask import Blueprint, request, jsonify
from app.models import db, Bookclub, User, BookclubMember, Book, BookclubComment
from flask_login import current_user, login_required
from datetime import datetime

bookclub_routes = Blueprint('bookclubs', __name__)

# Create a Bookclub
@bookclub_routes.route('/new', methods=['POST'])
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
    
    # Optionally validate bookId if it's provided
    book_id = data.get('bookId')
    if book_id:
        book = Book.query.get(book_id)
        if not book:
            return jsonify({
                "message": "Bad Request",
                "errors": {"bookId": "Selected book not found"}
            }), 400

    # Create the bookclub
    new_bookclub = Bookclub(
        name=data['name'],
        description=data['description'],
        ownerId=current_user.id,  # Associate the bookclub with the current user (the creator)
        bookId=book_id,
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow()
    )

    db.session.add(new_bookclub)
    db.session.commit()

    new_member = BookclubMember(bookclubId=new_bookclub.id, userId=current_user.id)
    db.session.add(new_member)
    db.session.commit()

    return jsonify({
        "id": new_bookclub.id,
        "name": new_bookclub.name,
        "description": new_bookclub.description,
        "ownerId": new_bookclub.ownerId,
        "bookId": new_bookclub.bookId, 
        "createdAt": new_bookclub.createdAt,
        "updatedAt": new_bookclub.updatedAt
    }), 201


# View all bookclubs user owns 
@bookclub_routes.route('/moderates', methods=['GET'])
@login_required
def get_owned_bookclubs():
    """
    Fetch all the bookclubs that the current user owns.
    """
    # Get the user id of the current logged-in user
    user_id = current_user.id

    # Query all bookclubs where the current user is the owner
    owned_bookclubs = Bookclub.query.filter_by(ownerId=user_id).all()

    if not owned_bookclubs:
        return jsonify({"message": "No bookclubs found for this user."}), 404

    bookclub_list = []
    for bookclub in owned_bookclubs:
        # Fetch the book associated with the bookclub
        book = Book.query.get(bookclub.bookId)
        
        if book:
            # Prepare book details
            book_details = {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "coverPicture": book.coverPicture,  # Add coverPicture to the book details
            }
        
        # Get the members for the current bookclub
        members = User.query.join(BookclubMember).filter(BookclubMember.bookclubId == bookclub.id).all()

        # Append the bookclub details along with book and member information
        bookclub_list.append({
            "id": bookclub.id,
            "name": bookclub.name,
            "description": bookclub.description,
            "ownerId": bookclub.ownerId,
            "createdAt": bookclub.createdAt,
            "updatedAt": bookclub.updatedAt,
            "book": book_details,  # Include the associated book's details
            "members": [{"id": member.id, "firstName": member.firstName, "lastName": member.lastName} for member in members]
        })

    return jsonify({"bookclubs": bookclub_list}), 200



# Get all bookclubs the user is a member of
@bookclub_routes.route('/member', methods=['GET'])
@login_required
def get_user_bookclub_memberships():
    """
    Fetch all the bookclubs that the current user is a member of.
    """
    user_id = current_user.id

    # Query all bookclub memberships where the current user is a member
    memberships = BookclubMember.query.filter_by(userId=user_id).all()

    if not memberships:
        return jsonify({"message": "No bookclubs found for this user."}), 404

    # Fetch bookclub details for each membership
    bookclub_list = []
    for membership in memberships:
        bookclub = Bookclub.query.get(membership.bookclubId)
        if bookclub:
            # Fetch the book associated with the bookclub
            book = Book.query.get(bookclub.bookId)  # Fetch the single book using the bookId from bookclub

            # Prepare book details, including coverPicture
            book_details = {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "coverPicture": book.coverPicture,  # Add coverPicture to the book details
            }

             # Get the members for the current bookclub
            members = User.query.join(BookclubMember).filter(BookclubMember.bookclubId == bookclub.id).all()

            bookclub_list.append({
                "id": bookclub.id,
                "name": bookclub.name,
                "description": bookclub.description,
                "ownerId": bookclub.ownerId,
                "createdAt": bookclub.createdAt,
                "updatedAt": bookclub.updatedAt,
                "book": book_details,  # Include the associated book's details (including coverPicture)
                "members": [{"id": member.id, "firstName": member.firstName, "lastName": member.lastName} for member in members]
            })

    return jsonify({"bookclubs": bookclub_list}), 200



# View a Bookclub
@bookclub_routes.route('/<int:id>', methods=['GET'])
@login_required
def view_bookclub(id):
    """
    Get details of a specific bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404
    
    book = Book.query.get(bookclub.bookId)

    # Get the members of the bookclub
    members = User.query.join(BookclubMember).filter(BookclubMember.bookclubId == bookclub.id).all()

    book_details = {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "coverPicture": book.coverPicture, 
        "chapters": book.chapters,
    }

    bookclub_data = {
        "id": bookclub.id,
        "name": bookclub.name,
        "description": bookclub.description,
        "ownerId": bookclub.ownerId,
        "createdAt": bookclub.createdAt.isoformat(),
        "updatedAt": bookclub.updatedAt.isoformat(),
        "book": book_details,  
        "members": [{"id": member.id, "firstName": member.firstName, "lastName": member.lastName} for member in members]  # List of members
    }

    return jsonify(bookclub_data), 200


# viewing and adding comments to chapters
@bookclub_routes.route('/<int:id>/<int:chapterId>/comments', methods=['GET', 'POST'])
@login_required
def manage_chapter_comments(id, chapterId):
    # Fetch the bookclub
    bookclub = Bookclub.query.get(id)
    if not bookclub:
        return jsonify({"message": "Bookclub not found"}), 404

    # Handle POST (Add a new comment)
    if request.method == 'POST':
        data = request.get_json()
        comment_text = data.get('comment')

        # Validate comment input
        if not comment_text:
            return jsonify({"message": "Comment cannot be empty"}), 400

        # Create the new chapter comment
        new_comment = BookclubComment(
            bookclubId=bookclub.id,
            bookId=bookclub.bookId,  # Assuming bookId is available from the bookclub
            userId=current_user.id,
            comment=comment_text,
            chapter=chapterId
        )

        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "message": "Comment successfully added.",
            "comment": {
                "id": new_comment.id,
                "comment": new_comment.comment,
                "createdAt": new_comment.createdAt.isoformat(),
                "user": {
                    "id": new_comment.user.id,
                    "firstName": new_comment.user.firstName,
                    "lastName": new_comment.user.lastName
                }
            }
        }), 201

    # Handle GET (Fetch existing comments)
    if request.method == 'GET':
        comments = BookclubComment.query.filter_by(bookclubId=bookclub.id, chapter=chapterId).all()

        # Prepare the comments data
        comments_data = [{
            "id": comment.id,
            "comment": comment.comment,
            "createdAt": comment.createdAt.isoformat(),
            "user": {
                "id": comment.user.id,
                "firstName": comment.user.firstName,
                "lastName": comment.user.lastName
            }
        } for comment in comments]

        return jsonify({"comments": comments_data}), 200




# Edit a Bookclub
@bookclub_routes.route('/<int:id>', methods=['PUT'])
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
        "ownerId": bookclub.ownerId,
        "createdAt": bookclub.createdAt.isoformat(),
        "updatedAt": bookclub.updatedAt.isoformat()
    }), 200




# Delete a Bookclub
@bookclub_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_bookclub(id):
    """
    Delete a specific bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    # Only the creator (owner) of the book club can delete it
    if bookclub.ownerId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401
    
    # Manually delete all BookclubMember associations
    BookclubMember.query.filter_by(bookclubId=id).delete()

    db.session.delete(bookclub)
    db.session.commit()

    return jsonify({"message": "Book club successfully deleted"}), 200




# Add a Member to a Bookclub
@bookclub_routes.route('/<int:id>/members', methods=['POST'])
@login_required
def add_member_to_bookclub(id):
    """
    Add a user to a bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    # Only the creator (owner) of the book club can add members
    if bookclub.ownerId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()
    friend_id = data.get('friendId')
    
    if not friend_id:
        return jsonify({"message": "No friendId provided"}), 400

    # Check if the user exists
    user = User.query.get(friend_id)  # 'friend_id' represents the user to be added
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the user is already a member of the bookclub
    existing_member = BookclubMember.query.filter_by(bookclubId=id, userId=friend_id).first()
    if existing_member:
        return jsonify({"message": "User is already a member of this book club"}), 400

    # Add the user as a new member of the bookclub
    new_member = BookclubMember(bookclubId=id, userId=friend_id)
    db.session.add(new_member)
    db.session.commit()

    return jsonify({"message": "User successfully added to the book club"}), 201



# Remove a Member from a Bookclub
@bookclub_routes.route('/<int:id>/members/<int:userId>', methods=['DELETE'])
@login_required
def remove_member_from_bookclub(id, userId):
    """
    Remove a user from a bookclub.
    """
    bookclub = Bookclub.query.get(id)

    if not bookclub:
        return jsonify({"message": "Book club not found"}), 404

    # Only the creator (owner) of the book club can remove members
    if bookclub.ownerId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    # Ensure the user is a member of the bookclub
    member = BookclubMember.query.filter_by(bookclubId=id, userId=userId).first()

    if not member:
        return jsonify({"message": "User is not a member of this book club"}), 404

    db.session.delete(member)
    db.session.commit()

    return jsonify({"message": "User successfully removed from the book club"}), 200
