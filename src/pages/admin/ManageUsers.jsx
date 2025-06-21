import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuSquarePlus, LuX } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import TeamCard from "../../components/Cards/TeamCard";
import toast from "react-hot-toast";
import SelectUsers from "../../components/Cards/SelectUsers";
import TeamModal from "../../components/TeamModal";
import UserList from "../../components/UserList";
import TeamList from "../../components/TeamList";
import CreateUser from "./CreateUser";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const getCurrentUser = async () => {
    try {
      // Assuming you have an endpoint to get current user info
      const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setCurrentUser(res.data.user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };
  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (res.data?.users?.length) setAllUsers(res.data.users);
    } catch (error) {
      console.error("Error in fetching users:", error.message);
      toast.error(error?.response?.data?.error || "Failed to fetch users");
    }
  };

  const getAllTeams = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TEAMS.GET_ALL_TEAMS);
      if (res.data?.teams) setAllTeams(res.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error.message);
      toast.error(error?.response?.data?.error || "Failed to fetch team");
    }
  };

  const handleUserCreated = (newUser) => {
    // Add the new user to the state
    setAllUsers((prevUsers) => [...prevUsers, newUser]);
    setIsCreateUserModalOpen(false);
  };
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      const res = await axiosInstance.delete(
        API_PATHS.USERS.DELETE_USER(userId)
      );
      toast.success(res?.data?.message || "User deleted successfully");

      // Remove the deleted user from the state
      setAllUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );

      // Refresh teams list in case the deleted user was in any teams
      getAllTeams();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === "create") {
        const res = await axiosInstance.post(API_PATHS.TEAMS.CREATE_TEAM, {
          teamName,
          description,
          members: selectedUsers,
        });
        toast.success(res?.data?.message || "Team created");
      } else {
        const res = await axiosInstance.put(
          API_PATHS.TEAMS.UPDATE_TEAM(selectedTeam._id),
          {
            teamName,
            description,
            members: selectedUsers,
          }
        );
        toast.success(res?.data?.message || "Team updated");
      }
      resetModal();
      getAllTeams();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to save team");
    }
  };

  const handleDelete = async (teamId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await axiosInstance.delete(
        API_PATHS.TEAMS.DELETE_TEAM(teamId)
      );
      toast.success(res?.data?.message || "Team deleted");
      getAllTeams();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete team");
    }
  };

  const openModalForEdit = (team) => {
    setSelectedTeam(team);
    setTeamName(team.teamName);
    setDescription(team.description);
    setSelectedUsers(team.members.map((m) => m._id));
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setSelectedTeam(null);
    setTeamName("");
    setDescription("");
    setSelectedUsers([]);
    setModalMode("create");
    setIsModalOpen(false);
  };

  useEffect(() => {
    getCurrentUser();
    getAllUsers();
    getAllTeams();
  }, []);

  return (
    <DashboardLayout activeMenu="Team">
      <div className="mt-5 mb-10">
        <div className="flex justify-between items-center">
          <h2 className="text-base md:text-xl font-medium">Team Members</h2>
          {currentUser?.role === "admin" && (
            <button
              className="flex add-btn2"
              onClick={() => setIsCreateUserModalOpen(true)}
            >
              <LuSquarePlus className="text-sm md:text-base" />
              Create Member
            </button>
          )}
        </div>

        <UserList
          users={allUsers}
          onDeleteUser={handleDeleteUser}
          currentUserRole={currentUser?.role}
        />
        <div className="flex justify-between pt-6">
          <p className="text-base md:text-xl font-medium">Teams</p>
          {currentUser?.role === "admin" && (
            <button
              className="flex add-btn2"
              onClick={() => setIsModalOpen(true)}
            >
              <LuSquarePlus className="text-sm md:text-base" />
              Create Team
            </button>
          )}
        </div>
        <TeamList
          teams={allTeams}
          onEdit={openModalForEdit}
          onDelete={handleDelete}
        />

        <TeamModal
          isOpen={isModalOpen}
          mode={modalMode}
          teamName={teamName}
          description={description}
          selectedUsers={selectedUsers}
          setTeamName={setTeamName}
          setDescription={setDescription}
          setSelectedUsers={setSelectedUsers}
          onClose={resetModal}
          onSubmit={handleSubmit}
        />
        <CreateUser
          isOpen={isCreateUserModalOpen}
          onClose={() => setIsCreateUserModalOpen(false)}
          onUserCreated={handleUserCreated}
        />
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
