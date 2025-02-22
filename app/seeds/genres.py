from app.models import db, Genre, environment, SCHEMA
from sqlalchemy.sql import text

def seed_genres():
    genres = [
        Genre(name='Fantasy'),
        Genre(name='Science Fiction'),
        Genre(name='Romance'),
        Genre(name='Young Adult'),
        Genre(name='Children'),
        Genre(name='Mystery'),
        Genre(name='Horror'),
        Genre(name='Historical Fiction'),
        Genre(name='Biography'),
        Genre(name='Self Help')
    ]

    for genre in genres:
            db.session.add(genre)

    db.session.commit()




def undo_genres():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.genres RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM genres"))
      
    db.session.commit()