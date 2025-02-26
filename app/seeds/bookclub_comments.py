from app.models import db, BookclubComment, environment, SCHEMA
from sqlalchemy.sql import text


def seed_bookclub_comments():
    club_comments = [
        BookclubComment(bookclubId=1, bookId=3, userId=1, comment="Can you believe what just happend?!", chapter=10),
        BookclubComment(bookclubId=1, bookId=3, userId=3, comment="I know! I'm so scared to see what happens next.", chapter=10),
        BookclubComment(bookclubId=1, bookId=3, userId=2, comment="Haha, I didn't think it was that bad.", chapter=10),

        BookclubComment(bookclubId=2, bookId=16, userId=3, comment="omg, that was so cute!", chapter=12,),
        BookclubComment(bookclubId=2, bookId=16, userId=4, comment="Right?! I'm loving this story so far", chapter=12),

        BookclubComment(bookclubId=3, bookId=21, userId=5, comment="I'm so bored. Should we pick a different book?", chapter=5),
        BookclubComment(bookclubId=3, bookId=21, userId=1, comment="I'm having a hard time getting into the story too... What book is next on our list?", chapter=5),
    ]

    for comment in club_comments:
            db.session.add(comment)

    db.session.commit()
    print("Bookclub comments have been seeded!")

def undo_bookclub_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bookclub_comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM bookclub comments"))
      
    db.session.commit()