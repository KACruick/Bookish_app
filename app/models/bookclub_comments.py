from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class BookclubComment(db.Model):
    __tablename__ = 'bookclub_comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    bookclubId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('bookclubs.id')), nullable=False)
    bookId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('books.id')), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    chapter = db.Column(db.Integer, nullable=True)  # You can store chapter number or whatever makes sense
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    # Relationships
    bookclub = db.relationship('Bookclub', backref='bookclub_comments_reverse', lazy=True)
    book = db.relationship('Book', backref='bookclub_comment_for_books', lazy=True)
    user = db.relationship('User', backref='user_bookclub_comments_reverse', lazy=True)

    def __repr__(self):
        return f"<BookclubComment id={self.id}, bookclubId={self.bookclubId}, bookId={self.bookId}, userId={self.userId}, chapter={self.chapter}>"