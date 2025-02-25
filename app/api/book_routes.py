from flask import Blueprint, request, jsonify
from app.models import User, db, Book, Review
from flask_login import current_user, login_required
from datetime import datetime

book_routes = Blueprint('books', __name__)

