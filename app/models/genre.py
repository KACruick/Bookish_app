from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Genre(db.Model):
    __tablename__= 'genres'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)


    # relationships here
    # books = db.relationship('Book', backref='genre_relationship', lazy=True, overlaps="genre_relationship")

    def __repr__(self):
        return f"<Genre id={self.id}, name='{self.name}'>"