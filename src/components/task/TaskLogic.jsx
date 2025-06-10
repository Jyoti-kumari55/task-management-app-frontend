import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";

const TaskLogic = ({ taskId, navigate, children }) => {
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
    team: "",
    teamName: "",
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamMode, setTeamMode] = useState("existing");

  const valueChangeHandler = (key, value) => {
    setTaskDetails((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskDetails({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
      team: "",
      teamName: "",
    });
  };

  // Fetch all teams for dropdown
  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TEAMS.GET_ALL_TEAMS);
      if (response.data?.teams) {
        setTeams(response.data.teams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error.message);
    }
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const tasksList = taskDetails.todoCheckList?.map((todo) => ({
        text: todo,
        completed: false,
      }));

      const requestBody = {
        ...taskDetails,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
        todoCheckList: tasksList,
      };

      if (teamMode === "existing" && taskDetails.team) {
        requestBody.team = taskDetails.team;
      } else if (teamMode === "new" && taskDetails.teamName.trim()) {
        requestBody.teamName = taskDetails.teamName.trim();
        delete requestBody.team;
      }

      const response = await axiosInstance.post(
        API_PATHS.TASKS.CREATE_TASK,
        requestBody
      );

      toast.success(
        `Task created successfully. Team ${
          response.data.teamAction === "created" ? "created" : "updated"
        }.`
      );
      clearData();

      if (teamMode === "new") {
        await fetchTeams();
      }
    } catch (error) {
      console.error("Error occurred while creating a task.", error.message);
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskDetails.todoCheckList?.map((todo) => {
        const prevTodoChecklist = currentTask?.todoCheckList || [];
        const matchedTask = prevTodoChecklist.find(
          (task) => task.text === todo
        );

        return {
          text: todo,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const requestBody = {
        ...taskDetails,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
        todoCheckList: todoList,
      };

      if (teamMode === "existing" && taskDetails.team) {
        requestBody.team = taskDetails.team;
      } else if (teamMode === "new" && taskDetails.teamName.trim()) {
        requestBody.teamName = taskDetails.teamName.trim();
        delete requestBody.team;
      }

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), requestBody);

      toast.success("Task updated successfully.");
      setTimeout(() => {
        navigate("/admin/tasks");
      }, 1000);
    } catch (error) {
      console.log("Error occurred while updating the task.", error.message);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Project task deleted successfully.");
      setTimeout(() => {
        navigate("/admin/tasks");
      }, 1000);
    } catch (error) {
      console.log("Error occurred while deleting a task.", error.message);
      toast.error("Failed to delete task");
    }
  };

  const taskSubmitHandler = async () => {
    setError(null);

    if (!taskDetails.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskDetails.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskDetails.dueDate) {
      setError("Due Date is required.");
      return;
    }
    if (taskDetails.assignedTo?.length === 0) {
      setError("Task not assigned to anyone.");
      return;
    }
    if (taskDetails.todoCheckList?.length === 0) {
      setError("Add at least one todo task.");
      return;
    }

    if (teamMode === "existing" && !taskDetails.team) {
      setError("Please select a team.");
      return;
    }
    if (teamMode === "new" && !taskDetails.teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data?.task;
        setCurrentTask(taskInfo);

        setTaskDetails({
          title: taskInfo?.title,
          description: taskInfo?.description,
          priority: taskInfo?.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((task) => task?._id) || [],
          todoCheckList:
            taskInfo?.todoCheckList?.map((task) => task?.text) || [],
          attachments: taskInfo?.attachments || [],
          team: taskInfo?.team?._id || "",
          teamName: "",
        });

        if (taskInfo?.team?._id) {
          setTeamMode("existing");
        }
      }
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };

  useEffect(() => {
    fetchTeams();
    if (taskId) {
      getTaskDetailsById(taskId);
    }
  }, [taskId]);

  // Pass all necessary props to children components
  return children({
    taskDetails,
    valueChangeHandler,
    teams,
    teamMode,
    setTeamMode,
    error,
    loading,
    taskSubmitHandler,
    deleteTask,
  });
};

export default TaskLogic;
