from flask import Blueprint, request, jsonify
from app.models import db, User, Bookshelf, Book, BookshelfBook
from flask_login import current_user, login_required
from datetime import datetime

bookshelf_routes = Blueprint('bookshelves', __name__)

# Create a Bookshelf
@bookshelf_routes.route('/api/bookshelves', methods=['POST'])
@login_required
def create_bookshelf():
    """
    Create a new bookshelf for the user.
    """
    data = request.get_json()

    # Validation for the bookshelf name
    if 'name' not in data or not data['name']:
        return jsonify({
            "message": "Bad Request",
            "errors": {"name": "Bookshelf name is required"}
        }), 400

    new_bookshelf = Bookshelf(
        name=data['name'],
        description=data.get('description', ''),
        userId=current_user.id,
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow()
    )

    db.session.add(new_bookshelf)
    db.session.commit()

    return jsonify({
        "id": new_bookshelf.id,
        "name": new_bookshelf.name,
        "userId": new_bookshelf.userId,
        "createdAt": new_bookshelf.createdAt,
        "updatedAt": new_bookshelf.updatedAt
    }), 201


# View a Bookshelf
@bookshelf_routes.route('/api/bookshelves/<int:id>', methods=['GET'])
@login_required
def get_bookshelf(id):
    """
    Returns details of a specific bookshelf by its id.
    """
    bookshelf = Bookshelf.query.get(id)
    
    if not bookshelf:
        return jsonify({"message": "Bookshelf not found"}), 404

    # Only the bookshelf owner can view it
    if bookshelf.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    return jsonify({
        "id": bookshelf.id,
        "name": bookshelf.name,
        "userId": bookshelf.userId,
        "createdAt": bookshelf.createdAt,
        "updatedAt": bookshelf.updatedAt
    }), 200


# Edit a Bookshelf
@bookshelf_routes.route('/api/bookshelves/<int:id>', methods=['PUT'])
@login_required
def edit_bookshelf(id):
    """
    Allows a user to edit an existing bookshelf.
    """
    data = request.get_json()

    bookshelf = Bookshelf.query.get(id)
    if not bookshelf:
        return jsonify({"message": "Bookshelf not found"}), 404
    
    # Only the bookshelf owner can edit it
    if bookshelf.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401
    
    # Validation for the bookshelf name
    if 'name' not in data or not data['name']:
        return jsonify({
            "message": "Bad Request",
            "errors": {"name": "Bookshelf name is required"}
        }), 400

    bookshelf.name = data['name']
    bookshelf.description = data.get('description', bookshelf.description)
    
    # Handling books array (optional, but should validate if the books are valid book IDs)
    if 'books' in data:
        books = Book.query.filter(Book.id.in_(data['books'])).all()
        bookshelf.books = books  # Assuming a many-to-many relationship between bookshelf and books

    bookshelf.updatedAt = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "id": bookshelf.id,
        "name": bookshelf.name,
        "userId": bookshelf.userId,
        "createdAt": bookshelf.createdAt,
        "updatedAt": bookshelf.updatedAt
    }), 200


# Update the order of books in a Bookshelf
@bookshelf_routes.route('/api/bookshelves/<int:id>/update-order', methods=['PUT'])
@login_required
def update_bookshelf_order(id):
    """
    Update the order of books in a specific bookshelf.
    """
    data = request.get_json()

    # Validation for the books array
    if 'books' not in data or not isinstance(data['books'], list):
        return jsonify({
            "message": "Bad Request",
            "errors": {"books": "Books order must be an array of book IDs"}
        }), 400
    
    bookshelf = Bookshelf.query.get(id)
    
    if not bookshelf:
        return jsonify({"message": "Bookshelf not found"}), 404
    
    # Only the bookshelf owner can edit it
    if bookshelf.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    # Ensure that the books are valid book IDs and belong to this bookshelf
    books = Book.query.filter(Book.id.in_(data['books'])).all()
    if len(books) != len(data['books']):
        return jsonify({"message": "Some books were not found"}), 404

    # Update the order of books in the bookshelf using the BookshelfBook table
    for index, book_id in enumerate(data['books']):
        bookshelf_book = BookshelfBook.query.filter_by(bookshelfId=id, bookId=book_id).first()
        if bookshelf_book:
            bookshelf_book.orderInShelf = index + 1  # Setting the order (index starts at 0, so +1)
        else:
            return jsonify({"message": "Book not found in bookshelf"}), 404

    # Commit changes to the database
    db.session.commit()

    return jsonify({"message": "Bookshelf order updated successfully"}), 200

# Remove a book from a Bookshelf
@bookshelf_routes.route('/api/bookshelves/<int:id>/books/<int:book_id>', methods=['DELETE'])
@login_required
def remove_book_from_bookshelf(id, book_id):
    """
    Removes a book from a specific bookshelf.
    """
    bookshelf = Bookshelf.query.get(id)
    if not bookshelf:
        return jsonify({"message": "Bookshelf not found"}), 404

    # Only the bookshelf owner can remove books
    if bookshelf.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    # Check if the book exists in the bookshelf
    book = Book.query.get(book_id)
    if not book or book not in bookshelf.books:
        return jsonify({"message": "Book not found in bookshelf"}), 404

    bookshelf.books.remove(book)
    db.session.commit()

    return jsonify({"message": "Book successfully removed from bookshelf"}), 200


# Delete a Bookshelf
@bookshelf_routes.route('/api/bookshelves/<int:id>', methods=['DELETE'])
@login_required
def delete_bookshelf(id):
    """
    Deletes a specific bookshelf from the system.
    """
    bookshelf = Bookshelf.query.get(id)
    if not bookshelf:
        return jsonify({"message": "Bookshelf not found"}), 404

    # Only the bookshelf owner can delete it
    if bookshelf.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    db.session.delete(bookshelf)
    db.session.commit()

    return jsonify({"message": "Bookshelf successfully deleted"}), 200
