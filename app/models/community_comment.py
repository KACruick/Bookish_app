from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy import Enum
import enum

# Enum class for reactions
class ReactionTypeEnum(enum.Enum):
    LIKE = "like"
    COMMENT = "comment"

class CommunityComment(db.Model):
    __tablename__ = 'community_comments'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    activityId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("community_posts.id")), nullable=False)
    reactionType = db.Column(Enum(ReactionTypeEnum), nullable=False)  # Updated field to Enum for LIKE or COMMENT
    comment = db.Column(db.Text, nullable=True)  # For actual comment text if the reaction is COMMENT
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    # bookclub = db.relationship('Bookclub', backref='comments', lazy=True)
    # book = db.relationship('Book', backref='bookclub_comments_ref', lazy=True)
    # community_post = db.relationship('CommunityPost', backref='post_comments_reverse', lazy=True)
    # user = db.relationship('User', backref='user_comments_bookclubs', lazy=True)

    def __repr__(self):
        return f"<CommunityComment(id={self.id}, userId={self.userId}, activityId={self.activityId}, reactionType={self.reactionType})>"