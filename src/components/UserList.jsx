import UserCard from "./Cards/UserCard";

const UserList = ({ users, onDeleteUser, currentUserRole }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
    {users.map((user) => (
      <UserCard
        key={user._id}
        userInfo={user}
        onDelete={onDeleteUser}
        currentUserRole={currentUserRole}
      />
    ))}
  </div>
);

export default UserList;
