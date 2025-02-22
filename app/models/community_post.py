from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy import Enum
import enum

class ActivityTypeEnum(enum.Enum):
    add_tbr = "add_tbr"
    add_reading = "add_reading"
    add_read = "add_read"
    rate = "rate"
    review = "review"
    update_status = "update_status"

class CommunityPost(db.Model):
    __tablename__ = 'community_posts'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    activityType = db.Column(Enum(ActivityTypeEnum), nullable=False)
    bookId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("books.id")), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    reviewText = db.Column(db.Text, nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('User', backref=db.backref('community_posts', lazy=True))
    book = db.relationship('Book', backref=db.backref('community_posts', lazy=True))

    def __repr__(self):
        return f"<CommunityPost(id={self.id}, userId={self.userId}, bookId={self.bookId}, activityType={self.activityType})>"
