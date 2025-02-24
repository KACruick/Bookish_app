from app.models import db, CommunityComment, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_community_comments():
    comments = [
        # Comments for Post 1 (User 1)
        CommunityComment(userId=2, activityId=1, reactionType="COMMENT", comment="I loved that book! Can't wait to read it too.", createdAt=datetime.strptime("2025-02-03 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityComment(userId=3, activityId=1, reactionType="COMMENT", comment="It’s on my TBR list as well!", createdAt=datetime.strptime("2025-02-04 09:00:00", "%Y-%m-%d %H:%M:%S")),

        # Comments for Post 2 (User 2)
        CommunityComment(userId=1, activityId=2, reactionType="COMMENT", comment="Good choice! It's a great read.", createdAt=datetime.strptime("2025-02-13 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityComment(userId=5, activityId=2, reactionType="COMMENT", comment="I’ve heard good things about it. How’s it so far?", createdAt=datetime.strptime("2025-02-14 09:00:00", "%Y-%m-%d %H:%M:%S")),

        # Comments for Post 3 (User 3)
        CommunityComment(userId=4, activityId=3, reactionType="COMMENT", comment="Great rating! Would you recommend it?", createdAt=datetime.strptime("2025-02-23 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityComment(userId=2, activityId=3, reactionType="COMMENT", comment="I enjoyed it too, though it was a bit slow.", createdAt=datetime.strptime("2025-02-24 09:00:00", "%Y-%m-%d %H:%M:%S")),

        # Comments for Post 4 (User 4)
        CommunityComment(userId=1, activityId=4, reactionType="COMMENT", comment="I agree! It’s a deep read.", createdAt=datetime.strptime("2025-02-06 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityComment(userId=3, activityId=4, reactionType="COMMENT", comment="I still need to read that one!", createdAt=datetime.strptime("2025-02-07 09:00:00", "%Y-%m-%d %H:%M:%S")),

        # Comments for Post 5 (User 5)
        CommunityComment(userId=4, activityId=5, reactionType="COMMENT", comment="Congrats on finishing! What's next on your list?", createdAt=datetime.strptime("2025-02-15 09:00:00", "%Y-%m-%d %H:%M:%S")),
        CommunityComment(userId=1, activityId=5, reactionType="COMMENT", comment="Great job! I'm thinking of picking up something similar.", createdAt=datetime.strptime("2025-02-16 09:00:00", "%Y-%m-%d %H:%M:%S"))
    ]

    for comment in comments:
            db.session.add(comment)

    db.session.commit()
    print("Community comments have been seeded!")

def undo_community_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.community comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM community comments"))
      
    db.session.commit()