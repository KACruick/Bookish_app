import './AddMemberModal.css'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { addMemberToBookclub } from '../../redux/bookclubs';
import { getFriends } from '../../redux/friends';
import { getBookclub } from '../../redux/bookclubs'; 


function AddMemberModal({ bookclubId }) {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const {closeModal} = useModal();
  
    // Get friends and bookclub members from Redux state
    const friends = useSelector(state => state.friends.friends);  // List of friends
    const bookclubMembers = useSelector(state => state.bookclubs.currentBookclub.members);  // Current bookclub members
    
    console.log("friends: ", friends)

    // Fetch friends list from Redux on modal load
    useEffect(() => {
        console.log("dispatching getFriends action")
      dispatch(getFriends());
    }, [dispatch]);
  
    // Filter out friends who are already members of the bookclub
    const availableFriends = friends.filter(friend => 
      !bookclubMembers.some(member => member.id === friend.id) && // Exclude members already in the bookclub
      friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
    );
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);  // Update search query state
    };
  
    const handleAddMember = async () => {
      if (selectedFriend) {
        try {
            console.log("selectedFriend.id: ", selectedFriend.id)
            await dispatch(addMemberToBookclub(bookclubId, selectedFriend.id));  // Dispatch action to add friend
            closeModal();  // Close the modal after adding the member
            // Trigger the refresh of bookclub details after the new member is added
            await dispatch(getBookclub(bookclubId));
        } catch (error) {
          console.error('Error adding member:', error);
        }
      }
    };
  
    return (
      <div className="add-member-modal">
        <h2>Which friend would you like to add as a member?</h2>
        
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for friends"
        />
        
        {/* Dropdown List of Friends */}
        <ul className="friends-dropdown">
          {availableFriends.length > 0 ? (
            availableFriends.map(friend => (
              <li
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}  // Set the selected friend on click
                className="friend-item"
              >
                {friend.firstName} {friend.lastName}
              </li>
            ))
          ) : (
            <li>No available friends to add</li>
          )}
        </ul>
  
        {/* Display Selected Friend */}
        {selectedFriend && (
          <div>
            <p>Selected Friend: {selectedFriend.firstName} {selectedFriend.lastName}</p>
          </div>
        )}
  
        {/* Modal Buttons */}
        <div>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={handleAddMember}>Add Member</button>
        </div>
      </div>
    );
}

export default AddMemberModal
