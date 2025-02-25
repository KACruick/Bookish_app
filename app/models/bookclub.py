from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Bookclub(db.Model):
    __tablename__ = 'bookclubs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    bookId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("books.id")), nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships
    owner = db.relationship('User', backref='bookclubs_owned', lazy=True)
    book = db.relationship('Book', backref='bookclub_books', lazy=True)
    members = db.relationship('User', secondary=add_prefix_for_prod('bookclub_members'), back_populates='bookclubs')
    comments = db.relationship('BookclubComment', backref='bookclub_comments', lazy=True)

    
    def __repr__(self):
        return f"<Bookclub id={self.id}, name='{self.name}', ownerId={self.ownerId}, createdAt={self.createdAt}>"
