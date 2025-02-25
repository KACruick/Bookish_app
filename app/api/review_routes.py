from flask import Blueprint, request, jsonify
from app.models import db, Book, Review
from flask_login import current_user, login_required
from datetime import datetime

review_routes = Blueprint('reviews', __name__)

# Get all reviews of a book
@review_routes.route('/api/reviews/<int:bookId>', methods=['GET'])
def get_reviews(bookId):
    """
    Returns all reviews written for a specific book.
    """
    book = Book.query.get(bookId)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    reviews = Review.query.filter_by(bookId=bookId).all()
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

    return jsonify({"reviews": review_data})


# Add a review
@review_routes.route('/api/reviews/<int:bookId>', methods=['POST'])
@login_required
def add_review(bookId):
    """
    Allows a user to add a review for a book.
    """
    data = request.get_json()
    
    # Check if the book exists
    book = Book.query.get(bookId)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    # Check if the user already has a review for the book
    existing_review = Review.query.filter_by(bookId=bookId, userId=current_user.id).first()
    if existing_review:
        return jsonify({"message": "User already has a review for this product"}), 500

    # Validate input data
    if not data.get('review') or not isinstance(data.get('rating'), int) or not (1 <= data.get('rating') <= 5):
        return jsonify({
            "message": "Bad Request",
            "errors": {
                "review": "Review text is required",
                "rating": "Rating must be an integer from 1 to 5"
            }
        }), 400

    # Create the new review
    new_review = Review(
        bookId=bookId,
        userId=current_user.id,
        review=data['review'],
        rating=data['rating'],
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow()
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "id": new_review.id,
        "bookId": new_review.bookId,
        "userId": new_review.userId,
        "review": new_review.review,
        "rating": new_review.rating,
        "createdAt": new_review.createdAt,
        "updatedAt": new_review.updatedAt
    }), 201


# Edit a review
@review_routes.route('/api/reviews/<int:id>', methods=['PATCH'])
@login_required
def edit_review(id):
    """
    Updates an existing review for a book. The review must belong to the current user.
    """
    review = Review.query.get(id)
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404

    # Check if the current user is the owner of the review
    if review.userId != current_user.id:
        return jsonify({"message": "Unauthorized to edit this review"}), 403

    data = request.get_json()

    # Validate the data
    if not data.get('review') or not isinstance(data.get('rating'), int) or not (1 <= data.get('rating') <= 5):
        return jsonify({
            "message": "Bad Request",
            "errors": {
                "review": "Review text is required",
                "rating": "Rating must be an integer from 1 to 5"
            }
        }), 400

    # Update the review
    review.review = data['review']
    review.rating = data['rating']
    review.updatedAt = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "id": review.id,
        "bookId": review.bookId,
        "userId": review.userId,
        "review": review.review,
        "rating": review.rating,
        "createdAt": review.createdAt,
        "updatedAt": review.updatedAt
    }), 200


# Delete a review
@review_routes.route('/api/reviews/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    """
    Deletes an existing review. The review must belong to the current user.
    """
    review = Review.query.get(id)
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404

    # Check if the current user is the owner of the review
    if review.userId != current_user.id:
        return jsonify({"message": "Unauthorized to delete this review"}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200
