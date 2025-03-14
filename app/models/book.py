from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Book(db.Model):
    __tablename__= 'books'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    genreId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("genres.id")), nullable=False)
    isbn = db.Column(db.BigInteger, nullable=False)
    pages = db.Column(db.Integer, nullable=False)
    chapters = db.Column(db.Integer, nullable=False)
    coverPicture = db.Column(db.String(500), nullable=False)
    yearPublished = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships here
    user = db.relationship('User', back_populates='book_owner')
    genre = db.relationship('Genre', back_populates='genre_relationship')
    bookclubs = db.relationship('Bookclub', backref='book_instance')

    # Relationship through BookshelfBooks
    bookshelves = db.relationship(
        'Bookshelf',
        secondary=add_prefix_for_prod('bookshelf_books'),
        back_populates='books',
    )

    reviews = db.relationship("Review", back_populates="book", cascade="all, delete-orphan") 
    bookclub_comments_list = db.relationship('BookclubComment', backref='book_in_bookclub_comment', cascade="all, delete-orphan")
    community_posts = db.relationship("CommunityPost", back_populates="book", cascade="all, delete-orphan") 

    def __repr__(self):
        return f"<Book id={self.id}, title='{self.title}', author=`{self.author}`, description=`{self.description}`, userId=`{self.userId}`, genreId=`{self.genreId}`, isbn=`{self.isbn}`, pages=`{self.pages}`, chapters=`{self.chapters}`, coverPicture=`{self.coverPicture}`, yearPublished=`{self.yearPublished}` >"