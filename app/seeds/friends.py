from app.models import db, Friend, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_friends():
    # Get existing users from the database
    kendra = User.query.filter_by(email='Kendra.Cruick@io.com').first()
    olivia = User.query.filter_by(email='Olivia.Rod@io.com').first()
    jaime = User.query.filter_by(email='Jaime.Cruick@io.com').first()
    laura = User.query.filter_by(email='Laura.Kern@io.com').first()
    donna = User.query.filter_by(email='Donna.Lie@io.com').first()

    # Create Friendships between users
    # Kendra and Olivia
    friend1 = Friend(userId=kendra.id, friendId=olivia.id, status='accepted')
    # Kendra and Jaime
    friend2 = Friend(userId=kendra.id, friendId=jaime.id, status='accepted')
    # Kendra and Laura
    friend3 = Friend(userId=kendra.id, friendId=laura.id, status='accepted')
    # Kendra and Donna
    friend4 = Friend(userId=kendra.id, friendId=donna.id, status='accepted')
    
    # Olivia and Jaime
    friend5 = Friend(userId=olivia.id, friendId=jaime.id, status='accepted')
    # Olivia and Laura (excluded in your request)
    friend6 = Friend(userId=olivia.id, friendId=laura.id, status='accepted') # Do not create this friendship
    # Olivia and Donna (excluded in your request)
    # friend7 = Friend(userId=olivia.id, friendId=donna.id, status='accepted') # Do not create this friendship
    
    # Jaime and Laura
    friend8 = Friend(userId=jaime.id, friendId=laura.id, status='accepted')
    # Jaime and Donna
    friend9 = Friend(userId=jaime.id, friendId=donna.id, status='accepted')
    
    # Laura and Donna
    # friend10 = Friend(userId=laura.id, friendId=donna.id, status='accepted') # Do not create this friendship
    
    # Add the friends to the session
    db.session.add_all([friend1, friend2, friend3, friend4, friend5, friend6, friend8, friend9])
    

    # Commit the changes to the database
    db.session.commit()
    print("Friends have been seeded!")

def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))
      
    db.session.commit()