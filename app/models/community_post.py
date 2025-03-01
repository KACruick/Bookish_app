from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
# from sqlalchemy import Enum as SQLAlchemyEnum
# from enum import Enum

# class ActivityTypeEnum(Enum):
#     add_tbr = "add_tbr"
#     add_reading = "add_reading"
#     add_read = "add_read"
#     rate = "rate"
#     review = "review"
#     update_status = "update_status"

class CommunityPost(db.Model):
    __tablename__ = 'community_posts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    # activityType = db.Column(SQLAlchemyEnum(ActivityTypeEnum), nullable=False)
    bookId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("books.id")), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    reviewText = db.Column(db.Text, nullable=True)
    bookshelfId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("bookshelves.id")), nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    #relationships
    user = db.relationship('User', backref='user_posts')
    book = db.relationship('Book', backref='book_in_community_posts')
    bookshelf = db.relationship('Bookshelf', back_populates='community_posts')
    community_comments = db.relationship('CommunityComment', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<CommunityPost(id={self.id}, userId={self.userId}, bookId={self.bookId}, bookshelfId={self.bookshelfId})>"
