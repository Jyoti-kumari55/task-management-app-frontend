import { LuTrash2 } from "react-icons/lu";
import { PRIORITY_DATA } from "../../utils/data";
import SelectUsers from "../Cards/SelectUsers";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import TodoListInput from "../inputs/TodoListInput";
import AddAttachmentsInput from "../inputs/AddAttachmentsInput";
// import TaskBasicInfo from "./TaskBasicInfo";
// import TaskDetailsGrid from "./TaskDetailsGrid";
// import TaskTeamSelection from "./TaskTeamSelection";
// import TaskTodoSection from "./TaskTodoSection";
// import TaskAttachments from "./TaskAttachments";

const TaskForm = ({
  taskId,
  taskDetails,
  valueChangeHandler,
  teams,
  teamMode,
  setTeamMode,
  error,
  loading,
  onSubmit,
  onDelete,
}) => {
  // Prepare team options for dropdown
  const teamOptions = teams.map((team) => ({
    label: `${team.teamName} (${team.members?.length || 0} members)`,
    value: team._id,
  }));

  return (
    <div className="form-card col-span-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-xl font-medium">
          {taskId ? "Update Task" : "Create Task"}
        </h2>

        {taskId && (
          <button
            className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
            onClick={onDelete}
          >
            <LuTrash2 className="text-base" />
            Delete
          </button>
        )}
      </div>

      {/* Task Title */}
      <div className="mt-4">
        <label className="text-xs font-medium text-slate-600">Task Title</label>
        <input
          placeholder="Title of the Task"
          className="form-input"
          value={taskDetails.title}
          onChange={({ target }) => valueChangeHandler("title", target.value)}
        />
      </div>

      {/* Task Description */}
      <div className="mt-4">
        <label className="text-xs font-medium text-slate-600">
          Task Description
        </label>
        <textarea
          placeholder="Description of the Task"
          className="form-input"
          rows={4}
          value={taskDetails.description}
          onChange={({ target }) =>
            valueChangeHandler("description", target.value)
          }
        ></textarea>
      </div>

      {/* Priority, Due Date, Assign To Grid */}
      <div className="grid grid-cols-12 gap-4 mt-2">
        <div className="col-span-6 md:col-span-4">
          <label className="text-xs font-medium text-slate-600">Priority</label>
          <SelectDropdown
            options={PRIORITY_DATA}
            value={taskDetails.priority}
            onChange={(value) => valueChangeHandler("priority", value)}
            placeholder="Select Priority"
          />
        </div>

        <div className="col-span-6 md:col-span-4">
          <label className="text-xs font-medium text-slate-600">Due Date</label>
          <input
            placeholder="Task due date"
            type="date"
            className="form-input"
            value={taskDetails.dueDate}
            onChange={({ target }) =>
              valueChangeHandler("dueDate", target.value)
            }
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="text-xs font-medium text-slate-600">
            Assign To
          </label>
          <SelectUsers
            selectedUsers={taskDetails.assignedTo}
            setSelectedUsers={(value) => {
              valueChangeHandler("assignedTo", value);
            }}
          />
        </div>
      </div>

      {/* Team Selection Section */}
      <div className="mt-4">
        <label className="text-xs font-medium text-slate-600">Team</label>

        {/* Team Mode Toggle */}
        <div className="flex items-center gap-4 mt-2 mb-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="teamMode"
              value="existing"
              checked={teamMode === "existing"}
              onChange={(e) => setTeamMode(e.target.value)}
              className="text-blue-600"
            />
            Select Existing Team
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="teamMode"
              value="new"
              checked={teamMode === "new"}
              onChange={(e) => setTeamMode(e.target.value)}
              className="text-blue-600"
            />
            Create New Team
          </label>
        </div>

        {/* Team Selection/Creation Input */}
        {teamMode === "existing" ? (
          <SelectDropdown
            options={teamOptions}
            value={taskDetails.team}
            onChange={(value) => valueChangeHandler("team", value)}
            placeholder="Select a team"
          />
        ) : (
          <input
            placeholder="Enter new team name"
            className="form-input"
            value={taskDetails.teamName}
            onChange={({ target }) =>
              valueChangeHandler("teamName", target.value)
            }
          />
        )}

        {teamMode === "new" && (
          <p className="text-xs text-slate-500 mt-1">
            A new team will be created with the assigned members
          </p>
        )}
      </div>

      {/* TODO CheckList */}
      <div className="mt-3">
        <label className="text-xs font-medium text-slate-600">
          TODO CheckList
        </label>
        <TodoListInput
          todoList={taskDetails?.todoCheckList}
          setTodoList={(value) => valueChangeHandler("todoCheckList", value)}
        />
      </div>

      {/* Add Attachments */}
      <div className="mt-3">
        <label className="text-xs font-medium text-slate-600">
          Add Attachments
        </label>
        <AddAttachmentsInput
          attachments={taskDetails.attachments}
          setAttachments={(value) => valueChangeHandler("attachments", value)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-7">
        <button
          type="submit"
          className="add-btn"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "PROCESSING..." : taskId ? "UPDATE TASK" : "CREATE TASK"}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
