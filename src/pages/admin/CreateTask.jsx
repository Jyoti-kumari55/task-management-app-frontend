import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2, LuArrowLeft} from "react-icons/lu";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import SelectUsers from "../../components/Cards/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { taskId } = location.state || {};

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const valueChangeHandler = (key, value) => {
    setTaskDetails((prevDate) => ({ ...prevDate, [key]: value }));
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
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const tasksList = taskDetails.todoCheckList?.map((todo) => ({
        text: todo,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskDetails,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
        todoCheckList: tasksList,
      });
      toast.success("Task created successfully.");
      clearData();
    } catch (error) {
      console.error("Error occurred while creating a task.", error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskDetails.todoCheckList?.map((todo) => {
        const prevTodoChecklist = currentTask?.todoCheckList || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == todo);

        return {
          text: todo,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskDetails,
          dueDate: new Date(taskDetails.dueDate).toISOString(),
          todoCheckList: todoList,
        }
      );
      toast.success("Task updated successfully.");
      setTimeout(() => {
        navigate("/admin/tasks");
      }, 1000);
    } catch (error) {
      console.log("Error occured while updating the task.", error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      const response =  await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Project task deleted successfully.")
      // navigate("/admin/tasks");
      setTimeout(() => {
        navigate("/admin/tasks");
      }, 1000);
    } catch (error) {
      console.log("Error occurred while deleting a task.", error.message);
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
    if (!taskDetails.dueDate.trim()) {
      setError("Due Date is required.");
      return;
    }
    if (!taskDetails.assignedTo?.length === 0) {
      setError("Task not assigned to anyone.");
      return;
    }
    if (!taskDetails.todoCheckList?.length === 0) {
      setError("Add atleast on todo task.");
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
        console.log("99999999: ", response.data);
        const taskInfo = response.data?.task;
        setCurrentTask(taskInfo);
        console.log("jndjnknfkj", taskInfo.title);
        setTaskDetails((prevState) => ({
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
        }));
      }
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
    return () => {};
  }, [taskId]);


  const backClickHandler = () => {
    navigate("/admin/tasks")
  };
  
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
      <button className="card-btn bg-primary" onClick={backClickHandler}>
      <LuArrowLeft  className="text-base" />Go Back</button>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Title of the Task"
                className="form-input"
                value={taskDetails.title}
                onChange={({ target }) =>
                  valueChangeHandler("title", target.value)
                }
              />
            </div>

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

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskDetails.priority}
                  onChange={(value) => valueChangeHandler("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>

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

              <div className="col-span-12 md:col-span-3">
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

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO CheckList
              </label>
              <TodoListInput
                todoList={taskDetails?.todoCheckList}
                setTodoList={(value) =>
                  valueChangeHandler("todoCheckList", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>

              <AddAttachmentsInput
                attachments={taskDetails.attachments}
                setAttachments={(value) =>
                  valueChangeHandler("attachments", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                type="submit"
                className="add-btn"
                onClick={taskSubmitHandler}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        onClose={() => setOpenDeleteAlert(false)}
        isOpen={openDeleteAlert}
        title="Delete Task">
          <DeleteAlert 
          content="Are you sure want to delete this task."
          onDelete={() => deleteTask()} />
        </Modal>

    </DashboardLayout>
  );
};

export default CreateTask;
