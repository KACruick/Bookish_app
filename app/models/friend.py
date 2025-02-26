from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone
from sqlalchemy import Enum


class Friend(db.Model):
    __tablename__ = 'friends'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    friendId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(Enum('pending', 'accepted', 'rejected', name='friend_status'), nullable=False, default='pending')
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    # Relationships
    # user = db.relationship('User', foreign_keys=[userId], backref='friends_as_user')
    # friend = db.relationship('User', foreign_keys=[friendId], backref='friends_as_friend')

    def __repr__(self):
        return f"<Friend id={self.id}, userId={self.userId}, friendId={self.friendId}, status={self.status}>"
