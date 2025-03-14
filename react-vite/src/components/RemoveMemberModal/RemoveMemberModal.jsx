import './RemoveMemberModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeMemberFromBookclub } from '../../redux/bookclubs';
import { useModal } from '../../context/Modal';
import { getBookclub } from '../../redux/bookclubs'; 

function RemoveMemberModal({ bookclubId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const bookclubMembers = useSelector((state) => state.bookclubs.currentBookclub.members);

    // Remove a member
  const handleRemoveMember = async (userId) => {
    try {
        // Dispatch remove member action
        await dispatch(removeMemberFromBookclub(bookclubId, userId));
        closeModal(); // Close the modal after the member is removed
        // Trigger the refresh of bookclub details after the new member is added
        await dispatch(getBookclub(bookclubId));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <div className="remove-member-modal">
      <h2>Which member would you like to remove?</h2>

      <ul className="members-list">
        {bookclubMembers.length > 0 ? (
          bookclubMembers.map((member) => (
            <li key={member.id} className="member-item">
              {member.firstName} {member.lastName}
              <button
                onClick={() => handleRemoveMember(member.id)} // Remove member on click
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <li>No members to remove</li>
        )}
      </ul>

      <div>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default RemoveMemberModal
