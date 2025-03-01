from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
# from sqlalchemy import Enum
# import enum

# Enum class for reactions
# class ReactionTypeEnum(enum.Enum):
#     LIKE = "like"
#     COMMENT = "comment"

class CommunityComment(db.Model):
    __tablename__ = 'community_comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    activityId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("community_posts.id")), nullable=False)
    like = db.Column(db.Boolean, default=False)
    comment = db.Column(db.Text, nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    community_post = db.relationship('CommunityPost', backref='comments_post')
    user = db.relationship('User', back_populates='community_comments')

    def __repr__(self):
        return f"<CommunityComment(id={self.id}, userId={self.userId}, activityId={self.activityId}, reactionType={self.reactionType})>"