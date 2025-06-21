import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuFileSpreadsheet, LuSquare, LuSquarePlus } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TaskStatusTabs from "../../components/Task/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      const statusSummary = response.data?.statusSummary || {};
      const statusArr = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArr);
    } catch (error) {
      console.error("Error occurred while creating a task.", error.message);
    }
  };

  const clickHandler = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  const downloadReportHandler = async () => {};

  const navigateToCreatePage = () => {
    navigate("/admin/create-task");
  };
  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

            {/* <button
              className="flex lg:hidden download-btn"
              onClick={downloadReportHandler}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button> */}

            <button
              className="flex lg:hidden add-btn2"
              onClick={navigateToCreatePage}
            >
              <LuSquarePlus className="text-sm md:text-base" />
              Create Task
            </button>
          </div>

          {tabs?.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              {/* <button
                className="hidden lg:flex download-btn"
                onClick={downloadReportHandler}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button> */}

              <button
                className="hidden lg:flex add-btn2"
                onClick={navigateToCreatePage}
              >
                <LuSquarePlus className="text-base" />
                Create Task
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((todo, index) => (
            <TaskCard
              key={todo._id}
              title={todo.title}
              description={todo.description}
              priority={todo.priority}
              status={todo.status}
              progress={todo.progress}
              createdAt={todo.createdAt}
              dueDate={todo.dueDate}
              assignedTo={todo.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={todo.attachments?.length || 0}
              completedTodoCount={todo.completedTodoCount || 0}
              todoCheckList={todo.todoCheckList || []}
              onClick={() => {
                clickHandler(todo);
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
