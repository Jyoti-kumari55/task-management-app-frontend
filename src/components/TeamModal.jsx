import { LuX } from "react-icons/lu";
import SelectUsers from "./Cards/SelectUsers";

const TeamModal = ({
  isOpen,
  mode,
  teamName,
  description,
  selectedUsers,
  setTeamName,
  setDescription,
  setSelectedUsers,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {mode === "create" ? "Create New Team" : "Edit Team"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <LuX className="text-xl" />
          </button>
        </div>

        {/* Inputs */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Team Name *</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter team description"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Team Members</label>
          <SelectUsers
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-300 px-6 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
            onClick={onSubmit}
            disabled={!teamName.trim()}
          >
            {mode === "create" ? "Create Team" : "Update Team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
