import React from "react";
import StatCard from "./StatCard";
import { useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";

const UserCard = ({ userInfo, onDelete, currentUserRole }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${userInfo?.name}? This action cannot be undone.`
      )
    ) {
      onDelete && onDelete(userInfo._id);
    }
  };
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full border-2  border-white"
            src={userInfo?.profileImageUrl}
            alt={userInfo?.name}
          />

          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-600">{userInfo?.email}</p>
          </div>
        </div>

        {currentUserRole === "admin" && (
          <button
            className="text-red-600 hover:text-red-800 transition-colors p-1"
            onClick={handleDelete}
            title={`Delete ${userInfo?.name}`}
          >
            <LuTrash2 />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;
