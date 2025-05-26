import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuFileSpreadsheet } from "react-icons/lu";
import { IoPeopleOutline } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const UserReports = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(priorityLevelData);
  };

  const getDashboardChart = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error coccured while fetchings tasks.", error);
    }
  };

  useEffect(() => {
    getDashboardChart();

    return () => {};
  }, []);

  const downloadUserReportHandler = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error occured while fetching user reports.",
        error.message
      );
      toast.error(
        "Failed to download user details. Please try again after some time."
      );
    }
  };

  const downloadTaskReportHandler = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error occured while fetching task reports.",
        error.message
      );
      toast.error(
        "Failed to download task details. Please try again after some time."
      );
    }
  };

  return (
    <DashboardLayout activeMenu="Reports">
      <div className="my-5">
        <div className="flex flex-row items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl md:text-xl font-medium whitespace-nowrap">
            Reports
          </h2>
          <div className="flex gap-4 justify-between">
            <button
              className="flex whitespace-nowrap download-user-btn"
              onClick={downloadUserReportHandler}
            >
              <IoPeopleOutline className="text-lg" />
              {/* <LuFileSpreadsheet className="text-lg" /> */}
              Download User Reports
            </button>

            <button
              className="flex whitespace-nowrap download-btn"
              onClick={downloadTaskReportHandler}
            >
              <BiTask className="text-lg" />
              {/* <LuFileSpreadsheet className="text-lg" /> */}
              Download Task Reports
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6 ">
          <div>
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Task Distribution</h5>
              </div>

              <CustomPieChart data={pieChartData} colors={COLORS} />
            </div>
          </div>

          <div>
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Task Priority</h5>
              </div>

              <CustomBarChart data={barChartData} colors={COLORS} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserReports;
// .download-btn {
//   @apply items-center gap-3 text-xs md:text-[13px] text-lime-900 bg-lime-100 px-2 md:px-3 py-2 rounded border border-lime-200 hover:border-lime-400 cursor-pointer
// }
