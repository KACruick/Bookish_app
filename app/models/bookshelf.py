from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Bookshelf(db.Model):
    __tablename__ = 'bookshelves'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # Many-to-many relationship with books
    user = db.relationship('User', backref='user_bookshelves')  
    books = db.relationship(
        'Book',
        secondary='bookshelf_books', 
        back_populates='bookshelves',  

    )

    def __repr__(self):
        return f"<Bookshelf id={self.id}, name='{self.name}', userId={self.userId}>"