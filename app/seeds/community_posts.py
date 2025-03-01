from app.models import db, CommunityPost, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text
# from enum import Enum

# class ActivityTypeEnum(Enum):
#     add_tbr = "add_tbr"
#     add_reading = "add_reading"
#     add_read = "add_read"
#     rate = "rate"
#     review = "review"
#     update_status = "update_status"

def seed_community_posts():
    posts = [
        CommunityPost(userId=1, bookId=1, bookshelfId=3, createdAt=datetime.strptime("2025-02-02 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityPost(userId=2, bookId=5, bookshelfId=5, createdAt=datetime.strptime("2025-02-12 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityPost(userId=3, bookId=10, rating=4, createdAt=datetime.strptime("2025-02-22 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityPost(userId=4, bookId=3, reviewText="A wonderful, thought-provoking book!", createdAt=datetime.strptime("2025-02-05 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityPost(userId=5, bookId=7, bookshelfId=13, createdAt=datetime.strptime("2025-02-14 09:00:00", "%Y-%m-%d %H:%M:%S"))
    ]

    for post in posts:
            db.session.add(post)

    db.session.commit()
    print("Community posts have been seeded!")

def undo_community_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.community_posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM community posts"))
      
    db.session.commit()