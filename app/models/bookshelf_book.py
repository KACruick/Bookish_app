from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class BookshelfBook(db.Model):
    __tablename__ = 'bookshelf_books'

    id = db.Column(db.Integer, primary_key=True)
    bookshelfId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('bookshelves.id')), nullable=False)
    bookId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('books.id')), nullable=False)
    addedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    orderInShelf = db.Column(db.Integer)

    # Relationships
    # bookshelf = db.relationship('Bookshelf', backref='bookshelf_books')
    # book = db.relationship('Book', backref='bookshelves_books')

    def __repr__(self):
        return f"<BookshelfBooks id={self.id}, bookshelfId={self.bookshelfId}, bookId={self.bookId}>"