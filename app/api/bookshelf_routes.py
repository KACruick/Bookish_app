from flask import Blueprint, request, jsonify
from app.models import db, User, Bookshelf, Book, BookshelfBook, CommunityPost
from flask_login import current_user, login_required
from datetime import datetime

bookshelf_routes = Blueprint('bookshelves', __name__)

# Get all bookshelves
@bookshelf_routes.route('/', methods=['GET'])
def get_bookshelves():
    """
    Returns all bookshelves in the system.
    """
    bookshelves = Bookshelf.query.all()  # Fetch all bookshelves

    # If there are no bookshelves, return a 404
    if not bookshelves:
        return jsonify({"message": "No bookshelves found"}), 404

    # Prepare the list of bookshelves
    bookshelves_data = [{
        "id": bookshelf.id,
        "name": bookshelf.name,
        "userId": bookshelf.userId,
        "createdAt": bookshelf.createdAt.isoformat(),
        "updatedAt": bookshelf.updatedAt.isoformat(),
    } for bookshelf in bookshelves]

    return jsonify({"bookshelves": bookshelves_data}), 200

# Get all Bookshelves for the current user 
@bookshelf_routes.route('/current', methods=['GET'])
@login_required
def get_all_bookshelves():
    """
    Returns all bookshelves for the currently logged-in user.
    """
    bookshelves = Bookshelf.query.filter_by(userId=current_user.id).all()


    # Prepare the list of bookshelves along with books inside each shelf
    result = []
    for bookshelf in bookshelves:
        # Get all books associated with this bookshelf
        bookshelf_books = BookshelfBook.query.filter_by(bookshelfId=bookshelf.id).all()

        # Prepare the list of books for this bookshelf
        books = [{
            "id": bookshelf_book.book.id,
            "title": bookshelf_book.book.title,
            "author": bookshelf_book.book.author,
            "coverPicture": bookshelf_book.book.coverPicture,
            "addedAt": bookshelf_book.addedAt.isoformat(),
            "orderInShelf": bookshelf_book.orderInShelf
        } for bookshelf_book in bookshelf_books]

        # Add the bookshelf details along with the books
        result.append({
            "id": bookshelf.id,
            "name": bookshelf.name,
            "userId": bookshelf.userId,
            "createdAt": bookshelf.createdAt,
            "updatedAt": bookshelf.updatedAt,
            "Books": books  # Include the books inside the bookshelf
        })

    return jsonify({"bookshelves": result}), 200


# Create a Bookshelf
@bookshelf_routes.route('/', methods=['POST'])
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




# View a Bookshelf and its books
@bookshelf_routes.route('/<int:id>', methods=['GET'])
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
    
    # Get all books associated with the bookshelf
    bookshelf_books = BookshelfBook.query.filter_by(bookshelfId=id).all()

    # Prepare the list of books
    books = [{
        "id": bookshelf_book.book.id,
        "title": bookshelf_book.book.title,
        "author": bookshelf_book.book.author,
        "coverPicture": bookshelf_book.book.coverPicture,
        "addedAt": bookshelf_book.addedAt.isoformat(),
        "orderInShelf": bookshelf_book.orderInShelf
    } for bookshelf_book in bookshelf_books]


    return jsonify({
        "id": bookshelf.id,
        "name": bookshelf.name,
        "userId": bookshelf.userId,
        "createdAt": bookshelf.createdAt,
        "updatedAt": bookshelf.updatedAt,
        "Books": books 
    }), 200




# Edit a Bookshelf
@bookshelf_routes.route('/<int:id>', methods=['PUT'])
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
@bookshelf_routes.route('/<int:id>/update-order', methods=['PUT'])
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



# Add a Book to a Bookshelf
@bookshelf_routes.route('/<int:bookshelf_id>/books/<int:book_id>', methods=['POST'])
@login_required
def add_book_to_bookshelf(bookshelf_id, book_id):
    """
    Adds a book to a specific bookshelf by its ID.
    """
    # Get the bookshelf by ID
    bookshelf = Bookshelf.query.get(bookshelf_id)
    if not bookshelf:
        return jsonify({"message": "Bookshelf not found"}), 404

    # Only the bookshelf owner can add books
    if bookshelf.userId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    # Get the book by ID
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    # Check if the book is already in the bookshelf
    existing_entry = BookshelfBook.query.filter_by(bookshelfId=bookshelf_id, bookId=book_id).first()
    if existing_entry:
        return jsonify({"message": "Book is already in the bookshelf"}), 400

    # Create a new BookshelfBook entry to associate the book with the bookshelf
    new_bookshelf_book = BookshelfBook(
        bookshelfId=bookshelf_id,
        bookId=book_id,
        addedAt=datetime.utcnow(),
        orderInShelf=None  # You can leave this as None initially and update it later if needed
    )
    
    db.session.add(new_bookshelf_book)
    db.session.commit()

    # If the book is added to the "read" shelf, create a community post
    if bookshelf.name == "read":
        # Create a default review text
        post = CommunityPost(
            userId=current_user.id,
            bookId=book_id,
            bookshelfId=bookshelf_id,
            reviewText=f"I just finished reading '{book.title}' by {book.author}. Highly recommend!",
            rating=5,  # Default rating
            createdAt=datetime.utcnow(),
            updatedAt=datetime.utcnow()
        )
        db.session.add(post)
        db.session.commit()

    return jsonify({
        "message": "Book successfully added to the bookshelf",
        "bookshelf_id": bookshelf.id,
        "book_id": book.id
    }), 201




# Remove a book from a Bookshelf
@bookshelf_routes.route('/<int:id>/books/<int:book_id>', methods=['DELETE'])
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
@bookshelf_routes.route('/<int:id>', methods=['DELETE'])
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
