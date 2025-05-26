import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_PATHS } from "../../utils/apiPaths";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import axiosInstance from "../../utils/axiosInstance";
import TaskCard from "../../components/Cards/TaskCard";


const UserTask = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  console.log("Frontend user context:", user);

  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  console.log("njdknfkj", filterStatus)

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

  const clickHandler = (taskId) => {
    navigate(`/user/taskDetails/${taskId}`);
  };

  const navigateToCreatePage = () => {
    navigate("/admin/create-task");
  };
  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          {/* <div className="flex items-center justify-between gap-3"> */}
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          {tabs?.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
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
                clickHandler(todo._id);
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserTask;
