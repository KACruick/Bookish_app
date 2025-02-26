from app.models import db, BookshelfBook, environment, SCHEMA
from sqlalchemy.sql import text


    # bookshelfId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('bookshelves.id')), nullable=False)
    # bookId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('books.id')), nullable=False)
    # addedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    # orderInShelf = db.Column(db.Integer)

def seed_bookshelf_books():
    bookshelf_books = [
            # Kendra's shelves
            BookshelfBook(bookshelfId=1, bookId=1, orderInShelf=3), 
            BookshelfBook(bookshelfId=1, bookId=2, orderInShelf=5),
            BookshelfBook(bookshelfId=1, bookId=3, orderInShelf=7),
            BookshelfBook(bookshelfId=1, bookId=4, orderInShelf=2),
            BookshelfBook(bookshelfId=1, bookId=5, orderInShelf=9),
            BookshelfBook(bookshelfId=1, bookId=6, orderInShelf=4),
            BookshelfBook(bookshelfId=1, bookId=7, orderInShelf=6),
            BookshelfBook(bookshelfId=1, bookId=8, orderInShelf=1),
            BookshelfBook(bookshelfId=1, bookId=9, orderInShelf=8),
            BookshelfBook(bookshelfId=1, bookId=10, orderInShelf=10),

            BookshelfBook(bookshelfId=2, bookId=11, orderInShelf=3),
            BookshelfBook(bookshelfId=2, bookId=12, orderInShelf=5),
            BookshelfBook(bookshelfId=2, bookId=13, orderInShelf=1),
            BookshelfBook(bookshelfId=2, bookId=14, orderInShelf=7),
            BookshelfBook(bookshelfId=2, bookId=15, orderInShelf=9),
            BookshelfBook(bookshelfId=2, bookId=16, orderInShelf=4),
            BookshelfBook(bookshelfId=2, bookId=17, orderInShelf=6),
            BookshelfBook(bookshelfId=2, bookId=18, orderInShelf=8),
            BookshelfBook(bookshelfId=2, bookId=19, orderInShelf=2),
            BookshelfBook(bookshelfId=2, bookId=20, orderInShelf=10),

            BookshelfBook(bookshelfId=3, bookId=21, orderInShelf=3),
            BookshelfBook(bookshelfId=3, bookId=22, orderInShelf=5),
            BookshelfBook(bookshelfId=3, bookId=23, orderInShelf=7),
            BookshelfBook(bookshelfId=3, bookId=24, orderInShelf=2),
            BookshelfBook(bookshelfId=3, bookId=25, orderInShelf=9),
            BookshelfBook(bookshelfId=3, bookId=26, orderInShelf=4),
            BookshelfBook(bookshelfId=3, bookId=27, orderInShelf=6),
            BookshelfBook(bookshelfId=3, bookId=28, orderInShelf=1),
            BookshelfBook(bookshelfId=3, bookId=29, orderInShelf=8),
            BookshelfBook(bookshelfId=3, bookId=30, orderInShelf=10), 

            # Olivia's shelves
            BookshelfBook(bookshelfId=4, bookId=31, orderInShelf=3),
            BookshelfBook(bookshelfId=4, bookId=32, orderInShelf=5),
            BookshelfBook(bookshelfId=4, bookId=33, orderInShelf=7),
            BookshelfBook(bookshelfId=4, bookId=34, orderInShelf=2),
            BookshelfBook(bookshelfId=4, bookId=35, orderInShelf=9),
            BookshelfBook(bookshelfId=4, bookId=36, orderInShelf=4),
            BookshelfBook(bookshelfId=4, bookId=37, orderInShelf=6),
            BookshelfBook(bookshelfId=4, bookId=38, orderInShelf=8),
            BookshelfBook(bookshelfId=4, bookId=39, orderInShelf=1),
            BookshelfBook(bookshelfId=4, bookId=40, orderInShelf=10),

            BookshelfBook(bookshelfId=5, bookId=1, orderInShelf=3),
            BookshelfBook(bookshelfId=5, bookId=2, orderInShelf=5),
            BookshelfBook(bookshelfId=5, bookId=3, orderInShelf=7),
            BookshelfBook(bookshelfId=5, bookId=4, orderInShelf=2),
            BookshelfBook(bookshelfId=5, bookId=5, orderInShelf=9),
            BookshelfBook(bookshelfId=5, bookId=6, orderInShelf=4),
            BookshelfBook(bookshelfId=5, bookId=7, orderInShelf=6),
            BookshelfBook(bookshelfId=5, bookId=8, orderInShelf=1),
            BookshelfBook(bookshelfId=5, bookId=9, orderInShelf=8),
            BookshelfBook(bookshelfId=5, bookId=10, orderInShelf=10),

            BookshelfBook(bookshelfId=6, bookId=1, orderInShelf=3),
            BookshelfBook(bookshelfId=6, bookId=2, orderInShelf=5),
            BookshelfBook(bookshelfId=6, bookId=3, orderInShelf=7),
            BookshelfBook(bookshelfId=6, bookId=4, orderInShelf=2),
            BookshelfBook(bookshelfId=6, bookId=5, orderInShelf=9),
            BookshelfBook(bookshelfId=6, bookId=6, orderInShelf=4),
            BookshelfBook(bookshelfId=6, bookId=7, orderInShelf=6),
            BookshelfBook(bookshelfId=6, bookId=8, orderInShelf=1),
            BookshelfBook(bookshelfId=6, bookId=9, orderInShelf=8),
            BookshelfBook(bookshelfId=6, bookId=10, orderInShelf=10),

            # Jaime's shelves
            BookshelfBook(bookshelfId=7, bookId=11, orderInShelf=3),
            BookshelfBook(bookshelfId=7, bookId=12, orderInShelf=5),
            BookshelfBook(bookshelfId=7, bookId=13, orderInShelf=7),
            BookshelfBook(bookshelfId=7, bookId=14, orderInShelf=2),
            BookshelfBook(bookshelfId=7, bookId=15, orderInShelf=9),
            BookshelfBook(bookshelfId=7, bookId=16, orderInShelf=4),
            BookshelfBook(bookshelfId=7, bookId=17, orderInShelf=6),
            BookshelfBook(bookshelfId=7, bookId=18, orderInShelf=8),
            BookshelfBook(bookshelfId=7, bookId=19, orderInShelf=1),
            BookshelfBook(bookshelfId=7, bookId=20, orderInShelf=10),

            BookshelfBook(bookshelfId=8, bookId=21, orderInShelf=3),
            BookshelfBook(bookshelfId=8, bookId=22, orderInShelf=5),
            BookshelfBook(bookshelfId=8, bookId=23, orderInShelf=7),
            BookshelfBook(bookshelfId=8, bookId=24, orderInShelf=2),
            BookshelfBook(bookshelfId=8, bookId=25, orderInShelf=9),
            BookshelfBook(bookshelfId=8, bookId=26, orderInShelf=4),
            BookshelfBook(bookshelfId=8, bookId=27, orderInShelf=6),
            BookshelfBook(bookshelfId=8, bookId=28, orderInShelf=1),
            BookshelfBook(bookshelfId=8, bookId=29, orderInShelf=8),
            BookshelfBook(bookshelfId=8, bookId=30, orderInShelf=10),

            BookshelfBook(bookshelfId=9, bookId=31, orderInShelf=3),
            BookshelfBook(bookshelfId=9, bookId=32, orderInShelf=5),
            BookshelfBook(bookshelfId=9, bookId=33, orderInShelf=7),
            BookshelfBook(bookshelfId=9, bookId=34, orderInShelf=2),
            BookshelfBook(bookshelfId=9, bookId=35, orderInShelf=9),
            BookshelfBook(bookshelfId=9, bookId=36, orderInShelf=4),
            BookshelfBook(bookshelfId=9, bookId=37, orderInShelf=6),
            BookshelfBook(bookshelfId=9, bookId=38, orderInShelf=8),
            BookshelfBook(bookshelfId=9, bookId=39, orderInShelf=1),
            BookshelfBook(bookshelfId=9, bookId=40, orderInShelf=10),

            # Laura's shelves
            BookshelfBook(bookshelfId=10, bookId=1, orderInShelf=3),
            BookshelfBook(bookshelfId=10, bookId=2, orderInShelf=5),
            BookshelfBook(bookshelfId=10, bookId=3, orderInShelf=7),
            BookshelfBook(bookshelfId=10, bookId=4, orderInShelf=2),
            BookshelfBook(bookshelfId=10, bookId=5, orderInShelf=9),
            BookshelfBook(bookshelfId=10, bookId=6, orderInShelf=4),
            BookshelfBook(bookshelfId=10, bookId=7, orderInShelf=6),
            BookshelfBook(bookshelfId=10, bookId=8, orderInShelf=1),
            BookshelfBook(bookshelfId=10, bookId=9, orderInShelf=8),
            BookshelfBook(bookshelfId=10, bookId=10, orderInShelf=10),

            BookshelfBook(bookshelfId=11, bookId=11, orderInShelf=3),
            BookshelfBook(bookshelfId=11, bookId=12, orderInShelf=5),
            BookshelfBook(bookshelfId=11, bookId=13, orderInShelf=7),
            BookshelfBook(bookshelfId=11, bookId=14, orderInShelf=2),
            BookshelfBook(bookshelfId=11, bookId=15, orderInShelf=9),
            BookshelfBook(bookshelfId=11, bookId=16, orderInShelf=4),
            BookshelfBook(bookshelfId=11, bookId=17, orderInShelf=6),
            BookshelfBook(bookshelfId=11, bookId=18, orderInShelf=8),
            BookshelfBook(bookshelfId=11, bookId=19, orderInShelf=1),
            BookshelfBook(bookshelfId=11, bookId=20, orderInShelf=10),

            BookshelfBook(bookshelfId=12, bookId=21, orderInShelf=3),
            BookshelfBook(bookshelfId=12, bookId=22, orderInShelf=5),
            BookshelfBook(bookshelfId=12, bookId=23, orderInShelf=7),
            BookshelfBook(bookshelfId=12, bookId=24, orderInShelf=2),
            BookshelfBook(bookshelfId=12, bookId=25, orderInShelf=9),
            BookshelfBook(bookshelfId=12, bookId=26, orderInShelf=4),
            BookshelfBook(bookshelfId=12, bookId=27, orderInShelf=6),
            BookshelfBook(bookshelfId=12, bookId=28, orderInShelf=1),
            BookshelfBook(bookshelfId=12, bookId=29, orderInShelf=8),
            BookshelfBook(bookshelfId=12, bookId=30, orderInShelf=10),

            # Donna's shelves
            BookshelfBook(bookshelfId=13, bookId=31, orderInShelf=3),
            BookshelfBook(bookshelfId=13, bookId=32, orderInShelf=5),
            BookshelfBook(bookshelfId=13, bookId=33, orderInShelf=7),
            BookshelfBook(bookshelfId=13, bookId=34, orderInShelf=2),
            BookshelfBook(bookshelfId=13, bookId=35, orderInShelf=9),
            BookshelfBook(bookshelfId=13, bookId=36, orderInShelf=4),
            BookshelfBook(bookshelfId=13, bookId=37, orderInShelf=6),
            BookshelfBook(bookshelfId=13, bookId=38, orderInShelf=8),
            BookshelfBook(bookshelfId=13, bookId=39, orderInShelf=1),
            BookshelfBook(bookshelfId=13, bookId=40, orderInShelf=10),

            BookshelfBook(bookshelfId=14, bookId=1, orderInShelf=3),
            BookshelfBook(bookshelfId=14, bookId=2, orderInShelf=5),
            BookshelfBook(bookshelfId=14, bookId=3, orderInShelf=7),
            BookshelfBook(bookshelfId=14, bookId=4, orderInShelf=2),
            BookshelfBook(bookshelfId=14, bookId=5, orderInShelf=9),
            BookshelfBook(bookshelfId=14, bookId=6, orderInShelf=4),
            BookshelfBook(bookshelfId=14, bookId=7, orderInShelf=6),
            BookshelfBook(bookshelfId=14, bookId=8, orderInShelf=1),
            BookshelfBook(bookshelfId=14, bookId=9, orderInShelf=8),
            BookshelfBook(bookshelfId=14, bookId=10, orderInShelf=10),

            BookshelfBook(bookshelfId=15, bookId=11, orderInShelf=3),
            BookshelfBook(bookshelfId=15, bookId=12, orderInShelf=5),
            BookshelfBook(bookshelfId=15, bookId=13, orderInShelf=7),
            BookshelfBook(bookshelfId=15, bookId=14, orderInShelf=2),
            BookshelfBook(bookshelfId=15, bookId=15, orderInShelf=9),
            BookshelfBook(bookshelfId=15, bookId=16, orderInShelf=4),
            BookshelfBook(bookshelfId=15, bookId=17, orderInShelf=6),
            BookshelfBook(bookshelfId=15, bookId=18, orderInShelf=8),
            BookshelfBook(bookshelfId=15, bookId=19, orderInShelf=1),
            BookshelfBook(bookshelfId=15, bookId=20, orderInShelf=10),
        ]

    for book in bookshelf_books:
            db.session.add(book)

    db.session.commit()
    print("Bookshelf books have been seeded!")



def undo_bookshelf_books():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bookshelf_books RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM Bookshelf_books"))
      
    db.session.commit()