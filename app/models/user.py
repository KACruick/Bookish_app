from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    profilePicture = db.Column(db.String(500), nullable=True)

    # relationships below
    bookclubs = db.relationship('Bookclub', secondary=add_prefix_for_prod("bookclub_members"), back_populates='members')  # Many-to-Many
    reviews = db.relationship('Review', backref='review_author', lazy=True)  # One-to-Many with Reviews
    book_owner = db.relationship('Book', back_populates='user', cascade='all, delete-orphan')
    bookshelves = db.relationship('Bookshelf', backref='user_shelves', lazy=True)  # One-to-Many with Bookshelves
    bookclub_comments = db.relationship('BookclubComment', backref='bookclub_commentor', lazy=True)


    # # One-to-Many Relationship with Friends
    sent_friends = db.relationship('Friend', foreign_keys='Friend.userId', backref='user_sender', lazy='dynamic')  # One-to-Many with Sent Friends
    received_friends = db.relationship('Friend', foreign_keys='Friend.friendId', backref='user_receiver', lazy='dynamic')  # One-to-Many with Received Friends

    # # community_posts = db.relationship('CommunityPost', backref='user_posts', lazy=True)  # One-to-Many with Community Posts
    # # community_comments = db.relationship('CommunityComment', backref='comment_author', lazy=True)  # One-to-Many with Community Comments


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
