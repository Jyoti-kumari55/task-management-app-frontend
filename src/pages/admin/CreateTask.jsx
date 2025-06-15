import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteAlert from "../../components/DeleteAlert";
import { LuArrowLeft } from "react-icons/lu";
import TaskLogic from "../../components/task/TaskLogic";
import TaskForm from "../../components/task/TaskForm";
import Modal from "../../components/Modal";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = location.state || {};
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const backClickHandler = () => {
    navigate("/admin/tasks");
  };

  const handleDeleteConfirm = (deleteTaskFn) => {
    deleteTaskFn();
    setOpenDeleteAlert(false);
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <TaskLogic taskId={taskId} navigate={navigate}>
        {({
          taskDetails,
          valueChangeHandler,
          teams,
          teamMode,
          setTeamMode,
          error,
          loading,
          taskSubmitHandler,
          deleteTask,
        }) => (
          <>
            <TaskHeader onBackClick={backClickHandler} />

            <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
              <TaskForm
                taskId={taskId}
                taskDetails={taskDetails}
                valueChangeHandler={valueChangeHandler}
                teams={teams}
                teamMode={teamMode}
                setTeamMode={setTeamMode}
                error={error}
                loading={loading}
                onSubmit={taskSubmitHandler}
                onDelete={() => setOpenDeleteAlert(true)}
              />
            </div>

            <Modal
              onClose={() => setOpenDeleteAlert(false)}
              isOpen={openDeleteAlert}
              title="Delete Task"
            >
              <DeleteAlert
                content="Are you sure want to delete this task."
                onDelete={() => handleDeleteConfirm(deleteTask)}
              />
            </Modal>
          </>
        )}
      </TaskLogic>
    </DashboardLayout>
  );
};

export default CreateTask;

const TaskHeader = ({ onBackClick }) => {
  return (
    <div className="mt-5">
      <button className="card-btn bg-primary" onClick={onBackClick}>
        <LuArrowLeft className="text-base" />
        Go Back
      </button>
    </div>
  );
};
