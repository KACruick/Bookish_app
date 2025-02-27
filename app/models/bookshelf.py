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
    books = db.relationship(
        'Book',
        secondary='bookshelf_books',
        back_populates='bookshelves',
        # primaryjoin="Bookshelf.id == bookshelf_books.bookshelfId",  # Join condition for Bookshelf and BookshelfBook
        # secondaryjoin="Book.id == bookshelf_books.bookId"  # Join condition for Book and BookshelfBook
    )

    def __repr__(self):
        return f"<Bookshelf id={self.id}, name='{self.name}', userId={self.userId}>"