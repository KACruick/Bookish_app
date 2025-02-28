from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/', methods=['PUT'])
@login_required
def edit_user():
    """
    Edit the currently logged-in user's profile.
    Update username, password, and profile picture.
    """
    # Check if the user is authenticated
    if not current_user.is_authenticated:
        return {'errors': {'message': 'Unauthorized'}}, 401

    data = request.get_json()

    # Validation checks
    errors = {}
    
    # Check for missing fields
    if not data.get('username'):
        errors['username'] = 'Username is required'
    if not data.get('password'):
        errors['password'] = 'Password is required'
    

    if errors:
        return {'message': 'Bad Request', 'errors': errors}, 400

    # Check if the new username or email already exists in the system
    existing_user_by_username = User.query.filter_by(username=data['username']).first()
    if existing_user_by_username and existing_user_by_username.id != current_user.id:
        return {'message': 'User already exists', 'errors': {'username': 'User with that username already exists'}}, 500

    # Assuming we allow users to update their password if they provide a new one
    user = current_user  # Current logged-in user
    user.username = data['username']
    user.password = data['password']  # You may want to hash the password before saving
    user.profilePicture = data['profilePicture']  # Assuming this field exists on the User model

    # Commit the changes to the database
    db.session.commit()

    # Respond with the updated user data
    return jsonify({
        'user': {
            'id': user.id,
            'firstName': user.firstName,
            'lastName': user.lastName,
            'email': user.email,
            'username': user.username,
            'profilePicture': user.profilePicture
        }
    }), 201