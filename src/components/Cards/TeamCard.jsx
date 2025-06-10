import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { MdEdit } from "react-icons/md";

// const TeamCard = ({ teamInfo, onDelete }) => {
//   return (
//     <div className="user-card p-2">
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col items-center gap-3">
//           <h2 className="text-sm font-bold">{teamInfo?.teamName}</h2>
//           {/* <p className="text-xs text-gray-600">{teamInfo?.description}</p> */}
//         </div>
//         <button
//           className="text-red-600 mt-2"
//           onClick={() => onDelete(teamInfo._id)}
//         >
//           <LuTrash2 />
//         </button>
//       </div>
//     </div>
//   );
// };

const TeamCard = ({ teamInfo, onDelete, onEdit }) => {
  return (
    <div className="user-card p-4 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold">{teamInfo?.teamName}</h2>
        <div className="flex gap-2">
          <button
            className="edit-btn text-blue-600 hover:text-blue-800 p-1"
            onClick={() => onEdit && onEdit(teamInfo)}
            title="Edit Team"
          >
            <MdEdit className="" />
          </button>
          <button
            className="text-red-600"
            onClick={() => onDelete && onDelete(teamInfo._id)}
          >
            <LuTrash2 />
          </button>
        </div>
      </div>

      {teamInfo?.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {teamInfo.description}
        </p>
      )}

      {/* Team members count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">
          {teamInfo?.members?.length || 0} member
          {teamInfo?.members?.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Team members avatars */}
      <div className="flex items-center">
        {teamInfo?.members?.slice(0, 4).map((member, index) => (
          <div
            key={member._id || index}
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium -ml-2 first:ml-0 border-2 border-white"
            style={{ zIndex: teamInfo.members.length - index }}
          >
            {member.name?.charAt(0).toUpperCase() ||
              member.email?.charAt(0).toUpperCase()}
          </div>
        ))}

        {teamInfo?.members?.length > 4 && (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium -ml-2 border-2 border-white">
            +{teamInfo.members.length - 4}
          </div>
        )}

        {(!teamInfo?.members || teamInfo.members.length === 0) && (
          <div className="text-xs text-gray-400 italic">
            No members assigned
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
