from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class BookclubMember(db.Model):
    __tablename__ = 'bookclub_members'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    bookclubId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("bookclubs.id")), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    joinedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships
    bookclub = db.relationship('Bookclub', backref='memberships', lazy=True)
    user = db.relationship('User', backref='bookclub_members', lazy=True)

    def __repr__(self):
        return f"<BookclubMember id={self.id}, bookclubId={self.bookclubId}, userId={self.userId}>"