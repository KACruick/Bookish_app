from flask import Blueprint, request, jsonify
from app.models import db, Book, Review
from flask_login import current_user, login_required
from datetime import datetime

book_routes = Blueprint('books', __name__)
# They all get '/api/books'


# helper function for calculating the average rating
def calculate_avg_rating(book_id):
    # Query all reviews for the given book_id
    reviews = Review.query.filter_by(bookId=book_id).all()

    if reviews:
        # Calculate the sum of all ratings and divide by the number of reviews
        total_rating = sum(review.rating for review in reviews)
        avg_rating = total_rating / len(reviews)
        return round(avg_rating, 1)  # Round to 1 decimal place
    return 0  # Return 0 if no reviews exist


# Get all books
@book_routes.route('/', methods=['GET'])
def get_books():
    """
    Returns all books
    """
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 20, type= int)
    
    # Query all books and paginate the result
    books_query = Book.query

    # Paginate the books
    books_paginated = books_query.paginate(page=page, per_page=size, error_out=False)
    
    # Prepare list of books to return
    book_list = []
    
    for book in books_paginated.items:
        reviews = Review.query.filter_by(bookId=book.id).all()
        review_data = [
            {
                "id": review.id,
                "bookId": review.bookId,
                "userId": review.userId,
                "review": review.review,
                "rating": review.rating,
                "createdAt": review.createdAt,
                "updatedAt": review.updatedAt
            }
            for review in reviews
        ]

        # Calculate average rating using the helper function
        avg_rating = calculate_avg_rating(book.id)
        
        book_data = {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "description": book.description,
            "userId": book.userId,
            "genreId": book.genreId,
            "isbn": book.isbn,
            "pages": book.pages,
            "chapters": book.chapters,
            "coverPicture": book.coverPicture,
            "published": book.yearPublished,
            "createdAt": book.createdAt,
            "updatedAt": book.updatedAt,
            "avgRating": avg_rating,
            "numReviews": len(reviews),
            "reviews": review_data
        }
        
        book_list.append(book_data)
    
    return jsonify({
        'Books': book_list,
        'page': page,
        'size': size,
        })



# Get a specific book
@book_routes.route('<int:id>', methods=['GET'])
def get_book_details(id):
    """
    Returns details of a specific book by its id.
    """
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    reviews = Review.query.filter_by(bookId=book.id).all()
    review_data = [
        {
            "id": review.id,
            "bookId": review.bookId,
            "userId": review.userId,
            "review": review.review,
            "rating": review.rating,
            "createdAt": review.createdAt,
            "updatedAt": review.updatedAt
        }
        for review in reviews
    ]

    # Calculate average rating using the helper function
    avg_rating = calculate_avg_rating(book.id)
    
    book_data = {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "description": book.description,
        "userId": book.userId,
        "genreId": book.genreId,
        "isbn": book.isbn,
        "pages": book.pages,
        "chapters": book.chapters,
        "coverPicture": book.coverPicture,
        "published": book.yearPublished,
        "createdAt": book.createdAt,
        "updatedAt": book.updatedAt,
        "avgRating": avg_rating,
        "numReviews": len(reviews),
        "reviews": review_data
    }

    return jsonify(book_data)



# Create a new book
@book_routes.route('/', methods=['POST'])
@login_required
def create_book():
    """
    Creates a new book entry in the system.
    """
    data = request.get_json()
    errors = {}

    # Validate input data
    if not data.get('title'):
        errors['title'] = 'Title is required'
    if not data.get('author'):
        errors['author'] = 'Author is required'
    if not data.get('description'):
        errors['description'] = 'Description is required'
    if not data.get('genreId'):
        errors['genreId'] = 'Genre is required'
    if not data.get('isbn'):
        errors['isbn'] = 'ISBN is required'
    if not data.get('pages'):
        errors['pages'] = 'Pages is required'
    if not data.get('chapters'):
        errors['chapters'] = 'Chapters is required'
    if not data.get('coverPicture'):
        errors['coverPicture'] = 'Cover picture is required'
    if not data.get('published'):
        errors['published'] = 'Published date is required'

    if errors:
        return jsonify({'message': 'Bad Request', 'errors': errors}), 400

    # Create a new book
    book = Book(
        title=data['title'],
        author=data['author'],
        description=data['description'],
        genreId=data['genreId'],
        isbn=data['isbn'],
        pages=data['pages'],
        chapters=data['chapters'],
        coverPicture=data['coverPicture'],
        yearPublished=data['published'],
        userId=current_user.id,  # The book is associated with the logged-in user
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow()
    )
    db.session.add(book)
    db.session.commit()

    return jsonify({
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "description": book.description,
        "userId": book.userId,
        "genreId": book.genreId,
        "isbn": book.isbn,
        "pages": book.pages,
        "chapters": book.chapters,
        "coverPicture": book.coverPicture,
        "published": book.published,
        "createdAt": book.createdAt,
        "updatedAt": book.updatedAt
    }), 201



# Update a book
@book_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_book(id):
    """
    Updates the details of an existing book.
    """
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    if book.userId != current_user.id:
        return jsonify({"message": "Unauthorized to update this book"}), 403

    data = request.get_json()

    # Update fields
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.description = data.get('description', book.description)
    book.genreId = data.get('genreId', book.genreId)
    book.isbn = data.get('isbn', book.isbn)
    book.pages = data.get('pages', book.pages)
    book.chapters = data.get('chapters', book.chapters)
    book.coverPicture = data.get('coverPicture', book.coverPicture)
    book.published = data.get('published', book.published)
    book.updatedAt = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "description": book.description,
        "userId": book.userId,
        "genreId": book.genreId,
        "isbn": book.isbn,
        "pages": book.pages,
        "chapters": book.chapters,
        "coverPicture": book.coverPicture,
        "published": book.published,
        "createdAt": book.createdAt,
        "updatedAt": book.updatedAt
    }), 200



# Delete a book
@book_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_book(id):
    """
    Deletes an existing book from the system.
    """
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    if book.userId != current_user.id:
        return jsonify({"message": "Unauthorized to delete this book"}), 403

    db.session.delete(book)
    db.session.commit()

    return jsonify({"message": "Book successfully deleted"}), 200