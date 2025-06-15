import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { LuArrowRight } from "react-icons/lu";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import InfoCard from "../../components/Cards/InfoCard";
import TaskListTable from "../../components/Task/TaskListTable";
import { API_PATHS } from "../../utils/apiPaths";
import { addUserSeparator } from "../../utils/helper";

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error coccured while fetchings tasks.", error);
    }
  };

  const clickSeeMore = () => {
    navigate("/user/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="">
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            // icon={ <IoMdCard />}
            label="Total Tasks"
            value={addUserSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />
          <InfoCard
            label="Pending Tasks"
            value={addUserSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-red-500"
          />{" "}
          <InfoCard
            label="In Progress Tasks"
            value={addUserSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />{" "}
          <InfoCard
            label="Completed Tasks"
            value={addUserSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Recent Tasks</h5>
            <button type="" className="card-btn" onClick={clickSeeMore}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>

          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
