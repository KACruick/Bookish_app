from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    kendra = User(
        firstName="Kendra",
        lastName="Cruic",
        username='Researcher056', 
        email='Kendra.Cruick@io.com', 
        password='password1',
        profilePicture="../images/profile-icons/bunny.png"
        )
    olivia = User(
        firstName="Olivia",
        lastName="Rod",
        username='LivLaughLove', 
        email='Olivia.Rod@io.com', 
        password='password2',
        profilePicture="../images/profile-icons/chicken.png"
        )
    jaime = User(
        firstName="Jaime",
        lastName="Cruick",
        username='JaimeClimber26',
        email='Jaime.Cruick@io.com', 
        password='password3',
        profilePicture="../images/profile-icon/horse.png"
        )
    laura = User(
        firstName="Laura",
        lastName="Kern",
        username='PsycStudent4Ever', 
        email='Laura.Kern@io.com', 
        password='password4',
        profilePicture="../images/profile-icon/dog.png"
        )
    donna = User(
        firstName="Donna",
        lastName="Lie",
        username='DJcrafts29', 
        email='Donna@Lie@io.com', 
        password='password5',
        profilePicture="../images/profile-icon/cat.png"
        )

    db.session.add(kendra)
    db.session.add(olivia)
    db.session.add(jaime)
    db.session.add(laura)
    db.session.add(donna)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
