from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Review(db.Model):
    __tablename__= 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    bookId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('books.id')), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    review = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    # relationships here
    # book = db.relationship('Book', back_populates='reviews')
    # user = db.relationship('User', backref='review_author', lazy=True)

    def __repr__(self):
        return f"<Review id={self.id}, bookId={self.bookId}, userId={self.userId}, review='{self.review}', rating={self.rating}, createdAt={self.createdAt}>"